"""资产 Pydantic Schemas"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class AssetBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category: str = Field(...)
    amount: Decimal = Field(..., gt=0)
    currency: str = Field(default="CNY", max_length=10)
    sub_type: Optional[str] = Field(None, max_length=100)
    tags: List[str] = Field(default_factory=list)


class AssetCreate(AssetBase):
    fields: Optional[dict] = None


class AssetUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[str] = None
    amount: Optional[Decimal] = Field(None, gt=0)
    currency: Optional[str] = None
    sub_type: Optional[str] = None
    tags: Optional[List[str]] = None
    fields: Optional[dict] = None


class AssetResponse(AssetBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    fields: Optional[dict] = None
    created_at: datetime
    updated_at: datetime


class AssetFilter(BaseModel):
    category: Optional[str] = None
    sub_type: Optional[str] = None
    tags: Optional[List[str]] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None


class AssetSummary(BaseModel):
    total_assets: Decimal
    total_liabilities: Decimal
    net_worth: Decimal
    category_breakdown: dict
    liability_breakdown: dict

    model_config = ConfigDict(from_attributes=True)
