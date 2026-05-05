"""基金 Pydantic Schemas"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field, ConfigDict


class FundBase(BaseModel):
    code: str = Field(..., min_length=6, max_length=20)
    name: str = Field(..., min_length=1, max_length=200)
    fund_type: str = Field(...)


class FundCreate(FundBase):
    shares: Optional[Decimal] = None
    cost: Optional[Decimal] = None
    total_cost: Optional[Decimal] = None


class FundUpdate(BaseModel):
    shares: Optional[Decimal] = None
    cost: Optional[Decimal] = None
    total_cost: Optional[Decimal] = None


class FundResponse(FundBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    company: Optional[str] = None
    nav: Optional[Decimal] = None
    acc_nav: Optional[Decimal] = None
    daily_change: Optional[Decimal] = None
    shares: Optional[Decimal] = None
    cost: Optional[Decimal] = None
    total_cost: Optional[Decimal] = None
    current_value: Optional[Decimal] = None
    profit: Optional[Decimal] = None
    management_fee: Optional[Decimal] = None
    custody_fee: Optional[Decimal] = None
    volatility: Optional[Decimal] = None
    max_drawdown: Optional[Decimal] = None
    sharpe_ratio: Optional[Decimal] = None
    nav_updated_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime


class FundHoldingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    fund_id: UUID
    symbol: str
    name: str
    proportion: Decimal
    shares: Optional[Decimal] = None
    market_value: Optional[Decimal] = None
    report_date: datetime
    report_type: str


class FundSearchResult(BaseModel):
    code: str
    name: str
    fund_type: str
    company: Optional[str] = None
