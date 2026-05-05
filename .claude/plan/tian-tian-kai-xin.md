# 天天开心 - 家庭资产管理系统 + 房产分析实施计划

## 任务概述

**项目名称**: 天天开心（Happy Fund）  
**软件类型**: 跨平台家庭资产管理 + 房产分析应用  
**核心价值**: 帮助用户建立完整的家庭资产负债表，实现资产可视化、健康诊断、基金诊断，以及深圳房产板块跟踪分析

---

## 功能模块详细说明

### 模块一：资产录入

| 功能 | 详细描述 | 数据字段 |
|------|----------|----------|
| 手动录入 | 用户逐项填写，支持五大类资产 | 名称、金额、类别、子类、扩展字段 |
| 批量导入 | Excel/CSV 模板批量导入 | 按模板格式 |
| 图片解析 | 上传截图，OCR+LLM 自动识别（Phase 2） | 银行/基金/股票持仓截图 |

**录入流程**: 选择类别 → 填写基本信息 → 填写财务数据 → 补充关联数据 → 保存审核

**数据校验**:
- 金额：必须为正数，精确到分
- 日期：不得晚于当前日期
- 贷款利率：范围 0%–36%
- 月供：不得大于月收入（超过时预警）

### 模块二：资产展示

| 视图 | 描述 | 交互要求 |
|------|------|----------|
| 资产负债表 | 总资产、总负债、净资产，三大科目汇总 | - |
| 资产构成图 | 五大类别金额与占比（环形图/树状图） | 按类别折叠/展开 |
| 净资产趋势图 | 按月/季度/年度展示净资产变化曲线 | 时间区间筛选 |
| 资产流动性分布 | 高度流动 → 长期锁定的金字塔图 | - |
| 负债一览 | 全部负债明细，含良性/恶性标注 | - |

**交互要求**:
- 支持按时间区间筛选（近1月/近3月/近1年/全部）
- 净资产数据变更需有变化量标注（+XX万 / -XX万）
- 图表支持导出（PNG / CSV）

### 模块三：资产分析

| 分析维度 | 核心指标 | 诊断逻辑 |
|----------|----------|----------|
| **净资产分析** | 净资产总额、环比增长率 | 趋势判断、异常波动提醒 |
| **资产配置分析** | 五大类占比、风险资产占比、实物/金融资产比 | 配置是否失衡（参考值：风险资产 30%–70%，房产占比 < 60%） |
| **流动性分析** | 流动比率、应急储备充足率 | 流动资产能否覆盖 6 个月支出 |
| **偿债能力分析** | 资产负债率、月供收入比、恶性负债占比 | 偿债压力是否过重（预警线：月供 > 40% 月收入） |
| **保障充足度分析** | 人身险保障额 / 年收入、保障缺口 | 是否存在重大风险敞口 |
| **抗通胀能力分析** | 固定资产占比、权益类占比、黄金占比 | 资产实际购买力保值能力 |
| **分散度分析** | 资产相关性矩阵、跨类别集中度 | 鸡蛋是否放在同一个篮子 |
| **增长健康度分析** | 综合年化收益率 vs 通胀率 | 资产是否真正实现增值 |

**诊断报告输出**:
- 指标名称与当前值
- 参考区间（正常 / 警示 / 危险）
- 趋势图（时间维度变化）
- 风险提示（如有问题，给出原因简述）
- 优化建议（2–3 条可操作的改进方向）

**预警机制**:
- 🟢 正常：指标在健康区间
- 🟡 关注：指标接近临界值
- 🔴 预警：指标超出健康区间
- ⚠️ 危险：净资产骤降 > 20% 或流动性断裂

### 模块四：基金诊断

| 功能 | 详细描述 | 数据来源 |
|------|----------|----------|
| 基金搜索 | 按名称/代码搜索基金 | AKShare |
| 基金信息 | 显示基金基本信息、净值、规模、基金经理 | AKShare |
| 持仓穿透 | 显示前十大重仓股/行业分布 | AKShare 基金持仓接口 |
| 风险评级 | 基于波动率/回撤/夏普比综合评分（1-5星） | AKShare 历史数据计算 |
| 适配度评估 | 与用户现有持仓的重叠度分析 | 本地持仓 + 基金持仓对比 |
| 组合模拟 | 模拟加入基金后的组合变化 | 计算期望收益/波动率 |

