#!/bin/bash
# 启动 FastAPI 服务前检查端口 8000

PORT=8000

# 检查端口是否被占用
if lsof -i :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "端口 $PORT 已被占用，正在清理..."
    lsof -i :$PORT -sTCP:LISTEN -t | xargs kill -9 2>/dev/null
    sleep 1
fi

# 再次检查确认端口已释放
if lsof -i :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "错误: 无法释放端口 $PORT"
    exit 1
fi

echo "端口 $PORT 已就绪，启动服务..."
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port $PORT