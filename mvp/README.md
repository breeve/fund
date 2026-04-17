# 家庭资产管理系统 - MVP 版本

基于技术规格文档实现的 MVP Web 应用，包含三个核心功能：

1. **资产录入** - 支持五大类资产的添加和编辑
2. **资产展示** - 资产负债表、构成图、趋势图
3. **基金诊断** - 基金搜索、持仓分析、风险评级

## 快速开始

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

### 手动运行

```bash
cd mvp/webapp

# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 运行测试
npm run test
```

### 使用 pnpm/yarn

```bash
make mvp-webapp PKG_MANAGER=pnpm
make mvp-serve PKG_MANAGER=yarn
```

## 项目结构

```
mvp/
├── webapp/                    # Web 应用
│   ├── src/
│   │   ├── components/        # 可复用组件
│   │   ├── pages/             # 页面组件
│   │   ├── store/             # Zustand 状态管理
│   │   ├── types/             # TypeScript 类型定义
│   │   ├── styles/            # CSS 样式
│   │   └── test/              # 测试文件
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
└── Makefile                   # 构建脚本
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

## 资产分类

| 类别 | 说明 | 子类 |
|------|------|------|
| 流动资产 | 高度流动 (< 7天变现) | 现金类、短期理财、可快速变现 |
| 固定资产 | 低流动 ( > 3个月) | 自用型实物、投资型实物/权益 |
| 金融投资 | 中等流动 (1-30天) | 权益类、固定收益、基金、另类 |
| 保障类 | 长期锁定 | 健康险、意外险、寿险、年金险 |
| 负债 | 影响净资产 | 住房负债、消费负债、信用负债 |

## 配置说明

### 数据源配置

应用支持可配置的行情数据源，可在设置页面切换：

| 数据源 | 说明 |
|--------|------|
| 东方财富 | 国内知名财经网站（默认） |
| Tushare Pro | 专业金融数据平台（需付费） |
| AKShare | 免费开源数据包 |
| Yahoo Finance | 美股/港股数据 |

### LLM 配置

支持多种 LLM 提供商：

| 提供商 | 说明 |
|--------|------|
| OpenAI | GPT-4o / GPT-4o-mini |
| Anthropic | Claude 3.5 Sonnet |
| DeepSeek | DeepSeek Chat/Coder |
| Ollama | 本地部署开源模型 |
| Groq | 高性能推理 |

## 数据存储

- **存储位置**: 浏览器 localStorage
- **数据导出**: 支持 JSON/CSV 格式
- **数据同步**: 当前为单机版本，多设备同步在后续版本实现

## 开发说明

### 环境要求

- Node.js >= 18
- npm / pnpm / yarn

### 可用脚本

```bash
npm run dev          # 开发服务器
npm run build        # 生产构建
npm run preview      # 预览构建结果
npm run lint         # 代码检查
npm run type-check   # 类型检查
npm run test         # 运行测试
npm run test:coverage # 覆盖率报告
```

## License

See project root LICENSE file.