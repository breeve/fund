"""基金 API"""
import logging
from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import async_session_factory
from app.schemas.fund import FundCreate, FundUpdate, FundResponse, FundSearchResult, FundHoldingResponse
from app.services.fund_service import FundService

logger = logging.getLogger(__name__)

router = APIRouter()


async def get_db():
    async with async_session_factory() as session:
        yield session


@router.get("/search", response_model=List[FundSearchResult])
async def search_funds(
    keyword: str = Query(..., min_length=1),
):
    """搜索基金"""
    logger.info(f"搜索基金请求: keyword={keyword}")
    service = FundService(None)
    results = await service.search_funds(keyword)
    logger.info(f"搜索基金返回: {len(results)} 条结果")
    return results


@router.get("/", response_model=List[FundResponse])
async def list_funds(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """获取用户基金列表"""
    logger.info(f"获取用户基金列表: user_id={user_id}")
    service = FundService(db)
    funds = await service.list_user_funds(user_id)
    logger.info(f"返回 {len(funds)} 条基金记录")
    return funds


# 注意：具体路由要放在通用路由 {fund_id} 前面，否则会被提前匹配
@router.get("/{fund_code}/nav")
async def get_fund_nav(
    fund_code: str,
):
    """获取基金净值信息（通过基金代码）"""
    logger.info(f"获取基金净值: fund_code={fund_code}")
    service = FundService(None)
    nav_data = service.get_fund_nav(fund_code)
    if not nav_data:
        logger.error(f"获取净值失败: fund_code={fund_code}")
        raise HTTPException(status_code=404, detail="基金不存在或净值数据获取失败")
    logger.info(f"返回净值: {nav_data}")
    return nav_data


@router.get("/{fund_code}/info")
async def get_fund_info(
    fund_code: str,
):
    """获取基金基本信息（通过基金代码）"""
    logger.info(f"获取基金信息: fund_code={fund_code}")
    service = FundService(None)
    fund_info = service.get_fund_info(fund_code)
    if not fund_info:
        logger.error(f"获取基金信息失败: fund_code={fund_code}")
        raise HTTPException(status_code=404, detail="基金不存在")
    logger.info(f"返回基金信息: {fund_info}")
    return fund_info


@router.get("/{fund_code}/analysis")
async def get_fund_analysis(
    fund_code: str,
):
    """获取基金分析数据（通过基金代码）"""
    logger.info(f"获取基金分析: fund_code={fund_code}")
    service = FundService(None)
    analysis = service.get_fund_analysis(fund_code)
    logger.info(f"返回基金分析: {analysis}")
    return analysis


@router.get("/{fund_code}/detail")
async def get_fund_by_code(
    fund_code: str,
):
    """获取基金详情（通过基金代码，不是 UUID）"""
    logger.info(f"获取基金详情: fund_code={fund_code}")
    service = FundService(None)
    fund_info = service.get_fund_info(fund_code)
    nav_data = service.get_fund_nav(fund_code)
    if not fund_info:
        logger.error(f"基金不存在: fund_code={fund_code}")
        raise HTTPException(status_code=404, detail="基金不存在")
    return {
        "code": fund_code,
        "name": fund_info.get("name", ""),
        "type": fund_info.get("type", ""),
        "company": fund_info.get("company", ""),
        "nav": nav_data.get("nav") if nav_data else None,
        "daily_change": nav_data.get("daily_change") if nav_data else None,
        "date": nav_data.get("date") if nav_data else None,
    }


@router.get("/{fund_code}/nav-history")
async def get_nav_history(
    fund_code: str,
    period: str = Query("近1年", description="时间区间：近1月、近3月、近6月、近1年、近3年、成立来"),
):
    """获取基金净值历史"""
    logger.info(f"获取净值历史: fund_code={fund_code}, period={period}")
    service = FundService(None)
    history = service.get_fund_nav_history(fund_code, period)
    logger.info(f"返回 {len(history)} 条历史数据")
    return history


@router.get("/{fund_code}/holdings")
async def get_public_fund_holdings(
    fund_code: str,
):
    """获取基金持仓明细（公开数据，通过基金代码查询）"""
    logger.info(f"获取公开基金持仓明细: fund_code={fund_code}")
    service = FundService(None)
    holdings = service.get_fund_holdings(fund_code)
    logger.info(f"返回 {len(holdings)} 条持仓明细")
    return holdings


@router.get("/{fund_id}")
async def get_fund(
    fund_id: str,
    db: AsyncSession = Depends(get_db),
):
    """获取基金详情 - fund_id 可以是 UUID 或基金代码"""
    logger.info(f"获取基金详情: fund_id={fund_id}")

    # 判断是 UUID 还是基金代码
    is_uuid = len(fund_id) == 36 and "-" in fund_id

    if is_uuid:
        service = FundService(db)
        fund = await service.get_fund(UUID(fund_id))
        if not fund:
            logger.warning(f"基金不存在: fund_id={fund_id}")
            raise HTTPException(status_code=404, detail="基金不存在")
        logger.info(f"返回基金: {fund.name} ({fund.code})")
        return fund
    else:
        # 基金代码查询公开信息
        service = FundService(None)
        fund_info = service.get_fund_info(fund_id)
        nav_data = service.get_fund_nav(fund_id)
        if not fund_info:
            logger.error(f"基金不存在: fund_code={fund_id}")
            raise HTTPException(status_code=404, detail="基金不存在")

        return JSONResponse({
            "code": fund_id,
            "name": fund_info.get("name", ""),
            "fund_type": fund_info.get("type", ""),
            "company": fund_info.get("company", ""),
            "nav": nav_data.get("nav") if nav_data else None,
            "daily_change": nav_data.get("daily_change") if nav_data else None,
            "acc_nav": nav_data.get("acc_nav") if nav_data else None,
            "date": nav_data.get("date") if nav_data else None,
        })


@router.post("/", response_model=FundResponse, status_code=201)
async def create_fund_holding(
    fund_data: FundCreate,
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """添加基金持仓"""
    logger.info(f"添加基金持仓: user_id={user_id}, code={fund_data.code}, name={fund_data.name}")
    service = FundService(db)
    fund = await service.create_fund_holding(user_id, fund_data)
    logger.info(f"基金持仓创建成功: id={fund.id}")
    return fund


@router.put("/{fund_id}", response_model=FundResponse)
async def update_fund_holding(
    fund_id: UUID,
    fund_data: FundUpdate,
    db: AsyncSession = Depends(get_db),
):
    """更新基金持仓"""
    logger.info(f"更新基金持仓: fund_id={fund_id}, data={fund_data.model_dump(exclude_unset=True)}")
    service = FundService(db)
    fund = await service.update_fund_holding(fund_id, fund_data)
    if not fund:
        logger.warning(f"基金不存在，无法更新: fund_id={fund_id}")
        raise HTTPException(status_code=404, detail="基金不存在")
    logger.info(f"基金持仓更新成功: {fund.name}")
    return fund


@router.delete("/{fund_id}", status_code=204)
async def delete_fund_holding(
    fund_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """删除基金持仓"""
    logger.info(f"删除基金持仓: fund_id={fund_id}")
    service = FundService(db)
    success = await service.delete_fund_holding(fund_id)
    if not success:
        logger.warning(f"基金不存在，无法删除: fund_id={fund_id}")
        raise HTTPException(status_code=404, detail="基金不存在")
    logger.info(f"基金持仓删除成功: fund_id={fund_id}")


@router.post("/{fund_id}/refresh-nav")
async def refresh_fund_nav(
    fund_id: UUID,
    db: AsyncSession = Depends(get_db),
):
    """刷新基金净值"""
    logger.info(f"刷新基金净值: fund_id={fund_id}")
    service = FundService(db)
    result = await service.refresh_fund_nav(fund_id)
    if not result:
        logger.error(f"净值刷新失败: fund_id={fund_id}")
        raise HTTPException(status_code=400, detail="净值刷新失败")
    logger.info(f"净值刷新成功: fund_id={fund_id}, nav={result.get('nav')}")
    return result