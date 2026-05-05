"""高德地图适配器 - 地理位置服务"""
from typing import List, Optional, Dict

import httpx

from app.config import settings


class AMapAdapter:
    def __init__(self):
        self.api_key = settings.amap_api_key
        self.base_url = "https://restapi.amap.com/v3"
        self.timeout = 10.0

    async def get_district_blocks(self, city: str) -> List[Dict]:
        if not self.api_key:
            return self._default_shenzhen_blocks()

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"{self.base_url}/config/district"
                params = {
                    "key": self.api_key,
                    "keywords": city,
                    "subdistrict": 2,
                    "level": "city",
                }
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()

                blocks = []
                if data.get("districts"):
                    for district in data["districts"]:
                        for sub_district in district.get("districts", []):
                            blocks.append({
                                "name": sub_district.get("name"),
                                "district": district.get("name"),
                            })
                return blocks
        except Exception:
            return self._default_shenzhen_blocks()

    async def get_location_info(self, latitude: float, longitude: float) -> Optional[Dict]:
        if not self.api_key:
            return None

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"{self.base_url}/geocode/regeo"
                params = {
                    "key": self.api_key,
                    "location": f"{longitude},{latitude}",
                }
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()

                if data.get("regeocode"):
                    addr = data["regeocode"].get("addressComponent", {})
                    return {
                        "district": addr.get("district"),
                        "street": addr.get("streetNumber", {}).get("street"),
                        "address": data["regeocode"].get("formatted_address"),
                    }
                return None
        except Exception:
            return None

    async def search_nearby(
        self,
        latitude: float,
        longitude: float,
        keyword: str,
        radius: int = 1000,
    ) -> List[Dict]:
        if not self.api_key:
            return []

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                url = f"{self.base_url}/place/around"
                params = {
                    "key": self.api_key,
                    "location": f"{longitude},{latitude}",
                    "keywords": keyword,
                    "radius": radius,
                }
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()

                results = []
                for poi in data.get("pois", []):
                    results.append({
                        "name": poi.get("name"),
                        "address": poi.get("address"),
                        "distance": poi.get("distance"),
                    })
                return results
        except Exception:
            return []

    def _default_shenzhen_blocks(self) -> List[Dict]:
        return [
            {"name": "科技园", "district": "南山区"},
            {"name": "后海", "district": "南山区"},
            {"name": "前海", "district": "南山区"},
            {"name": "蛇口", "district": "南山区"},
            {"name": "西丽", "district": "南山区"},
            {"name": "碧海", "district": "宝安区"},
            {"name": "宝安中心", "district": "宝安区"},
            {"name": "红山", "district": "龙华区"},
            {"name": "深圳北站", "district": "龙华区"},
            {"name": "福田中心", "district": "福田区"},
            {"name": "车公庙", "district": "福田区"},
        ]