.PHONY: help run-db run-db-stop run-server run-serve run-serve-stop migrate

help:
	@echo "House Project - Available targets:"
	@echo "  make run-db        - Start PostgreSQL database (detached)"
	@echo "  make run-db-stop   - Stop PostgreSQL database"
	@echo "  make run-server    - Start the house server (local)"
	@echo "  make run-serve     - Start the house server (docker)"
	@echo "  make run-serve-stop - Stop the house server (docker)"
	@echo "  make migrate      - Run database migrations"

run-db:
	docker network create house-net 2>/dev/null || true
	docker run -d \
		--name house-db \
		--network house-net \
		-e POSTGRES_USER=postgres \
		-e POSTGRES_PASSWORD=postgres \
		-e POSTGRES_DB=house \
		-p 5432:5432 \
		-v house_db_data:/var/lib/postgresql/data \
		postgres:16-alpine
	@echo "Database started. Waiting for health check..."
	@timeout 30 sh -c 'until docker exec house-db pg_isready -U postgres -d house > /dev/null 2>&1; do sleep 1; done' && echo "Database is ready!"

run-db-stop:
	docker stop house-db && docker rm house-db
	docker network rm house-net 2>/dev/null || true

run-server:
	go run cmd/server/main.go

run-serve:
	docker network create house-net 2>/dev/null || true
	docker run -d --name house-app --network house-net -p 8080:8080 -e DB_HOST=house-db house-server

run-serve-stop:
	docker stop house-app && docker rm house-app

migrate:
	@echo "Running migrations..."
	# Migration is automatic on server start via AutoMigrate
	# This target is for future explicit migration needs
	@echo "Use 'make run-server' which runs AutoMigrate automatically"