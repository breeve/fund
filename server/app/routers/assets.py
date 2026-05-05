"""资产 CRUD API"""
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse, AssetSummary
from app.services.asset_service import AssetService

router = APIRouter()


async def get_db():
    async with async_session_factory() as session:
        yield session


@router.get("/", response_model=List[AssetResponse])
async def list_assets(
    category: str = None,
    db: AsyncSession = Depends(get_db),
):
    """获取资产列表"""
    service = AssetService(db)
    return await service.list_assets(category=category)


@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(
    asset_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """获取单个资产"""
    service = AssetService(db)
    asset = await service.get_asset(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="资产不存在")
    return asset


@router.post("/", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
async def create_asset(
    asset_data: AssetCreate,
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """创建资产"""
    service = AssetService(db)
    return await service.create_asset(user_id, asset_data)


@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(
    asset_id: UUID,
    asset_data: AssetUpdate,
    db: AsyncSession = Depends(get_db),
):
    """更新资产"""
    service = AssetService(db)
    asset = await service.update_asset(asset_id, asset_data)
    if not asset:
        raise HTTPException(status_code=404, detail="资产不存在")
    return asset


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(
    asset_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """删除资产"""
    service = AssetService(db)
    success = await service.delete_asset(asset_id)
    if not success:
        raise HTTPException(status_code=404, detail="资产不存在")
