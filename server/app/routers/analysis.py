"""分析 API"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory
from app.schemas.asset import AssetSummary
from app.services.analysis_service import AnalysisService

router = APIRouter()


async def get_db():
    async with async_session_factory() as session:
        yield session


@router.get("/summary", response_model=AssetSummary)
async def get_asset_summary(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """获取资产汇总"""
    service = AnalysisService(db)
    return await service.get_asset_summary(user_id)


@router.get("/liquidity")
async def analyze_liquidity(
    user_id: UUID,
    monthly_expense: float = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """流动性分析"""
    service = AnalysisService(db)
    return await service.analyze_liquidity(user_id, monthly_expense)


@router.get("/allocation")
async def analyze_allocation(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """资产配置分析"""
    service = AnalysisService(db)
    return await service.analyze_allocation(user_id)


@router.get("/debt")
async def analyze_debt(
    user_id: UUID,
    monthly_income: float = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """偿债能力分析"""
    service = AnalysisService(db)
    return await service.analyze_debt(user_id, monthly_income)


@router.get("/health-score")
async def calculate_health_score(
    user_id: UUID,
    monthly_expense: float = Query(...),
    monthly_income: float = Query(...),
    db: AsyncSession = Depends(get_db),
):
    """财务健康评分"""
    service = AnalysisService(db)
    return await service.calculate_health_score(user_id, monthly_expense, monthly_income)
