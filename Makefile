.PHONY: help install start stop test lint clean db-up db-down logs

logs:
	@if [ -f logs/app.log ]; then \
		tail -f logs/app.log; \
	else \
		echo "No log file found. Starting services first with 'make start'"; \
	fi

stop:
	@echo "Stopping all services..."
	@pkill -f "uvicorn" 2>/dev/null || true
	@pkill -f "vite" 2>/dev/null || true
	@echo "All services stopped"

help:
	@echo "天天开心 - 后端构建管理"
	@echo ""
	@echo "可用命令:"
	@echo "  make install   - 安装依赖"
	@echo "  make start     - 启动前后端服务"
	@echo "  make test      - 运行测试"
	@echo "  make lint      - 代码检查"
	@echo "  make clean     - 清理构建产物"
	@echo "  make db-up     - 启动 PostgreSQL 容器"
	@echo "  make db-down   - 停止 PostgreSQL 容器"

install:
	cd server && pip3 install -r requirements.txt
	cd webapp && npm install

start: stop
	@mkdir -p logs
	@echo "Starting backend (8000)..."
	cd server && ./start.sh >> $(shell pwd)/logs/app.log 2>&1 &
	@echo "Starting frontend (port 3000)..."
	cd webapp && npm run dev >> $(shell pwd)/logs/app.log 2>&1 &
	@echo ""
	@echo "Services started:"
	@echo "  Backend:  http://localhost:8000"
	@echo "  Frontend: http://localhost:3000"
	@echo "  Logs:     logs/app.log"

test:
	cd server && pytest -v

lint:
	cd server && ruff check app/

clean:
	cd server && rm -rf __pycache__ .pytest_cache build dist *.egg-info
	cd webapp && rm -rf dist node_modules/.vite
	find . -type d -name __pycache__ -exec rm -rf {} +

db-up:
	docker-compose up -d

db-down:
	docker-compose down

db-reset: db-down
	docker-compose down -v
	docker-compose up -d

migrate:
	cd server && alembic upgrade head

migrate-create:
	cd server && alembic revision --autogenerate -m "$(message)"
