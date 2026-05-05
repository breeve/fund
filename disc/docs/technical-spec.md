# 技术实现规格文档

## 一、架构设计

### 1.1 整体架构

**跨端共享架构，核心业务逻辑统一实现，通过各平台原生容器运行。**

```
┌─────────────────────────────────────────────────────────────┐
│                      跨端架构层                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   macOS     │  │    iOS      │  │    Android  │         │
│  │  (Capacitor │  │  (Capacitor │  │  (Capacitor │         │
│  │   + Swift)  │  │   + Swift)  │  │    + Kotlin)│         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│  ┌──────┴────────────────┴────────────────┴──────┐        │
│  │              WebView (共享 UI 层)               │        │
│  └──────────────────────┬─────────────────────────┘        │
│                         │                                   │
│  ┌──────────────────────┴─────────────────────────┐        │
│  │           共享业务逻辑 (TypeScript)             │        │
│  │  ┌─────────┐ ┌─────────┐ ┌──────────┐         │        │
│  │  │资产服务 │ │分析服务 │ │基金诊断服务│         │        │
│  │  └────┬────┘ └────┬────┘ └────┬─────┘         │        │
│  │       │           │           │                │        │
│  │  ┌────┴───────────┴───────────┴────┐          │        │
│  │  │       LLM 接入层（可配置）       │          │        │
│  │  └─────────────────────────────────┘          │        │
│  └─────────────────────────────────────────────────┘        │
│                         │                                   │
│  ┌──────────────────────┴─────────────────────────┐        │
│  │           数据层 (iCloud Storage)               │        │
│  │  ┌────────┐ ┌────────┐ ┌──────────┐          │        │
│  │  │JSON存储│ │配置管理 │ │行情API适配│          │        │
│  │  └────────┘ └────────┘ └──────────┘          │        │
│  └─────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────┘
                           │
              直接调用外部 API（可配置）
                           │
              ┌────────────┴────────────┐
              │ 行情数据 API │ LLM API │
              └─────────────────────────┘
```

### 1.2 技术选型

| 层级 | 技术选型 | 理由 |
|------|----------|------|
| **核心框架** | Capacitor | 跨平台原生容器，Web 技术栈输出原生应用 |
| **共享代码** | TypeScript | 业务逻辑、类型定义跨平台复用 |
| **状态管理** | Zustand | Web 端状态管理，可跨端共享 |
| **数据存储** | iCloud Drive (JSON) | 云端同步，多设备共享 |
| **API 协议** | REST + JSON-RPC (CLI) | 简单直观，CLI 优先 JSON-RPC |
| **认证** | JWT + 设备指纹 | 无状态，支持多设备 |
| **行情 API 接入** | 插件化适配器 | 见 2.3 节 |
| **LLM 接入** | OpenAI 兼容接口 + 可配置 Provider | 见 2.4 节 |
| **iOS** | Capacitor + Swift | 原生体验，iCloud 深度集成 |
| **macOS** | Capacitor + Swift | 与 iOS 共用代码，与 Web 共享业务逻辑 |
| **Android** | Capacitor + Kotlin | 原生体验，Google Drive 同步（待扩展） |
| **Web** | React/Vite + PWA | 响应式，渐进式应用 |

### 1.3 技术选型详细说明

#### 为什么选择 Capacitor？

| 维度 | 方案对比 | 选择理由 |
|------|----------|----------|
| **代码复用** | Flutter (Dart) | 需要重写所有 UI，不复用现有 Web 代码 |
| **代码复用** | React Native | 需要原生模块编写，，不如 Capacitor 简洁 |
| **代码复用** | Tauri + Web | 适合桌面端，但 iOS/Android 支持不如 Capacitor 成熟 |
| **代码复用** | **Capacitor + Web** | ✅ Web 代码直接输出原生应用，iOS/macOS/Android 通吃 |
| **原生能力** | Capacitor | 直接调用原生 API（相机、文件系统、iCloud） |
| **生态** | Capacitor | Ionic 生态成熟，社区活跃 |
| **维护成本** | Capacitor | 一套代码，四端输出，维护成本低 |

