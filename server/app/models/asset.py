"""资产数据模型"""
import uuid
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional, List

from sqlalchemy import String, Numeric, DateTime, Text, ForeignKey, Table, Column
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel


class AssetCategory(str, Enum):
    """资产类别枚举"""
    LIQUID = "流动资产"          # 高度流动
    FIXED = "固定资产"           # 低流动
    FINANCIAL = "金融投资"       # 中等流动
    PROTECTION = "保障类"       # 长期锁定
    LIABILITY = "负债与权益调整"  # 减项


# 资产标签关联表
asset_tags = Table(
    "asset_tags",
    BaseModel.metadata,
    Column("asset_id", UUID(as_uuid=True), ForeignKey("assets.id"), primary_key=True),
    Column("tag", String(50), primary_key=True),
)


class Asset(BaseModel):
    """资产模型"""
    __tablename__ = "assets"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    category: Mapped[AssetCategory] = mapped_column(String(50), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), default="CNY")
    sub_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    fields: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    tags: Mapped[List[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Asset(id={self.id}, name={self.name}, amount={self.amount})>"
