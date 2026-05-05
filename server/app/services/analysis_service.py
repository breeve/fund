"""分析业务逻辑"""
from decimal import Decimal
from typing import Dict, Optional
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.asset import Asset, AssetCategory


class AnalysisService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_asset_summary(self, user_id: UUID) -> Dict:
        result = await self.db.execute(
            select(Asset).where(Asset.user_id == user_id)
        )
        assets = result.scalars().all()

        total_assets = Decimal("0")
        total_liabilities = Decimal("0")
        category_breakdown = {}
        liability_breakdown = {}

        for asset in assets:
            if asset.category == AssetCategory.LIABILITY.value:
                total_liabilities += asset.amount
                liability_breakdown[asset.sub_type or "其他"] = float(asset.amount)
            else:
                total_assets += asset.amount
                category_breakdown[asset.category] = float(
                    category_breakdown.get(asset.category, 0) + asset.amount
                )

        return {
            "total_assets": total_assets,
            "total_liabilities": total_liabilities,
            "net_worth": total_assets - total_liabilities,
            "category_breakdown": category_breakdown,
            "liability_breakdown": liability_breakdown,
        }

    async def analyze_liquidity(self, user_id: UUID, monthly_expense: float) -> Dict:
        result = await self.db.execute(
            select(Asset).where(
                Asset.user_id == user_id,
                Asset.category == AssetCategory.LIQUID.value,
            )
        )
        liquid_assets = result.scalars().all()

        total_liquid = sum(asset.amount for asset in liquid_assets)
        coverage_months = total_liquid / Decimal(str(monthly_expense)) if monthly_expense > 0 else 0

        if coverage_months < 3:
            status = "danger"
            suggestion = "应急储备不足，建议增加流动资产至 3-6 个月支出"
        elif coverage_months < 6:
            status = "warning"
            suggestion = "流动资产略显不足，可适当增加"
        else:
            status = "normal"
            suggestion = "流动资产储备充足"

        return {
            "total_liquid_assets": float(total_liquid),
            "monthly_expense": monthly_expense,
            "coverage_months": round(float(coverage_months), 1),
            "status": status,
            "suggestion": suggestion,
        }

    async def analyze_allocation(self, user_id: UUID) -> Dict:
        summary = await self.get_asset_summary(user_id)
        total = summary["total_assets"]

        if total == 0:
            return {"status": "insufficient_data", "suggestion": "请先录入资产数据"}

        breakdown = summary["category_breakdown"]

        allocation_ratios = {
            cat: float(amount) / float(total) * 100
            for cat, amount in breakdown.items()
        }

        risk_assets = allocation_ratios.get(AssetCategory.FINANCIAL.value, 0)
        fixed_assets = allocation_ratios.get(AssetCategory.FIXED.value, 0)

        issues = []
        if fixed_assets > 60:
            issues.append("房产占比过高，可能影响资产流动性")

        if risk_assets < 30:
            issues.append("风险资产占比偏低，可考虑适度增加")
        elif risk_assets > 70:
            issues.append("风险资产占比偏高，建议分散配置")

        return {
            "allocation_ratios": {k: round(v, 2) for k, v in allocation_ratios.items()},
            "issues": issues or ["资产配置较为均衡"],
            "suggestion": issues[0] if issues else "当前配置较为合理",
        }

    async def analyze_debt(self, user_id: UUID, monthly_income: float) -> Dict:
        result = await self.db.execute(
            select(Asset).where(
                Asset.user_id == user_id,
                Asset.category == AssetCategory.LIABILITY.value,
            )
        )
        liabilities = result.scalars().all()

        total_debt = sum(asset.amount for asset in liabilities)
        summary = await self.get_asset_summary(user_id)
        total_assets = summary["total_assets"]

        debt_ratio = float(total_debt) / float(total_assets) * 100 if total_assets > 0 else 0

        monthly_payments = sum(
            asset.fields.get("monthly_payment", 0)
            for asset in liabilities
            if asset.fields
        )
        payment_ratio = monthly_payments / monthly_income * 100 if monthly_income > 0 else 0

        if debt_ratio > 50:
            status = "danger"
            suggestion = "资产负债率过高，建议控制负债规模"
        elif payment_ratio > 40:
            status = "warning"
            suggestion = "月供收入比偏高，还款压力较大"
        else:
            status = "normal"
            suggestion = "负债水平在合理范围内"

        return {
            "total_debt": float(total_debt),
            "debt_ratio": round(debt_ratio, 2),
            "monthly_payment": round(monthly_payments, 2),
            "payment_ratio": round(payment_ratio, 2),
            "monthly_income": monthly_income,
            "status": status,
            "suggestion": suggestion,
        }

    async def calculate_health_score(
        self,
        user_id: UUID,
        monthly_expense: float,
        monthly_income: float,
    ) -> Dict:
        liquidity = await self.analyze_liquidity(user_id, monthly_expense)
        allocation = await self.analyze_allocation(user_id)
        debt = await self.analyze_debt(user_id, monthly_income)

        score = 100

        if liquidity["status"] == "danger":
            score -= 30
        elif liquidity["status"] == "warning":
            score -= 15

        if allocation.get("issues"):
            score -= len(allocation["issues"]) * 10

        if debt["status"] == "danger":
            score -= 30
        elif debt["status"] == "warning":
            score -= 15

        score = max(0, min(100, score))

        return {
            "total_score": score,
            "liquidity_score": 100 if liquidity["status"] == "normal" else (70 if liquidity["status"] == "warning" else 40),
            "allocation_score": max(0, 100 - len(allocation.get("issues", [])) * 20),
            "debt_score": 100 if debt["status"] == "normal" else (70 if debt["status"] == "warning" else 40),
            "summary": "优秀" if score >= 80 else "良好" if score >= 60 else "需改善",
        }
