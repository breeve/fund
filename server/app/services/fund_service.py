"""基金业务逻辑"""
from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fund import Fund, FundHolding
from app.schemas.fund import FundCreate, FundUpdate, FundSearchResult
from app.adapters.akshare_adapter import AKShareAdapter


class FundService:
    def __init__(self, db: AsyncSession = None):
        self.db = db
        self.adapter = AKShareAdapter()

    async def search_funds(self, keyword: str) -> List[FundSearchResult]:
        results = await self.adapter.search_fund(keyword)
        return [FundSearchResult(**r) for r in results]

    async def list_user_funds(self, user_id: UUID) -> List[Fund]:
        if not self.db:
            return []
        result = await self.db.execute(select(Fund).where(Fund.user_id == user_id))
        return result.scalars().all()

    async def get_fund(self, fund_id: UUID) -> Optional[Fund]:
        if not self.db:
            return None
        result = await self.db.execute(select(Fund).where(Fund.id == fund_id))
        return result.scalar_one_or_none()

    async def create_fund_holding(self, user_id: UUID, fund_data: FundCreate) -> Fund:
        if not self.db:
            raise ValueError("Database session required")

        fund_info = await self.adapter.get_fund_info(fund_data.code)

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

        self.db.add(fund)
        await self.db.commit()
        await self.db.refresh(fund)
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
            holdings = await self.adapter.get_fund_holdings(fund.code)
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

        nav_data = await self.adapter.get_fund_nav(fund.code)
        if nav_data:
            fund.nav = nav_data.get("nav")
            fund.acc_nav = nav_data.get("acc_nav")
            fund.daily_change = nav_data.get("daily_change")
            fund.nav_updated_at = nav_data.get("date")
            await self.db.commit()
            await self.db.refresh(fund)

        return nav_data
