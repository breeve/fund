"""房产业务逻辑"""
from typing import List, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.property import Property, PropertyPriceHistory
from app.schemas.property import PropertyCreate, PropertyUpdate, BlockInfo
from app.adapters.amap_adapter import AMapAdapter


class PropertyService:
    def __init__(self, db: AsyncSession = None):
        self.db = db
        self.amap_adapter = AMapAdapter()

    async def list_blocks(self, district: Optional[str] = None) -> List[BlockInfo]:
        blocks = await self.amap_adapter.get_district_blocks(district or "深圳")
        return [BlockInfo(**b) for b in blocks]

    async def list_properties(
        self,
        user_id: UUID,
        district: Optional[str] = None,
        block: Optional[str] = None,
        status: Optional[str] = None,
    ) -> List[Property]:
        if not self.db:
            return []

        query = select(Property).where(Property.user_id == user_id)
        if district:
            query = query.where(Property.district == district)
        if block:
            query = query.where(Property.block == block)
        if status:
            query = query.where(Property.status == status)

        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_property(self, property_id: UUID) -> Optional[Property]:
        if not self.db:
            return None
        result = await self.db.execute(select(Property).where(Property.id == property_id))
        return result.scalar_one_or_none()

    async def create_property(self, user_id: UUID, property_data: PropertyCreate) -> Property:
        if not self.db:
            raise ValueError("Database session required")

        prop = Property(
            user_id=user_id,
            name=property_data.name,
            address=property_data.address,
            city=property_data.city,
            district=property_data.district,
            block=property_data.block,
            life_circle=property_data.life_circle,
            building_year=property_data.building_year,
            total_buildings=property_data.total_buildings,
            total_units=property_data.total_units,
            current_price=property_data.current_price,
            loan_amount=property_data.loan_amount,
            loan_remaining=property_data.loan_remaining,
            loan_rate=property_data.loan_rate,
            monthly_payment=property_data.monthly_payment,
            status=property_data.status,
            fields=property_data.fields,
        )

        self.db.add(prop)
        await self.db.commit()
        await self.db.refresh(prop)
        return prop

    async def update_property(self, property_id: UUID, property_data: PropertyUpdate) -> Optional[Property]:
        if not self.db:
            return None

        prop = await self.get_property(property_id)
        if not prop:
            return None

        update_data = property_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(prop, field, value)

        await self.db.commit()
        await self.db.refresh(prop)
        return prop

    async def delete_property(self, property_id: UUID) -> bool:
        if not self.db:
            return False

        prop = await self.get_property(property_id)
        if not prop:
            return False

        await self.db.delete(prop)
        await self.db.commit()
        return True

    async def get_price_history(self, property_id: UUID) -> List[PropertyPriceHistory]:
        if not self.db:
            return []
        result = await self.db.execute(
            select(PropertyPriceHistory)
            .where(PropertyPriceHistory.property_id == property_id)
            .order_by(PropertyPriceHistory.price_date.desc())
        )
        return result.scalars().all()
