"""FastAPI 应用入口"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, BaseModel
from app.routers import assets, funds, properties, analysis


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    async with engine.begin() as conn:
        await conn.run_sync(BaseModel.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="天天开心 - 家庭资产管理系统",
    description="家庭资产管理、基金诊断、房产分析的后端 API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(assets.router, prefix="/api/v1/assets", tags=["资产"])
app.include_router(funds.router, prefix="/api/v1/funds", tags=["基金"])
app.include_router(properties.router, prefix="/api/v1/properties", tags=["房产"])
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["分析"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
