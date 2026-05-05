"""房产 Pydantic Schemas"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class PropertyBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    address: Optional[str] = Field(None, max_length=500)
    city: str = Field(default="深圳", max_length=50)
    district: Optional[str] = Field(None, max_length=50)
    block: Optional[str] = Field(None, max_length=50)
    life_circle: Optional[str] = Field(None, max_length=50)


class PropertyCreate(PropertyBase):
    building_year: Optional[int] = None
    total_buildings: Optional[int] = None
    total_units: Optional[int] = None
    current_price: Optional[Decimal] = None
    loan_amount: Optional[Decimal] = None
    loan_remaining: Optional[Decimal] = None
    loan_rate: Optional[Decimal] = None
    monthly_payment: Optional[Decimal] = None
    status: str = Field(default="空闲")
    fields: Optional[dict] = None


class PropertyUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    current_price: Optional[Decimal] = None
    transaction_price: Optional[Decimal] = None
    rent_price: Optional[Decimal] = None
    status: Optional[str] = None
    loan_remaining: Optional[Decimal] = None
    monthly_payment: Optional[Decimal] = None
    fields: Optional[dict] = None


class PropertyResponse(PropertyBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    building_year: Optional[int] = None
    total_buildings: Optional[int] = None
    total_units: Optional[int] = None
    floor_area: Optional[Decimal] = None
    plot_ratio: Optional[Decimal] = None
    green_ratio: Optional[Decimal] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    current_price: Optional[Decimal] = None
    transaction_price: Optional[Decimal] = None
    rent_price: Optional[Decimal] = None
    property_fee: Optional[Decimal] = None
    loan_amount: Optional[Decimal] = None
    loan_remaining: Optional[Decimal] = None
    loan_rate: Optional[Decimal] = None
    monthly_payment: Optional[Decimal] = None
    loan_type: Optional[str] = None
    status: str = None
    property_type: Optional[str] = None
    metro_distance: Optional[int] = None
    metro_line: Optional[str] = None
    school_info: Optional[dict] = None
    created_at: datetime
    updated_at: datetime


class PropertyPriceHistoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    property_id: UUID
    price_date: datetime
    price: Decimal
    price_type: str


class BlockInfo(BaseModel):
    name: str
    district: str
    avg_price: Optional[Decimal] = None
    transaction_count: Optional[int] = None
    on_sell_count: Optional[int] = None
