.PHONY: all dev web web-release ios macos analyze clean clean-pub deps watch test serve help

all: web

dev:
	flutter run -d chrome

web:
	flutter build web

web-release:
	flutter build web --release

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
	flutter run -d chrome --watch

test:
	flutter test

serve: web
	@echo "Serving build/web on http://localhost:8080"
	@cd build/web && python3 -m http.server 8080

serve-port: web
	@echo "Serving build/web on http://localhost:$(PORT)"
	@python3 -m http.server $(PORT) --directory build/web

help:
	@echo "Available targets:"
	@echo "  all          - Build web (default)"
	@echo "  dev          - Run in development mode with Chrome"
	@echo "  web          - Build web app"
	@echo "  web-release  - Build web app for production"
	@echo "  ios          - Build iOS app (requires macOS)"
	@echo "  macos        - Build macOS app (requires macOS)"
	@echo "  analyze      - Run Flutter analyzer"
	@echo "  clean        - Clean build artifacts"
	@echo "  clean-pub    - Clean and remove pub cache"
	@echo "  deps         - Get dependencies"
	@echo "  watch        - Run with hot reload"
	@echo "  test         - Run tests"
	@echo "  serve        - Serve build/web on http://localhost:8080"
	@echo "  serve-port   - Same as serve (default port 8080)"
	@echo "  help         - Show this help"
