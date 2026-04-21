.PHONY: all web analyze clean deps test serve serve-build help

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

help:
	@echo "Available targets:"
	@echo "  all          - Build web (default)"
	@echo "  web          - Build web app"
	@echo "  analyze      - Run Flutter analyzer"
	@echo "  clean        - Clean build artifacts"
	@echo "  deps         - Get dependencies"
	@echo "  test         - Run tests"
	@echo "  serve        - Serve existing build/web (no rebuild)"
	@echo "  serve-build  - Build then serve"
	@echo "  help         - Show this help"
	@echo ""
	@echo "Tip: Use 'make serve-build' to build and preview"