### 1.4 数据持久化与同步策略

### 1.4 数据持久化与同步策略

#### 1.4.1 本地持久化（所有客户端）

**所有需要持久化的数据全部存储在本地，客户端可完全离线运行。**

| 存储内容 | 存储位置 | 说明 |
|----------|----------|------|
| 资产数据 | JSON 文件 | 核心业务数据 |
| 配置信息 | JSON 文件 | API Key、数据源偏好、LLM 配置 |
| 用户偏好 | JSON 文件 | 主题、语言、界面设置 |
| 缓存数据 | 本地文件 | 基金净值缓存（TTL: 15 分钟） |
| 分析历史 | JSON 文件 | 历史分析报告 |

**本地数据加密**:

- 使用系统密钥链存储敏感配置的加密密钥
- 关键字段（金额、账户号）在应用层加密后存储
- 备份文件可选择加密导出

#### 1.4.2 跨设备同步方案

**所有平台: iCloud 同步**

```
本地 JSON 文件 ──[iCloud Drive]──> iCloud
                              │
                         多设备自动同步
                         冲突时 iCloud 解决
```

- 所有平台均通过 **iCloud Drive** 同步 JSON 文件
- 数据存储在用户 iCloud 账户下，无需额外配置
- 冲突解决：iCloud 默认 Last Write Wins，可配置为用户手动合并
- 无 iCloud 账户时：**提示用户数据仅保存在本设备，存在设备丢失/损坏导致数据丢失的风险**

| 客户端 | 默认存储 | 同步方案 | 数据丢失风险提示 |
|--------|----------|----------|-----------------|
| iOS | 本地 + iCloud | iCloud Drive 自动同步 | ⚠️ 无 iCloud 时提示 |
| macOS | 本地 + iCloud | iCloud Drive 自动同步 | ⚠️ 无 iCloud 时提示 |
| Windows | 本地 + iCloud | iCloud for Windows | ⚠️ 无 iCloud 时提示 |
| Web | 本地 + iCloud | iCloud 同步（如已配置） | ⚠️ 无 iCloud 时提示 |
| CLI | 本地 + iCloud | iCloud Drive 同步 | ⚠️ 无 iCloud 时提示 |

> **跨平台 iCloud 说明**:
> - **iOS / macOS**: 原生支持，深度集成
> - **Windows**: 需安装 iCloud for Windows 并登录 iCloud
> - **Web (PWA)**: 通过 iCloud Drive 或第三方同步工具同步 JSON 文件
> - **CLI**: 配置文件目录指向 iCloud Drive 同步目录

#### 1.4.3 数据导出与备份

| 导出方式 | 格式 | 触发条件 |
|----------|------|----------|
| 应用内导出 | JSON / CSV | 用户手动触发 |
| 自动备份 | JSON（加密） | 每次重大操作后生成快照 |
| iCloud 自动备份 | — | iOS/macOS 由系统自动完成 |

**CLI 数据导出示例**:

```bash
# 导出全部数据
fund-cli export --format=json --output=backup_20240417.json

# 导出全部数据（加密）
fund-cli export --format=json --output=backup_20240417.json --encrypt

# 从备份恢复
fund-cli import --input=backup_20240417.json

# 查看数据目录大小
fund-cli info --data-size
```

#### 1.4.4 自托管同步服务（可选，Phase 4）

对于 Windows/Web/CLI 用户，如需多设备同步，可部署轻量同步服务。**Phase 4 实现，当前 MVP 不包含。**

同步机制：同步服务仅传输加密数据块，不存储明文。

```
Windows/Web/CLI 本地 JSON ──[加密]──> 同步服务 ──[加密]──> 其他设备
```

**同步协议**:

- WebSocket 长连接 + 增量同步
- 冲突解决：CRDT 或 Last Write Wins + 用户确认
- 传输加密：TLS 1.3
- 端到端加密：同步服务无法解密用户数据

## 二、可配置外部服务

### 2.1 配置管理

所有外部服务配置通过 `config.yaml` 或 `config.json` 管理，**不硬编码任何 API Key 或地址**。

