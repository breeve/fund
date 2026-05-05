"""资产业务逻辑"""
from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.asset import Asset
from app.schemas.asset import AssetCreate, AssetUpdate


class AssetService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def list_assets(self, category: Optional[str] = None) -> List[Asset]:
        query = select(Asset)
        if category:
            query = query.where(Asset.category == category)
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_asset(self, asset_id: UUID) -> Optional[Asset]:
        result = await self.db.execute(select(Asset).where(Asset.id == asset_id))
        return result.scalar_one_or_none()

    async def create_asset(self, user_id: UUID, asset_data: AssetCreate) -> Asset:
        asset = Asset(
            user_id=user_id,
            name=asset_data.name,
            category=asset_data.category,
            amount=asset_data.amount,
            currency=asset_data.currency,
            sub_type=asset_data.sub_type,
            tags=asset_data.tags,
            fields=asset_data.fields,
        )
        self.db.add(asset)
        await self.db.commit()
        await self.db.refresh(asset)
        return asset

    async def update_asset(self, asset_id: UUID, asset_data: AssetUpdate) -> Optional[Asset]:
        asset = await self.get_asset(asset_id)
        if not asset:
            return None

        update_data = asset_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(asset, field, value)

        await self.db.commit()
        await self.db.refresh(asset)
        return asset

    async def delete_asset(self, asset_id: UUID) -> bool:
        asset = await self.get_asset(asset_id)
        if not asset:
            return False

        await self.db.delete(asset)
        await self.db.commit()
        return True
