"""AKShare 适配器 - 基金数据获取（使用 akshare 库）"""
import logging
import time
import threading
from typing import List, Optional, Dict

import pandas as pd
import requests

logger = logging.getLogger(__name__)

# 请求配置
_TIMEOUT = 5  # 5秒超时
_MAX_RETRIES = 20  # 最多重试20次

# 设置全局 requests 超时
requests.adapters.DEFAULT_TIMEOUT = _TIMEOUT

# 基金缓存（5分钟过期）
_fund_list_cache = {
    "data": None,
    "timestamp": 0,
    "lock": threading.Lock()
}
_CACHE_TTL = 300  # 5分钟


def _get_cached_fund_list():
    """获取缓存的基金列表"""
    now = time.time()
    with _fund_list_cache["lock"]:
        if _fund_list_cache["data"] is not None and (now - _fund_list_cache["timestamp"]) < _CACHE_TTL:
            return _fund_list_cache["data"]
        return None


def _set_cached_fund_list(df):
    """设置基金列表缓存"""
    with _fund_list_cache["lock"]:
        _fund_list_cache["data"] = df
        _fund_list_cache["timestamp"] = time.time()


def _retry_call(func, *args, **kwargs):
    """带重试的函数调用"""
    last_error = None
    for attempt in range(_MAX_RETRIES):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            last_error = e
            if attempt < _MAX_RETRIES - 1:
                logger.warning(f"Attempt {attempt + 1} failed, retrying...")
                time.sleep(0.5)
    raise last_error if last_error else Exception("All attempts failed")