```yaml
# 配置文件结构
app:
  name: "fund-manager"
  version: "1.0.0"
  data_dir: "./data"          # 本地数据存储目录

server:
  host: "0.0.0.0"
  port: 8080
  jwt_secret: ""              # 从环境变量读取: ${JWT_SECRET}
  jwt_expiry_hours: 720       # 30 天

# 可配置项 1: 行情数据 API（见 2.3）
market_data:
  provider: "configurable"    # 标识使用可配置模式
  adapters: []                # 动态加载的适配器列表

# 可配置项 2: LLM API（见 2.4）
llm:
  provider: "configurable"
  adapters: []

# 多语言支持
i18n:
  default_locale: "zh-CN"
  supported: ["zh-CN", "en-US"]
```

### 2.2 配置加载优先级

```
命令行参数 > 环境变量 > config.local.yaml > config.yaml > 默认值
```

### 2.3 行情数据 API 可配置化

#### 设计目标

支持接入任意基金/股票行情数据源，用户可自由选择或切换提供商。

#### 适配器接口定义

```typescript
interface MarketDataAdapter {
  // 适配器标识
  id: string;
  name: string;
  version: string;

  // 能力声明
  capabilities: {
    fund_info: boolean;       // 基金基本信息
    fund_nav: boolean;        // 基金净值
    fund_holding: boolean;    // 基金持仓
    stock_quote: boolean;     // 实时股价
    stock_profile: boolean;   // 股票概况
    history: boolean;         // 历史行情
  };

  // 接口方法
  fetchFundInfo(fundCode: string): Promise<FundInfo>;
  fetchFundNAV(fundCode: string): Promise<FundNAV>;
  fetchFundHoldings(fundCode: string, date: string): Promise<Holding[]>;
  fetchStockQuote(symbol: string): Promise<StockQuote>;
  fetchStockProfile(symbol: string): Promise<StockProfile>;
  fetchHistory(symbol: string, period: Period): Promise<PricePoint[]>;

  // 健康检查
  healthCheck(): Promise<boolean>;
}
```

#### 内置适配器模板

项目内置以下适配器实现示例，实际使用时请填入真实 API Key：

| 适配器 | 数据源 | 状态 | 说明 |
|--------|--------|------|------|
| `akshare-adapter` | AKShare (免费) | 内置 | Python 数据源，可通过 Go 调用 |
| `tushare-adapter` | Tushare Pro | 需配置 | 专业金融数据，需付费订阅 |
| `eastmoney-adapter` | 东方财富 | 需配置 | 部分免费接口，需申请 |
| `yahoo-adapter` | Yahoo Finance | 需配置 | 美股/港股数据，免费 |
| `alpha-vantage-adapter` | Alpha Vantage | 需配置 | 全球股票，外币汇率，免费限额 |
| `custom-http-adapter` | 任意 HTTP API | 自定义 | 通用适配器，配置 URL 模板即可 |

#### 自定义适配器配置示例

```yaml
market_data:
  adapter: "custom-http"
  custom:
    base_url: "https://api.example.com/v1"
    api_key: "${MARKET_API_KEY}"
    timeout_ms: 5000

    # 接口映射配置
    endpoints:
      fund_nav: "/fund/{code}/nav"
      fund_info: "/fund/{code}/info"
      stock_quote: "/stock/{symbol}/quote"

    # 字段映射配置
    field_mapping:
      fund_nav:
        date: "nav_date"
        nav: "unit_nav"
        acc_nav: "accumulated_nav"
        change_pct: "daily_change"
```

#### 适配器切换

用户可在应用内切换行情数据源，无需重启服务。

```
设置 → 数据源配置 → 选择适配器 → 填写 API Key → 测试连接 → 保存
```

### 2.4 LLM API 可配置化

#### 设计目标

支持接入任意 OpenAI 兼容 API，用户可使用自己的 API Key 或私有部署的模型服务。

#### LLM 适配器接口定义

