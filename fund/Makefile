.PHONY: all web analyze clean deps test serve serve-build server server-dev help

# Server configuration
SERVER_PORT := 8081
SERVER_HOST := localhost

# Flutter configuration
FLUTTER_PORT := 8080

all: web

web:
	flutter build web

analyze:
	flutter analyze

clean:
	flutter clean
	rm -rf build/

deps:
	flutter pub get

test:
	flutter test

# ── Server targets ───────────────────────────────────────────────────────────

# Start the backend server (API + proxy)
server:
	@echo "Starting Fund Diagnosis Backend Server on port $(SERVER_PORT)..."
	@cd $(shell pwd) && dart run bin/server.dart

# Start server with custom port
server-port:
	@echo "Starting Fund Diagnosis Backend Server on port $$PORT..."
	@dart run bin/server.dart $$PORT

# Start server and serve web (full dev experience)
server-dev: web
	@echo "Starting Fund Diagnosis Backend Server on port $(SERVER_PORT)..."
	@dart run bin/server.dart &
	@sleep 2
	@echo "Serving Flutter web on http://$(SERVER_HOST):$(FLUTTER_PORT)"
	@cd build/web && python3 -m http.server $(FLUTTER_PORT)

# ── Web serve targets ────────────────────────────────────────────────────────

# Serve existing build (no rebuild)
serve:
	@if [ ! -d "build/web" ]; then \
		echo "Build not found. Run 'make web' first, or 'make serve-build' to build and serve."; \
		exit 1; \
	fi
	@echo "Serving build/web on http://localhost:$(FLUTTER_PORT)"
	@cd build/web && python3 -m http.server $(FLUTTER_PORT)

# Build then serve
serve-build: web
	@echo "Serving build/web on http://localhost:$(FLUTTER_PORT)"
	@cd build/web && python3 -m http.server $(FLUTTER_PORT)

help:
	@echo "Available targets:"
	@echo "  all          - Build web (default)"
	@echo "  web          - Build web app"
	@echo "  analyze      - Run Flutter analyzer"
	@echo "  clean        - Clean build artifacts"
	@echo "  deps         - Get dependencies"
	@echo "  test         - Run tests"
	@echo ""
	@echo "  server       - Start backend API server on port $(SERVER_PORT)"
	@echo "  server-dev   - Start server + build + serve web"
	@echo ""
	@echo "  serve        - Serve existing build/web on port $(FLUTTER_PORT)"
	@echo "  serve-build  - Build then serve on port $(FLUTTER_PORT)"
	@echo ""
	@echo "Environment variables:"
	@echo "  PORT=$(SERVER_PORT)  - Override server port"
	@echo ""
	@echo "Tip: Use 'make server-dev' for full development experience"