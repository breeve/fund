"""AKShare 适配器 - 基金数据获取"""
from typing import List, Optional, Dict

import httpx


class AKShareAdapter:
    def __init__(self):
        self.timeout = 10.0

    async def search_fund(self, keyword: str) -> List[Dict]:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = "https://fund.eastmoney.com/cgi-bin/rankp.cgi"
                params = {
                    "mode": "list",
                    "page": 1,
                    "perPage": 20,
                    "keyWord": keyword,
                }
                response = await client.get(url, params=params)
                response.raise_for_status()
                return []
        except Exception:
            return []

    async def get_fund_info(self, fund_code: str) -> Dict:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"https://fundgz.1234567.com.cn/js/{fund_code}.js"
                response = await client.get(url)
                response.raise_for_status()
                text = response.text
                if text.startswith("jsonpgz("):
                    import json
                    data = json.loads(text[7:-1])
                    return {
                        "name": data.get("name", ""),
                        "nav": data.get("gsz"),
                        "daily_change": data.get("gszzl"),
                        "company": "",
                    }
                return {}
        except Exception:
            return {}

    async def get_fund_nav(self, fund_code: str) -> Optional[Dict]:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"https://fundgz.1234567.com.cn/js/{fund_code}.js"
                response = await client.get(url)
                response.raise_for_status()
                text = response.text
                if text.startswith("jsonpgz("):
                    import json
                    data = json.loads(text[7:-1])
                    return {
                        "nav": data.get("gsz"),
                        "acc_nav": data.get("dwjz"),
                        "daily_change": data.get("gszzl"),
                        "date": data.get("gztime"),
                    }
                return None
        except Exception:
            return None

    async def get_fund_holdings(self, fund_code: str) -> List[Dict]:
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = "https://fundf10.eastmoney.com/FundArchivesDatas.aspx"
                params = {
                    "type": "ggph",
                    "code": fund_code,
                    "topline": "true",
                }
                response = await client.get(url, params=params)
                response.raise_for_status()
                return []
        except Exception:
            return []

    async def health_check(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get("https://www.eastmoney.com")
                return response.status_code == 200
        except Exception:
            return False