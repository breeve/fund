"""基金数据模型"""
import uuid
from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Optional, List

from sqlalchemy import String, Numeric, DateTime, Text, ForeignKey, Column
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import BaseModel


class FundType(str, Enum):
    """基金类型"""
    STOCK = "股票型"
    HYBRID = "混合型"
    INDEX = "指数型"
    BOND = "债券型"
    MONEY = "货币型"
    QDII = "QDII"
    OTHER = "其他"


class Fund(BaseModel):
    """基金模型"""
    __tablename__ = "funds"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), nullable=False, index=True)

    # 基金基本信息
    code: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    fund_type: Mapped[FundType] = mapped_column(String(20), nullable=False)
    company: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # 净值信息
    nav: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4), nullable=True)
    acc_nav: Mapped[Optional[Decimal]] = mapped_column(Numeric(10, 4), nullable=True)
    daily_change: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 4), nullable=True)

    # 用户持仓
    shares: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4), nullable=True)
    cost: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 4), nullable=True)
    total_cost: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 2), nullable=True)
    current_value: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 2), nullable=True)
    profit: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 2), nullable=True)

    # 费用信息
    management_fee: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 4), nullable=True)
    custody_fee: Mapped[Optional[Decimal]] = mapped_column(Numeric(5, 4), nullable=True)

    # 风险指标
    volatility: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 4), nullable=True)
    max_drawdown: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 4), nullable=True)
    sharpe_ratio: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 4), nullable=True)

    # 扩展数据
    fields: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    # 时间戳
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    nav_updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Fund(id={self.id}, code={self.code}, name={self.name})>"


class FundHolding(BaseModel):
    """基金持仓明细"""
    __tablename__ = "fund_holdings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    fund_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("funds.id"), nullable=False)

    # 持仓股票/债券信息
    symbol: Mapped[str] = mapped_column(String(20), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    proportion: Mapped[Decimal] = mapped_column(Numeric(8, 4), nullable=False)
    shares: Mapped[Optional[Decimal]] = mapped_column(Numeric(16, 2), nullable=True)
    market_value: Mapped[Optional[Decimal]] = mapped_column(Numeric(18, 2), nullable=True)

    # 报告期
    report_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    report_type: Mapped[str] = mapped_column(String(10), default="季报")

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