**AKShare 集成接口**:
```python
# 基金基本信息
ak.fund_individual_basic_info_xq(symbol=code)
# 基金净值
ak.fund_open_enquiry(index_code=code)
# 基金持仓
ak.fund_portfolio(index_code=code)
# 基金历史净值（计算波动率/回撤）
ak.fund_nav_hist(symbol=code, period="daily")
```

### 模块五：房产分析（深圳房产板块跟踪）

#### 5.1 地理层级

| 层级 | 名称 | 示例 | 说明 |
|------|------|------|------|
| 1 | 行政区 | 南山区、宝安区 | 预算筛选 |
| 2 | 板块 | 科技园、碧海、红山 | 通勤+配套核心决策 |
| 3 | 生活圈 | 深大花园周边、碧海湾地铁站周边 | 步行可达范围，共享配套 |
| 4 | 小区 | 具体楼盘 | 最终决策 |

#### 5.2 行政区数据

| 属性类别 | 具体属性 | 数据来源 | 可自动化 |
|----------|----------|----------|----------|
| 基础信息 | 面积、人口、GDP | 统计年鉴 | ✅ |
| 教育资源 | 学校清单、评级、学区划分 | 教育局官网 | ⚠️ |
| 交通配套 | 地铁线路/站点、公交密度 | 高德 POI API | ✅ |
| 生活配套 | 医院、商场、公园 | 高德 POI API | ✅ |
| 房价行情 | 均价、成交量、历史走势 | 贝壳/克尔瑞 | ⚠️ |
| 规划信息 | 国土空间规划、在建工程 | 规划局官网 | ⚠️ |

#### 5.3 板块数据

| 属性类别 | 具体属性 | 数据来源 | 可自动化 |
|----------|----------|----------|----------|
| 板块边界 | 地理边界（地铁站覆盖范围） | 高德行政区边界 API | ✅ |
| 价格行情 | 当前均价、环比/同比涨幅、成交量 | 贝壳/克尔瑞 | ⚠️ |
| 小区供给 | 小区数量、新盘/次新盘比例 | 贝壳小区列表 | ⚠️ |
| 教育资源 | 对口学校清单、学校评级 | 教育局 PDF | ❌ |
| 交通配套 | 地铁线路/站点、通勤时间 | 高德路径规划 API | ✅ |
| 商业配套 | 大型商业体、底商密度 | 高德 POI API | ✅ |
| 城市规划 | 在建重大工程、城市更新 | 规划局官网 | ⚠️ |

#### 5.4 生活圈数据

| 属性类别 | 具体属性 | 数据来源 | 可自动化 |
|----------|----------|----------|----------|
| 锚点边界 | 锚定地铁站、步行覆盖半径 | 高德 POI + 路径规划 | ✅ |
| 地铁服务 | 线路数、首末班车、日均客流量 | 深圳地铁官网 | ✅ |
| 通勤指标 | 到主要目的地耗时、高峰期拥挤度 | 高德路径规划 API | ✅ |
| 教育配套 | 幼儿园/小/中学数量、步行距离 | 高德 POI API | ✅ |
| 商业服务 | 大型商业体、便利店密度、餐厅密度 | 高德 POI API | ✅ |
| 医疗健康 | 社康中心、药店密度、三甲可达性 | 高德 POI API | ✅ |
| 环境安全 | 公园/绿化、噪音、内涝黑点 | 高德 POI + 水务局公示 | ⚠️ |

#### 5.5 小区数据

| 属性类别 | 具体属性 | 数据来源 | 可自动化 |
|----------|----------|----------|----------|
| 基础档案 | 小区名称、地址、楼龄、总户数、开发商、物业公司 | 贝壳小区详情 | ✅ |
| 建筑信息 | 容积率、绿化率、梯户比、得房率 | 贝壳/住建局 | ✅ |
| 停车位 | 车位数、车户比、停车费 | 贝壳小区详情 | ✅ |
| 交通 | 最近地铁站距离、公交线路数 | 高德 POI API | ✅ |
| 教育配套 | 对口幼儿园/小学/初中 | 教育局 PDF | ❌ |
| 价格行情 | 挂牌价、成交价、议价空间、在售套数 | 贝壳/克尔瑞 | ⚠️ |
| 不利因素 | 垃圾站、变电站、高架桥、墓地（500m/1000m检测） | 高德 POI API | ✅ |