class AKShareAdapter:
    """使用 AKShare 库获取基金数据"""

    def search_fund(self, keyword: str) -> List[Dict]:
        """搜索基金 - 使用天天基金概况接口验证基金代码"""
        try:
            from akshare.fund.fund_overview_em import fund_overview_em
            df = _retry_call(fund_overview_em, keyword)
            if df is not None and not df.empty:
                info_dict = df.T.to_dict('records')[0] if len(df.T.to_dict('records')) > 0 else {}
                return [{
                    "code": keyword,
                    "name": info_dict.get("基金简称", ""),
                    "fund_type": info_dict.get("基金类型", ""),
                    "company": info_dict.get("基金管理人", ""),
                }]
            return []
        except Exception as e:
            logger.warning(f"search_fund failed for {keyword}: {e}")
            return []

    def get_fund_info(self, fund_code: str) -> Dict:
        """获取基金基本信息 - 使用天天基金概况接口"""
        try:
            from akshare.fund.fund_overview_em import fund_overview_em
            df = _retry_call(fund_overview_em, fund_code)
            if df is not None and not df.empty:
                info_dict = df.T.to_dict('records')[0] if len(df.T.to_dict('records')) > 0 else {}
                return {
                    "name": info_dict.get("基金简称", ""),
                    "type": info_dict.get("基金类型", ""),
                    "company": info_dict.get("基金管理人", ""),
                    "establish_date": info_dict.get("成立日期/规模", "").split(" / ")[0] if info_dict.get("成立日期/规模") else "",
                    "management_fee": info_dict.get("管理费率", ""),
                    "custody_fee": info_dict.get("托管费率", ""),
                }
        except Exception as e:
            logger.warning(f"fund_overview_em failed for {fund_code}: {e}")
        return {}

    def get_fund_nav(self, fund_code: str) -> Optional[Dict]:
        """获取基金实时净值"""
        try:
            from akshare.fund.fund_em import fund_open_fund_info_em
            df = _retry_call(fund_open_fund_info_em, fund_code, indicator="单位净值走势", period="近1年")
            if df is not None and not df.empty:
                latest = df.iloc[-1]
                daily_change = float(latest.get("日增长率", 0)) if pd.notna(latest.get("日增长率")) else None
                return {
                    "nav": float(latest.get("单位净值", 0)) if pd.notna(latest.get("单位净值")) else None,
                    "acc_nav": None,
                    "daily_change": daily_change,
                    "date": str(latest.get("净值日期", "")),
                }
        except Exception as e:
            logger.warning(f"get_fund_nav failed for {fund_code}: {e}")
        return None

    def get_fund_nav_history(self, fund_code: str, period: str = "近1年") -> List[Dict]:
        """获取基金净值历史"""
        try:
            from akshare.fund.fund_em import fund_open_fund_info_em
            df = _retry_call(fund_open_fund_info_em, fund_code, indicator="单位净值走势", period=period)
            if df is not None and not df.empty:
                results = []
                for _, row in df.iterrows():
                    results.append({
                        "date": str(row.get("净值日期", "")),
                        "nav": float(row.get("单位净值", 0)) if pd.notna(row.get("单位净值")) else None,
                        "daily_change": float(row.get("日增长率", 0)) if pd.notna(row.get("日增长率")) else None,
                    })
                return results
            return []
        except Exception as e:
            logger.error(f"get_fund_nav_history error for {fund_code}: {e}")
            return []

    def get_fund_holdings(self, fund_code: str) -> List[Dict]:
        """获取基金持仓明细"""
        try:
            from akshare.fund.fund_portfolio_em import fund_portfolio_hold_em
            df = _retry_call(fund_portfolio_hold_em, fund_code)
            if df is not None and not df.empty:
                results = []
                for _, row in df.iterrows():
                    results.append({
                        "stock_code": str(row.get("股票代码", "")),
                        "stock_name": str(row.get("股票名称", "")),
                        "hold_ratio": float(row.get("占净值比例", 0)) if pd.notna(row.get("占净值比例")) else None,
                        "shares": row.get("持股数"),
                        "market_value": row.get("持仓市值"),
                        "quarter": row.get("季度"),
                    })
                return results
            return []
        except Exception as e:
            logger.error(f"get_fund_holdings error for {fund_code}: {e}")
            return []

    def get_fund_dividend(self, fund_code: str, year: str = "2025") -> List[Dict]:
        """获取基金分红信息"""
        try:
            from akshare.fund.fund_fhsp_em import fund_fh_em
            df = _retry_call(fund_fh_em, year=year, typ="", rank="BZDM", sort="asc", page=-1)
            if df is not None and not df.empty:
                filtered = df[df['基金代码'] == fund_code]
                if filtered.empty:
                    for y in [str(int(year)-1), str(int(year)-2)]:
                        df_prev = _retry_call(fund_fh_em, year=y, typ="", rank="BZDM", sort="asc", page=-1)
                        filtered = df_prev[df_prev['基金代码'] == fund_code]
                        if not filtered.empty:
                            break

                results = []
                for _, row in filtered.iterrows():
                    results.append({
                        "date": str(row.get("分红发放日期", "")),
                        "amount": float(row.get("每份分红", 0)) if pd.notna(row.get("每份分红")) else None,
                        "record_date": str(row.get("权益登记日", "")),
                        "pay_date": str(row.get("分红发放日", "")),
                    })
                return results
            return []
        except Exception as e:
            logger.error(f"get_fund_dividend error for {fund_code}: {e}")
            return []

    def get_fund_analysis(self, fund_code: str) -> Dict:
        """获取基金分析数据"""
        info = self.get_fund_info(fund_code)
        nav = self.get_fund_nav(fund_code)
        history = self.get_fund_nav_history(fund_code, "近1年")
        holdings = self.get_fund_holdings(fund_code)

        return {
            "code": fund_code,
            "name": info.get("name") if info else None,
            "type": info.get("type") if info else None,
            "company": info.get("company") if info else None,
            "nav": nav.get("nav") if nav else None,
            "daily_change": nav.get("daily_change") if nav else None,
            "acc_nav": nav.get("acc_nav") if nav else None,
            "date": nav.get("date") if nav else None,
            "history": history[-30:] if len(history) > 30 else history,
            "holdings": holdings[:10] if len(holdings) > 10 else holdings,
        }

    def health_check(self) -> bool:
        """健康检查"""
        try:
            from akshare.fund.fund_overview_em import fund_overview_em
            df = _retry_call(fund_overview_em, "000001")
            return df is not None and not df.empty
        except Exception:
            return False