"""房产数据模型 - 深圳房产分析"""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional, List

from sqlalchemy import String, Numeric, DateTime, Text, ForeignKey, Column
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel


class Property(BaseModel):
    """房产模型"""
    __tablename__ = "properties"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)

    # 基础信息
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    address: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    city: Mapped[str] = mapped_column(String(50), default="深圳")
    district: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    block: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    life_circle: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # 建筑信息
    building_year: Mapped[Optional[int]] = mapped_column(nullable=True)
    total_buildings: Mapped[Optional[int]] = mapped_column(nullable=True)
    total_units: Mapped[Optional[int]] = mapped_column(nullable=True)
    floor_area: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    plot_ratio: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)
    green_ratio: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 2), nullable=True)

    # 位置坐标
    latitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 7), nullable=True)
    longitude: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 7), nullable=True)

    # 价格信息
    current_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 2), nullable=True)
    transaction_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 2), nullable=True)
    rent_price: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 2), nullable=True)
    property_fee: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 2), nullable=True)

    # 贷款信息
    loan_amount: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 2), nullable=True)
    loan_remaining: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 2), nullable=True)
    loan_rate: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 4), nullable=True)
    monthly_payment: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)
    loan_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # 状态
    status: Mapped[str] = mapped_column(String(20), default="空闲")
    property_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    # 扩展数据
    fields: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    school_info: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # 交通信息
    metro_distance: Mapped[Optional[int]] = mapped_column(nullable=True)
    metro_line: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # 时间戳
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Property(id={self.id}, name={self.name}, district={self.district})>"


class PropertyPriceHistory(BaseModel):
    """房产价格历史"""
    __tablename__ = "property_price_history"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    property_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("properties.id"), nullable=False)
    price_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    price_type: Mapped[str] = mapped_column(String(20), default="挂牌价")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