---

## 技术方案

### 后端方案

| 组件 | 选择 | 理由 |
|------|------|------|
| **Web 框架** | FastAPI | 高性能、自动 OpenAPI、类型安全、异步支持 |
| **ORM** | SQLAlchemy 2.0 + Alembic | 成熟稳定、异步支持、数据库迁移 |
| **数据库** | PostgreSQL | 关系型数据、JSONB 支持扩展字段 |
| **基金数据** | AKShare | 开源免费、社区活跃、A 股/基金/宏观数据 |
| **房产数据** | 高德开放平台 API | POI 查询、地理编码、路径规划（免费档位足够） |
| **API 风格** | RESTful + JSON | 简洁直观 |

### 前端方案

| 组件 | 选择 | 理由 |
|------|------|------|
| **框架** | React 18 + TypeScript | 组件化、生态成熟、类型安全 |
| **构建** | Vite | 快速热重载、优化打包 |
| **状态** | Zustand | 轻量、跨端共享、DevTools 支持 |
| **图表** | ECharts | 国产化好、配置灵活、导出能力强 |
| **跨端** | Capacitor | Web 输出原生 macOS/iOS/PWA |
| **样式** | CSS Variables + CSS Modules | 不引入 Tailwind，按模块组织 |

### 项目结构

```
fund/
├── server/                          # Python 后端
│   ├── app/
│   │   ├── main.py                 # FastAPI 入口
│   │   ├── config.py               # 配置管理
│   │   ├── database.py             # 数据库连接
│   │   ├── models/                 # SQLAlchemy 模型
│   │   │   ├── asset.py           # 资产模型
│   │   │   ├── fund.py            # 基金模型
│   │   │   └── property.py       # 房产模型（行政区/板块/生活圈/小区）
│   │   ├── schemas/                # Pydantic schemas
│   │   │   ├── asset.py
│   │   │   ├── fund.py
│   │   │   └── property.py
│   │   ├── routers/                # API 路由
│   │   │   ├── assets.py
│   │   │   ├── funds.py
│   │   │   ├── analysis.py
│   │   │   └── properties.py
│   │   ├── services/               # 业务逻辑
│   │   │   ├── asset_service.py
│   │   │   ├── fund_service.py
│   │   │   ├── analysis_service.py
│   │   │   └── property_service.py
│   │   └── adapters/              # 外部数据适配器
│   │       ├── akshare_adapter.py
│   │       └── amap_adapter.py
│   ├── alembic/                   # 数据库迁移
│   ├── requirements.txt
│   └── run.py
├── webapp/                         # React 前端
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # 基础 UI 组件
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Form.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Table.tsx
│   │   │   ├── charts/           # 图表组件
│   │   │   │   ├── PieChart.tsx
│   │   │   │   ├── LineChart.tsx
│   │   │   │   ├── BarChart.tsx
│   │   │   │   └── PyramidChart.tsx
│   │   │   ├── asset/            # 资产相关组件
│   │   │   │   ├── AssetForm.tsx
│   │   │   │   ├── AssetList.tsx
│   │   │   │   └── AssetSummary.tsx
│   │   │   ├── fund/             # 基金相关组件
│   │   │   │   ├── FundSearch.tsx
│   │   │   │   ├── FundDetail.tsx
│   │   │   │   └── FundHoldings.tsx
│   │   │   └── property/         # 房产相关组件
│   │   │       ├── DistrictMap.tsx
│   │   │       ├── BlockList.tsx
│   │   │       ├── LifeCircle.tsx
│   │   │       └── CommunityDetail.tsx
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx     # 仪表盘
│   │   │   ├── Assets.tsx       # 资产列表/录入
│   │   │   ├── Analysis.tsx     # 多维度分析
│   │   │   ├── Funds.tsx        # 基金诊断
│   │   │   └── Properties.tsx   # 房产分析
│   │   ├── store/               # Zustand store
│   │   │   ├── assetStore.ts
│   │   │   ├── fundStore.ts
│   │   │   └── propertyStore.ts
│   │   ├── services/            # API 调用
│   │   │   ├── api.ts          # 基础 API 客户端
│   │   │   ├── assetService.ts
│   │   │   ├── fundService.ts
│   │   │   └── propertyService.ts
│   │   ├── styles/              # 样式
│   │   │   ├── tokens.css      # 设计 tokens
│   │   │   ├── global.css
│   │   │   └── components/     # 组件样式
│   │   ├── types/               # TypeScript 类型
│   │   │   ├── asset.ts
│   │   │   ├── fund.ts
│   │   │   └── property.ts
│   │   ├── hooks/               # 自定义 hooks
│   │   │   ├── useAssets.ts
│   │   │   ├── useFunds.ts
│   │   │   └── useProperties.ts
│   │   ├── utils/               # 工具函数
│   │   │   ├── formatters.ts
│   │   │   └── validators.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── capacitor.config.ts
│   ├── vite.config.ts
│   └── package.json
├── Makefile                       # 跨平台构建管理
├── docker-compose.yml            # PostgreSQL 容器
└── README.md
```