```typescript
interface LLMAdapter {
  id: string;
  name: string;
  supports_streaming: boolean;
  supported_models: string[];

  // 核心方法
  chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse>;
  chatStream(messages: ChatMessage[], options?: ChatOptions): AsyncGenerator<string>;

  // 模型能力查询
  listModels(): Promise<Model[]>;

  // 健康检查
  healthCheck(): Promise<boolean>;
}

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatOptions {
  model?: string;
  temperature?: number;       // 默认 0.7
  max_tokens?: number;        // 默认 2048
  top_p?: number;
  stop?: string[];
}

interface ChatResponse {
  content: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  finish_reason: "stop" | "length" | "content_filter";
}
```

#### 内置适配器

| 适配器 | 服务 | 状态 | 说明 |
|--------|------|------|------|
| `openai-adapter` | OpenAI 官方 | 需配置 API Key | GPT-4o / GPT-4o-mini / o1 等 |
| `azure-adapter` | Azure OpenAI | 需配置端点 | 企业用户，支持私有部署 |
| `anthropic-adapter` | Anthropic Claude | 需配置 API Key | Claude 3.5 Sonnet / Opus |
| `ollama-adapter` | Ollama 本地 | 需配置地址 | 本地运行 Llama/Qwen 等开源模型 |
| `lmstudio-adapter` | LM Studio 本地 | 需配置地址 | 本地运行，支持 GGUF 格式 |
| `vllm-adapter` | vLLM 服务 | 需配置端点 | 支持 SGLang/ChatGLM 等 |
| `deepseek-adapter` | DeepSeek API | 需配置 API Key | DeepSeek Coder / Chat |
| `groq-adapter` | Groq API | 需配置 API Key | 推理速度快，免费限额 |
| `openrouter-adapter` | OpenRouter 聚合 | 需配置 API Key | 统一接入 100+ 模型 |
| `custom-adapter` | 任意兼容 API | 自定义 | 通用适配器 |

#### LLM 配置示例

```yaml
llm:
  adapter: "openai"
  default_model: "gpt-4o"

  adapters:
    openai:
      api_base: "https://api.openai.com/v1"
      api_key: "${OPENAI_API_KEY}"
      organization: ""        # 可选

    anthropic:
      api_base: "https://api.anthropic.com"
      api_key: "${ANTHROPIC_API_KEY}"
      api_version: "2023-06-01"

    ollama:
      api_base: "http://localhost:11434/v1"
      api_key: "ollama"       # 本地服务无需 Key

    azure:
      api_base: "https://{resource}.openai.azure.com"
      api_key: "${AZURE_OPENAI_KEY}"
      api_version: "2024-02-01"
      deployment_name: "gpt-4o"
```

#### 资产分析中的 LLM 使用场景

| 场景 | 模型建议 | Prompt 策略 |
|------|----------|-------------|
| 资产配置建议 | GPT-4o / Claude Sonnet | 结构化输出 JSON，附置信度 |
| 基金报告解读 | GPT-4o / Claude Sonnet | 提取关键信息，输出摘要 |
| 财务健康诊断 | GPT-4o-mini / DeepSeek | 规则引擎补充 + LLM 解读 |
| 自然语言查询 | GPT-4o-mini / Ollama | 对话式，RAG 检索历史分析 |
| 风险预警解读 | Claude Sonnet | 提供专业、保守的分析建议 |

#### LLM 成本控制

```yaml
llm:
  budget:
    daily_limit_usd: 5.00     # 每日成本上限
    monthly_limit_usd: 50.00  # 每月成本上限
    alert_threshold: 0.8      # 80% 时通知用户

  caching:
    enabled: true
    ttl_seconds: 3600         # 相同问题的答案缓存 1 小时

  fallback:
    enabled: true
    on_provider_fail: "ollama"  # 主服务失败时切换
```

## 三、客户端实现

### 3.1 MVP 优先级：macOS + WebApp (PWA)

**当前阶段（Phase 1）优先实现 macOS + WebApp，均通过 Capacitor 输出。**

| 平台 | 技术栈 | MVP 状态 | 说明 |
|------|--------|----------|------|
| **macOS** | Capacitor + Swift | ✅ MVP | 通过 Xcode 构建为 .app |
| **WebApp (PWA)** | React + Vite + Capacitor | ✅ MVP | 可独立运行，也可打包为原生应用 |
| iOS | Capacitor + Swift | Phase 2 | 与 macOS 共用大部分代码 |
| Android | Capacitor + Kotlin | Phase 2 | 与 iOS 共用大部分代码 |

