# 房产数据分析服务

## 项目概述

根据 `docs/house_plan.md` 设计文档实现的数据组织系统，采用多层级的房产数据模型。

## 技术栈

- **语言**: Go
- **框架**: Gin (HTTP服务)
- **ORM**: GORM
- **数据库**: PostgreSQL

## 数据组织

### 层级结构

```
行政区 (district)
  └── 板块 (block)
        └── 生活圈 (life_circle)
              └── 小区 (community)
```

### Schema定义

在 `schema/` 目录下使用 YAML 文件定义各层级的数据结构和采集方式：

- `district.yaml` - 行政区层级
- `block.yaml` - 板块层级
- `life_circle.yaml` - 生活圈层级
- `community.yaml` - 小区层级
- `collection.yaml` - 采集任务配置

## 目录结构

```
house/
├── cmd/server/          # 服务入口
├── internal/
│   ├── config/          # 配置
│   ├── model/           # 数据模型 (GORM)
│   ├── repository/      # 数据仓储层
│   ├── service/         # 业务逻辑层
│   └── handler/         # HTTP处理层
├── schema/              # YAML数据schema定义
├── data/                # 静态数据文件
└── scripts/             # 工具脚本
```

## API

### 行政区

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /districts | 获取所有行政区 |
| GET | /districts/:id | 获取行政区详情 |
| POST | /districts | 创建行政区 |
| PUT | /districts/:id | 更新行政区 |

### 板块

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /blocks | 获取所有板块 |
| GET | /blocks/:id | 获取板块详情 |
| GET | /districts/:district_id/blocks | 获取指定行政区下的板块 |
| POST | /blocks | 创建板块 |
| PUT | /blocks/:id | 更新板块 |

### 生活圈

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /life-circles | 获取所有生活圈 |
| GET | /life-circles/:id | 获取生活圈详情 |
| GET | /blocks/:block_id/life-circles | 获取指定板块下的生活圈 |
| POST | /life-circles | 创建生活圈 |
| PUT | /life-circles/:id | 更新生活圈 |

### 小区

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /communities | 获取所有小区 |
| GET | /communities/:id | 获取小区详情 |
| GET | /blocks/:block_id/communities | 获取指定板块下的小区 |
| GET | /life-circles/:life_circle_id/communities | 获取指定生活圈内的小区 |
| POST | /communities | 创建小区 |
| PUT | /communities/:id | 更新小区 |

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| SERVER_PORT | 8080 | HTTP服务端口 |
| DB_HOST | localhost | 数据库主机 |
| DB_PORT | 5432 | 数据库端口 |
| DB_USER | postgres | 数据库用户 |
| DB_PASSWORD | postgres | 数据库密码 |
| DB_NAME | house | 数据库名 |
| GAODE_KEY | - | 高德地图API Key |

## 运行

```bash
# 设置环境变量
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=postgres
export DB_PASSWORD=your_password
export DB_NAME=house

# 运行服务
go run cmd/server/main.go
```
