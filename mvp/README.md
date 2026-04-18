# 家庭资产管理系统 - MVP 版本

基于跨端架构的 MVP，采用 **Capacitor** 实现 Web 代码到原生应用的输出。

## 架构概览

```
┌─────────────────────────────────────────────────────────────┐
│                    跨端架构层 (Capacitor)                    │
├─────────────────────────────────────────────────────────────┤
│  macOS (Swift)  │  iOS (Swift)  │  Android (Kotlin)  │  Web │
│       ✅ MVP    │    Phase 2     │      Phase 2       │ ✅ MVP │
└─────────────────────────────────────────────────────────────┘
                         │
              ┌───────────┴───────────┐
              │   共享业务逻辑 (TypeScript)   │
              │   - 资产服务 / 分析服务 / 基金诊断   │
              │   - Zustand 状态管理           │
              │   - LLM / 行情 API 适配器        │
              └───────────┬───────────┘
                          │
              ┌───────────┴───────────┐
              │   数据层 (iCloud)     │
              │   JSON 文件同步       │
              └───────────────────────┘
```

## 快速开始

### WebApp (PWA) - 优先实现

```bash
# 进入 webapp 目录
cd mvp/webapp

# 安装依赖
npm install

# 开发模式（热重载）
npm run dev

# 生产构建
npm run build

# 运行测试
npm run test

# 类型检查
npm run type-check
```

### 使用 Makefile

```bash
# 安装依赖并构建
make mvp-webapp

# 开发模式（热重载）
make mvp-serve

# 运行测试
make mvp-test

# 类型检查
make mvp-lint

# 清理构建产物
make mvp-clean
```

## MVP 功能

| 功能 | 描述 | 状态 |
|------|------|------|
| 资产录入 | 五大类资产的添加和编辑 | ✅ |
| 资产展示 | 资产负债表、构成图、趋势图 | ✅ |
| 基金诊断 | 基金搜索、持仓分析、风险评级 | ✅ |
| iCloud 同步 | 多设备数据同步 | ✅ MVP |
| PWA 安装 | 可安装为桌面应用 | ✅ |

## 项目结构

```
mvp/
├── src/                         # 共享业务逻辑
│   ├── components/              # 可复用组件
│   ├── pages/                  # 页面组件
│   ├── store/                  # Zustand 状态管理
│   ├── types/                  # TypeScript 类型定义
│   └── styles/                 # CSS 样式
├── macos/                       # macOS 原生壳（Phase 2 整合）
├── webapp/                      # Web 应用（PWA）
│   ├── src/
│   ├── vite.config.ts
│   └── capacitor.config.ts      # Capacitor 配置
└── Makefile                    # 构建脚本
```

## 核心页面

| 页面 | 路径 | 功能 |
|------|------|------|
| 资产总览 | `/overview` | 关键指标、图表、分类明细 |
| 资产列表 | `/assets` | 资产 CRUD、筛选、搜索 |
| 添加资产 | `/assets/new` | 五类资产表单录入 |
| 基金诊断 | `/fund` | 基金搜索热门推荐 |
| 基金详情 | `/fund/:code` | 净值走势、持仓、行业分布 |
| 设置 | `/settings` | 主题、语言、数据源配置 |

## 数据同步

- **存储位置**: iCloud Drive（JSON 文件）
- **数据导出**: 支持 JSON/CSV 格式
- **多设备同步**: macOS/iOS 自动同步，其他平台待扩展

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | React 18 + Vite + TypeScript |
| 状态管理 | Zustand (persist) |
| 图表 | ECharts |
| 跨端 | Capacitor |
| PWA | Vite PWA Plugin |

## License

See project root LICENSE file.