---

## API 设计

### 资产 API

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/assets` | 创建资产 |
| GET | `/api/assets` | 获取资产列表（支持筛选、分页） |
| GET | `/api/assets/{id}` | 获取单个资产 |
| PUT | `/api/assets/{id}` | 更新资产 |
| DELETE | `/api/assets/{id}` | 删除资产 |
| POST | `/api/assets/batch` | 批量导入 |
| GET | `/api/assets/summary` | 资产汇总（资产负债表） |
| GET | `/api/assets/categories` | 获取五大类资产汇总 |

### 基金 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/funds/search` | 基金搜索（名称/代码） |
| GET | `/api/funds/{code}` | 基金基本信息 |
| GET | `/api/funds/{code}/nav` | 基金净值历史 |
| GET | `/api/funds/{code}/holdings` | 基金持仓穿透 |
| GET | `/api/funds/{code}/analysis` | 基金风险分析 |
| POST | `/api/funds/simulate` | 组合模拟 |

### 分析 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/analysis/balance` | 净资产分析 |
| GET | `/api/analysis/allocation` | 资产配置分析 |
| GET | `/api/analysis/liquidity` | 流动性分析 |
| GET | `/api/analysis/solvency` | 偿债能力分析 |
| GET | `/api/analysis/protection` | 保障充足度分析 |
| GET | `/api/analysis/inflation` | 抗通胀能力分析 |
| GET | `/api/analysis/diversification` | 分散度分析 |
| GET | `/api/analysis/growth` | 增长健康度分析 |
| GET | `/api/analysis/report` | 综合诊断报告 |

