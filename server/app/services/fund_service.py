"""基金业务逻辑"""
import logging
from typing import List, Optional, Dict
from uuid import UUID
from concurrent.futures import ThreadPoolExecutor

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fund import Fund, FundHolding
from app.schemas.fund import FundCreate, FundUpdate, FundSearchResult
from app.adapters.akshare_adapter import AKShareAdapter

logger = logging.getLogger(__name__)

# 用于运行同步代码的线程池
_executor = ThreadPoolExecutor(max_workers=4)


class FundService:
    def __init__(self, db: AsyncSession = None):
        self.db = db
        self.adapter = AKShareAdapter()

    async def search_funds(self, keyword: str) -> List[FundSearchResult]:
        """搜索基金"""
        logger.info(f"search_funds 调用 adapter.search_fund: keyword={keyword}")
        # akshare 函数是同步的，需要在线程池中运行
        loop = __import__('asyncio').get_running_loop()
        results = await loop.run_in_executor(_executor, self.adapter.search_fund, keyword)
        logger.info(f"search_funds 返回: {len(results)} 条")
        return [FundSearchResult(**r) for r in results]

    async def list_user_funds(self, user_id: UUID) -> List[Fund]:
        if not self.db:
            logger.warning(f"list_user_funds: 无数据库会话, user_id={user_id}")
            return []
        logger.info(f"查询用户基金列表: user_id={user_id}")
        result = await self.db.execute(select(Fund).where(Fund.user_id == user_id))
        funds = result.scalars().all()
        logger.info(f"查询到 {len(funds)} 条基金")
        return funds

    async def get_fund(self, fund_id: UUID) -> Optional[Fund]:
        if not self.db:
            return None
        result = await self.db.execute(select(Fund).where(Fund.id == fund_id))
        return result.scalar_one_or_none()

    async def create_fund_holding(self, user_id: UUID, fund_data: FundCreate) -> Fund:
        if not self.db:
            logger.error("create_fund_holding: 需要数据库会话")
            raise ValueError("Database session required")

        logger.info(f"获取基金信息: code={fund_data.code}")
        loop = __import__('asyncio').get_running_loop()
        fund_info = await loop.run_in_executor(_executor, self.adapter.get_fund_info, fund_data.code)
        logger.info(f"基金信息: {fund_info}")

        fund = Fund(
            user_id=user_id,
            code=fund_data.code,
            name=fund_data.name,
            fund_type=fund_data.fund_type,
            shares=fund_data.shares,
            cost=fund_data.cost,
            total_cost=fund_data.total_cost,
            company=fund_info.get("company"),
            management_fee=fund_info.get("management_fee"),
            custody_fee=fund_info.get("custody_fee"),
        )

        logger.info(f"保存基金持仓到数据库: user_id={user_id}")
        self.db.add(fund)
        await self.db.commit()
        await self.db.refresh(fund)
        logger.info(f"基金持仓创建成功: id={fund.id}")
        return fund

    async def update_fund_holding(self, fund_id: UUID, fund_data: FundUpdate) -> Optional[Fund]:
        if not self.db:
            return None

        fund = await self.get_fund(fund_id)
        if not fund:
            return None

        update_data = fund_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(fund, field, value)

        if fund.shares and fund.nav:
            fund.current_value = fund.shares * fund.nav
            if fund.total_cost:
                fund.profit = fund.current_value - fund.total_cost

        await self.db.commit()
        await self.db.refresh(fund)
        return fund

    async def delete_fund_holding(self, fund_id: UUID) -> bool:
        if not self.db:
            return False

        fund = await self.get_fund(fund_id)
        if not fund:
            return False

        await self.db.delete(fund)
        await self.db.commit()
        return True

    async def get_fund_holdings(self, fund_id: UUID) -> List[FundHolding]:
        if not self.db:
            return []

        fund = await self.get_fund(fund_id)
        if fund:
            loop = __import__('asyncio').get_running_loop()
            holdings = await loop.run_in_executor(_executor, self.adapter.get_fund_holdings, fund.code)
            return holdings

        result = await self.db.execute(
            select(FundHolding).where(FundHolding.fund_id == fund_id)
        )
        return result.scalars().all()

    async def refresh_fund_nav(self, fund_id: UUID) -> Optional[dict]:
        if not self.db:
            return None

        fund = await self.get_fund(fund_id)
        if not fund:
            return None

        loop = __import__('asyncio').get_running_loop()
        nav_data = await loop.run_in_executor(_executor, self.adapter.get_fund_nav, fund.code)
        if nav_data:
            fund.nav = nav_data.get("nav")
            fund.acc_nav = nav_data.get("acc_nav")
            fund.daily_change = nav_data.get("daily_change")
            fund.nav_updated_at = nav_data.get("date")
            await self.db.commit()
            await self.db.refresh(fund)

        return nav_data

    # 以下是同步方法，供路由直接调用（通过基金代码查询）
    def get_fund_nav(self, fund_code: str) -> Optional[dict]:
        """获取基金净值"""
        logger.info(f"get_fund_nav: fund_code={fund_code}")
        return self.adapter.get_fund_nav(fund_code)

    def get_fund_info(self, fund_code: str) -> Optional[dict]:
        """获取基金基本信息"""
        logger.info(f"get_fund_info: fund_code={fund_code}")
        return self.adapter.get_fund_info(fund_code)

    def get_fund_holdings(self, fund_code: str) -> List[Dict]:
        """获取公开基金持仓明细"""
        logger.info(f"get_fund_holdings: fund_code={fund_code}")
        return self.adapter.get_fund_holdings(fund_code)

    def get_fund_nav_history(self, fund_code: str, period: str = "近1年") -> List[Dict]:
        """获取基金净值历史"""
        logger.info(f"get_fund_nav_history: fund_code={fund_code}, period={period}")
        return self.adapter.get_fund_nav_history(fund_code, period)

    def get_fund_analysis(self, fund_code: str) -> dict:
        """获取基金分析数据"""
        logger.info(f"get_fund_analysis: fund_code={fund_code}")
        # 获取基本信息
        info = self.adapter.get_fund_info(fund_code)
        # 获取净值
        nav = self.adapter.get_fund_nav(fund_code)
        # 获取持仓
        holdings = self.adapter.get_fund_holdings(fund_code)

        return {
            "code": fund_code,
            "name": info.get("name") if info else None,
            "type": info.get("type") if info else None,
            "company": info.get("company") if info else None,
            "nav": nav.get("nav") if nav else None,
            "daily_change": nav.get("daily_change") if nav else None,
            "acc_nav": nav.get("acc_nav") if nav else None,
            "holdings": holdings,
        }