### 3.2 项目结构（Capacitor 跨端架构）

```
fund/
├── src/                          # 共享业务逻辑（所有平台共用）
│   ├── components/               # UI 组件
│   ├── pages/                    # 页面
│   ├── store/                    # Zustand 状态管理
│   ├── types/                    # TypeScript 类型定义
│   ├── services/                 # 业务服务
│   │   ├── storage.ts            # iCloud/本地存储抽象
│   │   ├── market.ts             # 行情数据适配器
│   │   └── llm.ts                # LLM 调用封装
│   └── styles/                   # 样式
├── macos/                        # macOS 原生壳
│   ├── FundMac/                  # XcodeGen 项目
│   └── project.yml
├── ios/                          # iOS 原生壳（Phase 2）
├── android/                     # Android 原生壳（Phase 2）
├── capacitor.config.ts          # Capacitor 配置
├── vite.config.ts               # Vite 配置
└── package.json
```

### 3.3 WebApp (PWA) 核心特性

| 特性 | 说明 |
|------|------|
| PWA 支持 | Service Worker、离线缓存、桌面图标安装 |
| 响应式设计 | 桌面端、平板端、手机浏览器均可使用 |
| 图表库 | ECharts（国内生态好）或 Recharts |
| 主题 | 支持暗色/亮色主题 |
| 国际化 | 中文/英文，可扩展 |

### 3.4 WebApp 运行方式

#### 环境要求

- Node.js >= 18
- npm / pnpm / yarn

#### 运行命令

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

# 代码检查
npm run lint
```

#### 使用 Makefile

```bash
# 构建
make mvp-webapp

# 开发模式
make mvp-serve

# 测试
make mvp-test

# 类型检查
make mvp-lint

# 清理构建产物
make mvp-clean
```

#### PWA 安装

生产构建后，可通过以下方式安装为桌面应用：

1. **macOS**: 构建后生成 `.app` 或通过 Safari 手动添加到应用库
2. **Windows**: 使用 PWABuilder 打包为 `.exe`
3. **Android**: 通过 Chrome "添加到主屏幕"
4. **iOS**: 通过 Safari "添加到主屏幕"

#### Capacitor 打包（完整跨端）

```bash
# 安装 Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/macos

# 初始化
npx cap init FundMac com.fund.macos --web-dir=dist

# 添加 macOS 平台
npx cap add macos

# 同步 Web 资源到原生项目
npx cap sync macos

# 构建 macOS 应用
npx cap open macos
```

## 四、模块接口设计

### 4.1 核心模块划分

由于无后端，各客户端直接调用外部服务，内部模块以接口（trait/protocol/interface）定义，便于测试和跨平台复用。

```
src/
├── core/                      # 核心接口定义（跨平台）
│   ├── storage/               # 数据持久化接口
│   │   ├── AssetRepository.ts
│   │   ├── ConfigRepository.ts
│   │   └── BackupRepository.ts
│   ├── market/                # 行情数据接口
│   │   ├── MarketDataProvider.ts
│   │   └── adapters/          # 适配器实现
│   ├── llm/                   # LLM 调用接口
│   │   ├── LLMProvider.ts
│   │   └── adapters/
│   ├── analysis/              # 分析引擎
│   │   ├── BalanceSheet.ts
│   │   ├── LiquidityAnalyzer.ts
│   │   ├── AllocationAnalyzer.ts
│   │   └── HealthDiagnoser.ts
│   └── image/                 # 图片解析
│       ├── OCREngine.ts
│       └── ImageParser.ts
├── platform/                  # 平台特定实现
│   ├── ios/
│   ├── macos/
│   ├── windows/
│   ├── web/
│   └── cli/
└── main.ts
```

### 4.2 核心接口定义

#### 数据存储接口

```typescript
interface AssetRepository {
  getAll(): Asset[];
  getById(id: string): Asset | null;
  add(asset: Asset): void;
  update(id: string, asset: Partial<Asset>): void;
  delete(id: string): void;
  query(filter: AssetFilter): Asset[];
}

