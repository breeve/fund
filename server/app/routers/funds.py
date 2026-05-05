"""基金 API"""
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory
from app.schemas.fund import FundCreate, FundUpdate, FundResponse, FundSearchResult, FundHoldingResponse
from app.services.fund_service import FundService

router = APIRouter()


async def get_db():
    async with async_session_factory() as session:
        yield session


@router.get("/search", response_model=List[FundSearchResult])
async def search_funds(
    keyword: str = Query(..., min_length=1),
):
    """搜索基金"""
    service = FundService(None)
    return await service.search_funds(keyword)


@router.get("/", response_model=List[FundResponse])
async def list_funds(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """获取用户基金列表"""
    service = FundService(db)
    return await service.list_user_funds(user_id)


@router.get("/{fund_id}", response_model=FundResponse)
async def get_fund(
    fund_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """获取基金详情"""
    service = FundService(db)
    fund = await service.get_fund(fund_id)
    if not fund:
        raise HTTPException(status_code=404, detail="基金不存在")
    return fund


@router.post("/", response_model=FundResponse, status_code=201)
async def create_fund_holding(
    fund_data: FundCreate,
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """添加基金持仓"""
    service = FundService(db)
    return await service.create_fund_holding(user_id, fund_data)


@router.put("/{fund_id}", response_model=FundResponse)
async def update_fund_holding(
    fund_id: UUID,
    fund_data: FundUpdate,
    db: AsyncSession = Depends(get_db),
):
    """更新基金持仓"""
    service = FundService(db)
    fund = await service.update_fund_holding(fund_id, fund_data)
    if not fund:
        raise HTTPException(status_code=404, detail="基金不存在")
    return fund


@router.delete("/{fund_id}", status_code=204)
async def delete_fund_holding(
    fund_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """删除基金持仓"""
    service = FundService(db)
    success = await service.delete_fund_holding(fund_id)
    if not success:
        raise HTTPException(status_code=404, detail="基金不存在")


@router.get("/{fund_id}/holdings", response_model=List[FundHoldingResponse])
async def get_fund_holdings(
    fund_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """获取基金持仓明细（重仓股）"""
    service = FundService(db)
    return await service.get_fund_holdings(fund_id)


@router.post("/{fund_id}/refresh-nav")
async def refresh_fund_nav(
    fund_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """刷新基金净值"""
    service = FundService(db)
    result = await service.refresh_fund_nav(fund_id)
    if not result:
        raise HTTPException(status_code=400, detail="净值刷新失败")
    return result
