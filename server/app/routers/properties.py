"""房产 API"""
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory
from app.schemas.property import (
    PropertyCreate, PropertyUpdate, PropertyResponse, PropertyPriceHistoryResponse, BlockInfo
)
from app.services.property_service import PropertyService

router = APIRouter()


async def get_db():
    async with async_session_factory() as session:
        yield session


@router.get("/districts", response_model=List[BlockInfo])
async def get_district_blocks(
    district: Optional[str] = Query(None),
):
    """获取区域下的板块列表"""
    service = PropertyService(None)
    return await service.list_blocks(district)


@router.get("/blocks", response_model=List[BlockInfo])
async def list_blocks(
    district: Optional[str] = Query(None),
):
    """获取板块列表及基础信息"""
    service = PropertyService(None)
    return await service.list_blocks(district)


@router.get("/", response_model=List[PropertyResponse])
async def list_properties(
    user_id: UUID,
    district: Optional[str] = Query(None),
    block: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """获取房产列表"""
    service = PropertyService(db)
    return await service.list_properties(user_id, district, block, status)


@router.get("/{property_id}", response_model=PropertyResponse)
async def get_property(
    property_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """获取房产详情"""
    service = PropertyService(db)
    prop = await service.get_property(property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="房产不存在")
    return prop


@router.post("/", response_model=PropertyResponse, status_code=201)
async def create_property(
    property_data: PropertyCreate,
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """创建房产"""
    service = PropertyService(db)
    return await service.create_property(user_id, property_data)


@router.put("/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: UUID,
    property_data: PropertyUpdate,
    db: AsyncSession = Depends(get_db),
):
    """更新房产"""
    service = PropertyService(db)
    prop = await service.update_property(property_id, property_data)
    if not prop:
        raise HTTPException(status_code=404, detail="房产不存在")
    return prop


@router.delete("/{property_id}", status_code=204)
async def delete_property(
    property_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """删除房产"""
    service = PropertyService(db)
    success = await service.delete_property(property_id)
    if not success:
        raise HTTPException(status_code=404, detail="房产不存在")


@router.get("/{property_id}/price-history", response_model=List[PropertyPriceHistoryResponse])
async def get_price_history(
    property_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """获取房产价格历史"""
    service = PropertyService(db)
    return await service.get_price_history(property_id)