interface BackupRepository {
  export(format: 'json' | 'csv'): Promise<Blob>;
  import(data: Blob): Promise<void>;
  getBackupList(): BackupMeta[];
}
```

#### 行情数据适配器接口

```typescript
interface MarketDataAdapter {
  id: string;
  name: string;
  searchFund(keyword: string): Promise<FundSearchResult[]>;
  getFundInfo(code: string): Promise<FundInfo>;
  getFundNAV(code: string): Promise<FundNAV>;
  getFundHoldings(code: string): Promise<Holding[]>;
  getStockQuote(symbol: string): Promise<StockQuote>;
  healthCheck(): Promise<boolean>;
}
```

### 4.3 客户端内部数据流向

```
用户操作 → 业务逻辑（分析/诊断） → 存储接口 → 本地 JSON 文件
                            ↓
                    行情 API（可配置适配器）
                    LLM API（可配置 Provider）
                    图片解析（OCR + LLM）
```

## 五、部署方案

> 由于纯客户端架构，无服务端部署需求。各客户端独立构建分发。

### 5.1 客户端构建

| 客户端 | 构建命令 | 输出产物 |
|--------|----------|----------|
| iOS | `xcodebuild -scheme fund -configuration Release` | `.ipa` / `.app` |
| macOS | `xcodebuild -scheme fund -configuration Release` | `.app` / `.dmg` |
| Windows | `cargo tauri build` | `.exe` / `.msi` |
| Web | `pnpm build` | 静态资源 (`dist/`) |
| CLI | `go build -o fund-cli ./cmd/fund` | 可执行文件 |

### 5.3 环境变量参考

| 变量 | 必填 | 说明 |
|------|------|------|
| `JWT_SECRET` | 是 | JWT 签名密钥 |
| `OPENAI_API_KEY` | 否 | 使用 OpenAI 时必填 |
| `ANTHROPIC_API_KEY` | 否 | 使用 Claude 时必填 |
| `MARKET_API_KEY` | 否 | 行情数据 API Key |
| `DATA_DIR` | 否 | 数据存储目录 |

## 六、MVP 范围定义

### 6.1 MVP 目标

首批交付三个核心功能，实现家庭资产的快速录入、查看和基金诊断。

### 6.2 功能范围

#### 功能一：资产录入（填表方式）

**支持方式**

| 方式 | 描述 | 实现难度 |
|------|------|----------|
| 手动填表 | 用户逐项填写资产信息，提交后录入 | 核心功能 |
| 图片解析 | 上传资产截图（银行 App/基金 App/持仓截图），AI 自动识别资产类别并填充表格，用户确认后提交 | 扩展功能 |

**图片解析流程**

```
用户上传图片
     │
     ▼
┌──────────────┐
│ 图片预处理   │  ← 压缩、纠偏、增强对比度
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ OCR 文字提取 │  ← 识别金额、名称、日期、账户号
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ LLM 语义解析与分类       │  ← 理解截图语义，判断资产类别
│  (可配置 Provider)       │
└──────┬───────────────────┘
       │
       ▼
┌──────────────┐
│ 表格预填充   │  ← 将解析结果填入对应字段
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 用户确认     │  ← 检查/修改/补充 → 提交
└──────────────┘
```

**支持识别的图片类型**

| 图片类型 | 识别内容 | 示例 |
|----------|----------|------|
| 银行活期截图 | 账户余额、银行名称、账户尾号 | 招行/工行 App 余额页 |
| 基金持仓截图 | 基金名称/代码、持有份额、成本、当前市值 | 支付宝/天天基金持仓页 |
| 股票持仓截图 | 股票名称/代码、持股数、成本、当前价 | 券商 App 持仓页 |
| 保单截图 | 产品名称、保额、年缴保费、险种 | 电子保单首页 |
| 贷款截图 | 贷款总额、剩余本金、利率、月供 | 银行 App 贷款页 |

**图片解析技术方案**

```yaml
image_parsing:
  enabled: true
  # OCR 引擎：内置 / 可切换
  ocr_engine: "内置"   # Tesseract / PaddleOCR（内置，无需 Key）

  # LLM 语义解析（复用可配置的 LLM 适配器）
  llm_enabled: true
  llm_adapter: "${LLM_ADAPTER:-openai}"  # 与资产分析共用 LLM 配置
  llm_model: "${LLM_MODEL:-gpt-4o-mini}" # 使用轻量模型降低成本

  # 图片预处理
  preprocessing:
    auto_rotate: true     # 自动旋转纠正
    denoise: true         # 去噪
    contrast_enhance: true # 对比度增强

  # 输出格式
  output:
    fill_fields: true     # 自动填充字段
    highlight_uncertain: true # 不确定的字段高亮提示
    confidence_threshold: 0.7  # 置信度 < 70% 的字段标注待确认