### 房产 API

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/properties/districts` | 获取行政区列表 |
| GET | `/api/properties/districts/{code}` | 行政区详情 |
| GET | `/api/properties/blocks` | 获取板块列表 |
| GET | `/api/properties/blocks/{code}` | 板块详情（含均价、配套） |
| GET | `/api/properties/life-circles` | 获取生活圈列表 |
| GET | `/api/properties/life-circles/{id}` | 生活圈详情 |
| GET | `/api/properties/communities` | 获取小区列表（支持筛选） |
| GET | `/api/properties/communities/{id}` | 小区详情 |
| GET | `/api/properties/communities/{id}/poi` | 小区周边 POI 分析 |
| GET | `/api/properties/communities/{id}/risks` | 小区不利因素检测 |
| GET | `/api/properties/price/history` | 房价历史走势 |
| GET | `/api/properties/school-mapping` | 学区划分映射 |

---

## 数据库模型

### 资产表 (assets)

```sql
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category VARCHAR(50) NOT NULL,  -- 'liquid'/'fixed'/'financial'/'protection'/'liability'
    sub_category VARCHAR(100),
    name VARCHAR(200) NOT NULL,
    amount DECIMAL(18, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'CNY',
    fields JSONB,                    -- 类别相关扩展字段
    tags TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assets_user ON assets(user_id);
CREATE INDEX idx_assets_category ON assets(category);
```

### 房产表 (properties)

```sql
-- 行政区
CREATE TABLE districts (
    code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    area_km2 DECIMAL(10, 2),
    population INTEGER,
    gdp DECIMAL(18, 2),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 板块
CREATE TABLE blocks (
    code VARCHAR(20) PRIMARY KEY,
    district_code VARCHAR(20) REFERENCES districts(code),
    name VARCHAR(100) NOT NULL,
    boundary_geojson JSONB,
    function_type VARCHAR(50),      -- 'residential'/'mixed'/'commercial'
    created_at TIMESTAMP DEFAULT NOW()
);

-- 生活圈
CREATE TABLE life_circles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    block_code VARCHAR(20) REFERENCES blocks(code),
    anchor_station VARCHAR(100),    -- 锚定地铁站
    radius_meters INTEGER DEFAULT 800,
    boundary_geojson JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 小区
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    life_circle_id UUID REFERENCES life_circles(id),
    name VARCHAR(200) NOT NULL,
    address VARCHAR(500),
    coordinates JSONB,              -- {"lat": xx, "lng": xx}
    completion_year INTEGER,
    total_units INTEGER,
    developer VARCHAR(200),
    property_company VARCHAR(200),
    property_fee DECIMAL(10, 2),
    plot_ratio DECIMAL(5, 2),
    greening_rate DECIMAL(5, 2),
    parking_total INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 小区价格历史
CREATE TABLE community_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES communities(id),
    record_date DATE NOT NULL,
    listing_price DECIMAL(18, 2),
    deal_price DECIMAL(18, 2),
    on_market_count INTEGER,
    deal_count INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 小区 POI 周边配套
CREATE TABLE community_pois (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID REFERENCES communities(id),
    poi_type VARCHAR(50),           -- 'metro'/'school'/'hospital'/'mall'/'park'/'risk'
    poi_name VARCHAR(200),
    distance_meters INTEGER,
    coordinates JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 实施步骤

### Phase 1: 项目骨架与基础设施

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 1.1 | 创建项目目录结构 | server/, webapp/, Makefile |
| 1.2 | 初始化 Python 虚拟环境 | venv, requirements.txt |
| 1.3 | 配置 PostgreSQL + Docker | docker-compose.yml |
| 1.4 | 初始化 FastAPI 项目骨架 | app/main.py, app/config.py |
| 1.5 | 初始化 React + Vite 项目 | webapp/ 完整结构 |
| 1.6 | 配置 Capacitor | capacitor.config.ts |

### Phase 2: 后端核心 - 资产模块

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 2.1 | 定义资产数据模型 | models/asset.py, schemas/asset.py |
| 2.2 | 实现资产 CRUD API | routers/assets.py |
| 2.3 | 实现资产汇总 API | /api/assets/summary |
| 2.4 | 编写资产导入导出功能 | batch import, CSV export |

### Phase 3: 后端核心 - 基金模块

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 3.1 | 集成 AKShare 适配器 | adapters/akshare_adapter.py |
| 3.2 | 实现基金搜索 API | /api/funds/search |
| 3.3 | 实现基金详情/净值 API | /api/funds/{code} |
| 3.4 | 实现基金持仓穿透 | /api/funds/{code}/holdings |
| 3.5 | 实现基金风险分析 | /api/funds/{code}/analysis |
| 3.6 | 实现组合模拟 | /api/funds/simulate |

### Phase 4: 后端核心 - 分析模块

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 4.1 | 实现净资产分析 | /api/analysis/balance |
| 4.2 | 实现资产配置分析 | /api/analysis/allocation |
| 4.3 | 实现流动性分析 | /api/analysis/liquidity |
| 4.4 | 实现偿债能力分析 | /api/analysis/solvency |
| 4.5 | 实现保障充足度分析 | /api/analysis/protection |
| 4.6 | 实现综合诊断报告 | /api/analysis/report |

### Phase 5: 后端核心 - 房产模块

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 5.1 | 集成高德地图适配器 | adapters/amap_adapter.py |
| 5.2 | 实现行政区 API | /api/properties/districts |
| 5.3 | 实现板块 API | /api/properties/blocks |
| 5.4 | 实现生活圈 API | /api/properties/life-circles |
| 5.5 | 实现小区 API（含 POI 分析） | /api/properties/communities |
| 5.6 | 实现不利因素检测 | /api/properties/communities/{id}/risks |
| 5.7 | 实现房价历史查询 | /api/properties/price/history |

### Phase 6: 前端核心 - 布局与样式

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 6.1 | 设计 CSS tokens | tokens.css |
| 6.2 | 开发基础 UI 组件 | Button, Card, Form, Modal, Table |
| 6.3 | 开发布局组件 | Header, Sidebar, Content |
| 6.4 | 配置路由 | react-router-dom 路由表 |

### Phase 7: 前端核心 - 资产页面

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 7.1 | 开发资产录入表单 | AssetForm.tsx（支持五大类） |
| 7.2 | 开发资产列表页面 | AssetList.tsx |
| 7.3 | 开发资产负债表视图 | AssetSummary.tsx |
| 7.4 | 开发资产构成图 | PieChart.tsx, BarChart.tsx |

### Phase 8: 前端核心 - 基金页面

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 8.1 | 开发基金搜索组件 | FundSearch.tsx |
| 8.2 | 开发基金详情组件 | FundDetail.tsx |
| 8.3 | 开发持仓穿透组件 | FundHoldings.tsx |
| 8.4 | 开发基金诊断页面 | Funds.tsx |

### Phase 9: 前端核心 - 分析页面

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 9.1 | 开发多维度分析仪表盘 | Analysis.tsx |
| 9.2 | 开发各类分析图表 | LineChart.tsx, RadarChart.tsx |
| 9.3 | 开发预警提示组件 | Alert.tsx |

### Phase 10: 前端核心 - 房产页面

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 10.1 | 开发行政区选择组件 | DistrictMap.tsx |
| 10.2 | 开发板块列表/详情 | BlockList.tsx |
| 10.3 | 开发生活圈组件 | LifeCircle.tsx |
| 10.4 | 开发小区详情组件 | CommunityDetail.tsx |
| 10.5 | 开发 POI 分析图表 | RadarChart.tsx |
| 10.6 | 开发不利因素提示 | RiskIndicator.tsx |

### Phase 11: 构建与部署

| 步骤 | 任务 | 预期产物 |
|------|------|----------|
| 11.1 | 编写 Makefile | start/stop/restart/logs |
| 11.2 | 配置日志输出 | 统一日志文件 |
| 11.3 | 编写启动脚本 | 跨平台兼容 |
| 11.4 | 编写 README | 使用文档 |

---

## 关键文件清单

### 后端文件

| 文件 | 说明 |
|------|------|
| `server/requirements.txt` | Python 依赖 |
| `server/app/main.py` | FastAPI 应用入口 |
| `server/app/config.py` | 配置管理（环境变量） |
| `server/app/database.py` | PostgreSQL 连接 |
| `server/app/models/asset.py` | 资产数据模型 |
| `server/app/models/property.py` | 房产数据模型 |
| `server/app/schemas/asset.py` | 资产 Pydantic schemas |
| `server/app/routers/assets.py` | 资产 CRUD API |
| `server/app/routers/funds.py` | 基金 API |
| `server/app/routers/analysis.py` | 分析 API |
| `server/app/routers/properties.py` | 房产 API |
| `server/app/services/fund_service.py` | 基金业务逻辑 |
| `server/app/services/analysis_service.py` | 分析业务逻辑 |
| `server/app/services/property_service.py` | 房产业务逻辑 |
| `server/app/adapters/akshare_adapter.py` | AKShare 适配器 |
| `server/app/adapters/amap_adapter.py` | 高德地图适配器 |

### 前端文件

| 文件 | 说明 |
|------|------|
| `webapp/src/styles/tokens.css` | CSS 设计 tokens |
| `webapp/src/components/ui/Button.tsx` | 按钮组件 |
| `webapp/src/components/ui/Card.tsx` | 卡片组件 |
| `webapp/src/components/ui/Form.tsx` | 表单组件 |
| `webapp/src/components/charts/PieChart.tsx` | 环形图 |
| `webapp/src/components/charts/LineChart.tsx` | 折线图 |
| `webapp/src/components/asset/AssetForm.tsx` | 资产录入表单 |
| `webapp/src/components/asset/AssetList.tsx` | 资产列表 |
| `webapp/src/components/fund/FundSearch.tsx` | 基金搜索 |
| `webapp/src/components/fund/FundDetail.tsx` | 基金详情 |
| `webapp/src/components/property/BlockList.tsx` | 板块列表 |
| `webapp/src/components/property/CommunityDetail.tsx` | 小区详情 |
| `webapp/src/pages/Dashboard.tsx` | 仪表盘 |
| `webapp/src/pages/Assets.tsx` | 资产页面 |
| `webapp/src/pages/Funds.tsx` | 基金页面 |
| `webapp/src/pages/Properties.tsx` | 房产页面 |
| `webapp/src/store/assetStore.ts` | 资产状态管理 |
| `webapp/src/store/propertyStore.ts` | 房产状态管理 |
| `webapp/src/services/api.ts` | API 客户端 |
| `Makefile` | 构建管理 |

---

## 风险与缓解措施

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| AKShare API 变更导致数据获取失败 | 中 | 高 | 预留适配器接口，支持快速切换数据源 |
| 高德 API 调用配额限制 | 中 | 中 | 实现本地缓存，设置合理的 TTL |
| PostgreSQL 连接池耗尽 | 低 | 高 | 配置连接池大小，添加超时控制 |
| 房产数据获取成本高 | 中 | 中 | MVP 阶段聚焦小区详情，行政区/板块用静态数据 |
| 学区划分数据无法结构化 | 高 | 中 | 人工维护 Excel，按年度更新 |
| 前端状态管理复杂度增加 | 中 | 中 | 使用 Zustand，按功能模块拆分 store |
| 跨平台 Capacitor 打包问题 | 低 | 中 | MVP 阶段先专注 Web，Capacitor 后续集成 |

---

## Makefile 设计

```makefile
# 检测操作系统
UNAME_S := $(shell uname -s)

# 默认目标
.DEFAULT_GOAL := help

.PHONY: help start stop restart logs status

## start - 启动所有服务
start:
	@echo "Starting services..."
	@if [ ! -d "server/venv" ]; then \
		echo "Creating Python virtual environment..."; \
		python3 -m venv server/venv; \
		server/venv/bin/pip install -r server/requirements.txt; \
	fi
	@if [ ! -d "webapp/node_modules" ]; then \
		echo "Installing Node dependencies..."; \
		cd webapp && npm install; \
	fi
	@echo "Starting PostgreSQL with Docker..."
	docker-compose up -d
	@echo "Starting backend server..."
	cd server && $(shell if [ "$(UNAME_S)" = "Darwin" ]; then echo "venv/bin/python run.py"; else echo "venv/bin/python run.py"; fi) &
	@echo "Starting frontend dev server..."
	cd webapp && npm run dev &
	@echo "All services started. Logs are being written to logs/app.log"

## stop - 停止所有服务
stop:
	@echo "Stopping all services..."
	@pkill -f "uvicorn" || true
	@pkill -f "vite" || true
	@docker-compose down || true
	@echo "All services stopped"

## restart - 重启所有服务
restart: stop start

## logs - 查看日志
logs:
	@if [ -f logs/app.log ]; then \
		tail -f logs/app.log; \
	else \
		echo "No log file found. Starting services first with 'make start'"; \
	fi

## status - 查看服务状态
status:
	@echo "Checking service status..."
	@docker ps | grep postgres || echo "PostgreSQL not running"
	@pgrep -f uvicorn > /dev/null && echo "Backend: RUNNING" || echo "Backend: STOPPED"
	@pgrep -f vite > /dev/null && echo "Frontend: RUNNING" || echo "Frontend: STOPPED"
```

---

## 下一步行动

用户审阅计划后，可通过以下命令执行：

```bash
/ccg:execute .claude/plan/tian-tian-kai-xin.md
```

或者告诉我要调整的部分。
