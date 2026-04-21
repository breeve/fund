.PHONY: all dev web web-release ios macos analyze clean clean-pub deps watch test serve serve-build help

all: web

dev:
	flutter run -d chrome

web:
	flutter build web --web-renderer html

web-release:
	flutter build web --release --web-renderer html

ios:
	flutter build ios --simulator

macos:
	flutter build macos

analyze:
	flutter analyze

clean:
	flutter clean
	rm -rf build/

clean-pub:
	flutter clean
	rm -rf .dart_tool pubspec.lock

deps:
	flutter pub get

watch:
	flutter run -d chrome --web-renderer html --watch

test:
	flutter test

# Serve existing build (no rebuild)
serve:
	@if [ ! -d "build/web" ]; then \
		echo "Build not found. Run 'make web' first, or 'make serve-build' to build and serve."; \
		exit 1; \
	fi
	@echo "Serving build/web on http://localhost:8080"
	@cd build/web && python3 -m http.server 8080

# Build then serve
serve-build: web
	@echo "Serving build/web on http://localhost:8080"
	@cd build/web && python3 -m http.server 8080

serve-port: web
	@echo "Serving build/web on http://localhost:$(PORT)"
	@python3 -m http.server $(PORT) --directory build/web

help:
	@echo "Available targets:"
	@echo "  all          - Build web (default, fast HTML renderer)"
	@echo "  dev          - Run in development mode with Chrome (hot reload)"
	@echo "  web          - Build web app (HTML renderer, fast)"
	@echo "  web-release  - Build for production (HTML renderer)"
	@echo "  ios          - Build iOS app (requires macOS)"
	@echo "  macos        - Build macOS app (requires macOS)"
	@echo "  analyze      - Run Flutter analyzer"
	@echo "  clean        - Clean build artifacts"
	@echo "  clean-pub    - Clean and remove pub cache"
	@echo "  deps         - Get dependencies"
	@echo "  watch        - Run with hot reload"
	@echo "  test         - Run tests"
	@echo "  serve        - Serve existing build/web (no rebuild)"
	@echo "  serve-build  - Build then serve (always rebuilds)"
	@echo "  serve-port   - Build and serve on custom port"
	@echo "  help         - Show this help"
	@echo ""
	@echo "Tip: Use 'make dev' for development with hot reload (fastest iteration)"
	@echo "     Use 'make serve' to serve existing build without rebuilding"