```

#### 功能二：资产展示

**核心视图**

| 视图 | 描述 |
|------|------|
| 资产负债表 | 总资产、总负债、净资产，三大科目汇总 |
| 资产构成图 | 五大类别金额与占比（环形图/柱状图） |
| 净资产趋势图 | 按时间展示净资产变化曲线 |

**交互要求**

- 按时间区间筛选（近1月/近3月/近1年/全部）
- 数据变更有变化量标注（+XX万 / -XX万）
- 支持导出 PNG 图片或 CSV 数据

#### 功能三：基金诊断

**核心功能**

| 功能 | 描述 |
|------|------|
| 基金搜索 | 按名称/代码搜索基金 |
| 基金信息 | 显示基金基本信息、净值、规模、基金经理 |
| 持仓穿透 | 显示前十大重仓股/行业分布 |
| 风险评级 | 基于波动率/回撤/夏普比综合评分 |
| 适配度评估 | 与用户现有持仓的重叠度分析 |

**基金数据来源**

- 通过可配置的行情 API 适配器获取（见 2.3 节）
- MVP 阶段默认使用免费数据源（AKShare/东方财富）

### 6.3 MVP 技术边界

**做**

- 客户端：WebApp (PWA) + macOS（Capacitor 跨端）
- 本地存储：iCloud Drive（JSON 文件同步）
- 图片解析：OCR + LLM（可配置）
- 基金数据：可配置适配器（MVP 默认 AKShare）
- LLM：可配置适配器（MVP 默认 OpenAI）

**不做**

- iOS/Android 原生客户端（Phase 2）
- Windows 客户端（Phase 3）
- 云端同步服务（Phase 4）
- 资产深度分析（Phase 5）
- 通知推送（Phase 2）

### 6.4 MVP 数据模型

```
Asset (资产)
  ├── id: UUID
  ├── user_id: UUID
  ├── category: enum[流动资产,固定资产,金融投资,保障类,负债]
  ├── name: string
  ├── amount: decimal
  ├── currency: string (默认 CNY)
  ├── sub_type: string (如: 货币基金、定期寿险)
  ├── fields: json (类别相关扩展字段)
  ├── tags: string[]
  ├── created_at: datetime
  └── updated_at: datetime
```

## 七、测试策略

| 测试类型 | 覆盖率目标 | 说明 |
|----------|------------|------|
| 单元测试 | 80%+ | 业务逻辑、工具函数、适配器核心方法 |
| 集成测试 | 70%+ | 存储读写、外部 API mock |
| E2E 测试 | 关键流程 | 资产录入→查看→分析→基金诊断 |
| 视觉回归 | 主要页面 | Web/iOS/macOS 三端截图对比 |

## 七、Roadmap（建议优先级）

| 阶段 | 内容 | 建议优先级 |
|------|------|------------|
| **Phase 1** | WebApp (PWA) + macOS（Capacitor 跨端） | 高 — 快速验证核心功能 |
| **Phase 2** | iOS + Android 原生客户端 | 高 — 覆盖移动和桌面核心用户 |
| **Phase 3** | Windows 客户端 | 中 — 扩大用户覆盖 |
| **Phase 4** | 云端同步服务（iCloud 多设备） | 中 — 多设备数据同步 |
| **Phase 5** | 高级分析 + LLM | 中 — 深度功能差异化 |