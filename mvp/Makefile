# Fund Manager MVP Makefile
#
# Usage:
#   make mvp-webapp      - Build MVP webapp (npm)
#   make mvp-serve      - Serve MVP webapp in dev mode
#   make mvp-build      - Production build
#   make mvp-test       - Run tests
#   make mvp-lint       - Lint code
#   make mvp-clean      - Clean build artifacts
#
# PWA targets:
#   make pwa-icons      - Generate PWA icons
#   make pwa-preview    - Preview PWA production build locally
#
# Capacitor targets:
#   make cap-init       - Initialize Capacitor
#   make cap-add-macos  - Add macOS platform
#   make cap-sync       - Sync web to native
#   make cap-open       - Open native project in Xcode/Android Studio
#
# GitHub Pages:
#   make github-pages  - Build for GitHub Pages (deploys to /fund/ path)
#
# Alternative package managers (set PKG_MANAGER):
#   make mvp-webapp PKG_MANAGER=pnpm    - Use pnpm
#   make mvp-webapp PKG_MANAGER=yarn    - Use yarn
#
# Version tags for future expansion:
#   make VERSION=mvp-webapp build    - Build specific version

# Package manager (defaults to npm if not specified)
PKG_MANAGER ?= npm

# Commands for different package managers - simple ifeq approach
INSTALL := $(if $(filter npm,$(PKG_MANAGER)),npm install,$(if $(filter pnpm,$(PKG_MANAGER)),pnpm install,$(if $(filter yarn,$(PKG_MANAGER)),yarn,echo "unsupported pkg manager")))
DEV := $(if $(filter npm,$(PKG_MANAGER)),npm run dev,$(if $(filter pnpm,$(PKG_MANAGER)),pnpm dev,$(if $(filter yarn,$(PKG_MANAGER)),yarn dev,echo "unsupported pkg manager")))
BUILD := $(if $(filter npm,$(PKG_MANAGER)),npm run build,$(if $(filter pnpm,$(PKG_MANAGER)),pnpm build,$(if $(filter yarn,$(PKG_MANAGER)),yarn build,echo "unsupported pkg manager")))
TEST := $(if $(filter npm,$(PKG_MANAGER)),npm run test,$(if $(filter pnpm,$(PKG_MANAGER)),pnpm test,$(if $(filter yarn,$(PKG_MANAGER)),yarn test,echo "unsupported pkg manager")))
LINT := $(if $(filter npm,$(PKG_MANAGER)),npm run lint,$(if $(filter pnpm,$(PKG_MANAGER)),pnpm lint,$(if $(filter yarn,$(PKG_MANAGER)),yarn lint,echo "unsupported pkg manager")))
TYPECHECK := $(if $(filter npm,$(PKG_MANAGER)),npm run type-check,$(if $(filter pnpm,$(PKG_MANAGER)),pnpm type-check,$(if $(filter yarn,$(PKG_MANAGER)),yarn type-check,echo "unsupported pkg manager")))
CLEAN := $(if $(filter npm,$(PKG_MANAGER)),rm -rf dist node_modules .vite,$(if $(filter pnpm,$(PKG_MANAGER)),pnpm exec rm -rf dist node_modules .vite,$(if $(filter yarn,$(PKG_MANAGER)),yarn exec rm -rf dist node_modules .vite,echo "unsupported pkg manager")))

.PHONY: all help check-env pwa-icons cap-init cap-add-macos cap-add-ios cap-add-android cap-sync cap-open cap-build pwa-preview github-pages \
        mvp-webapp mvp-serve mvp-build mvp-test mvp-test-coverage mvp-lint mvp-clean mvp-typecheck

# Default target
all: mvp-webapp

## help ─────────────────────────────────────────────────────────────────────────
help: ## Show this help message
	@echo "Fund Manager MVP Makefile"
	@echo ""
	@echo "Usage: make [target] [PKG_MANAGER=npm|pnpm|yarn]"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "Examples:"
	@echo "  make mvp-webapp              # Build with npm (default)"
	@echo "  make mvp-webapp PKG_MANAGER=pnpm  # Build with pnpm"
	@echo "  make mvp-serve               # Start dev server"
	@echo "  make pwa-icons               # Generate PWA icons"
	@echo "  make cap-add-macos           # Add macOS Capacitor platform"
	@echo "  make github-pages           # Build for GitHub Pages"

## check-env ───────────────────────────────────────────────────────────────────
check-env: ## Check if required tools are installed
	@echo "Checking environment..."
	@which node > /dev/null || (echo "Error: Node.js is required" && exit 1)
	@echo "  ✓ Node.js: $$(node --version)"
	@which $(PKG_MANAGER) > /dev/null || echo "Warning: $(PKG_MANAGER) not found, falling back to npm"
	@echo "  ✓ Package manager: $(PKG_MANAGER)"

## PWA Targets ──────────────────────────────────────────────────────────────
pwa-icons: ## Generate PWA icons
	@echo "Generating PWA icons..."
	@node scripts/generate-icons.mjs

## GitHub Pages Build ────────────────────────────────────────────────────────
github-pages: check-env ## Build for GitHub Pages deployment
	@echo "Building for GitHub Pages (BASE_PATH=/fund/)..."
	cd webapp && BASE_PATH=/fund/ $(BUILD)
	@echo "  ✓ GitHub Pages build complete! Output in webapp/dist/"
	@echo "  → Deploy webapp/dist/ to GitHub Pages at /fund/ path"

pwa-preview: mvp-build ## Preview production PWA locally
	@echo "Starting preview server..."
	cd webapp && npx serve dist -p 4173

## Capacitor Targets ──────────────────────────────────────────────────────────
cap-init: check-env ## Initialize Capacitor in the webapp
	@echo "Initializing Capacitor..."
	@cd webapp && npm install @capacitor/core @capacitor/cli
	@cd webapp && npx cap init Fund com.fund.app --web-dir=dist
	@echo "  ✓ Capacitor initialized"

cap-add-macos: cap-init ## Add macOS platform
	@echo "Adding macOS platform..."
	@cd webapp && npm install @capacitor/macos
	@cd webapp && npx cap add macos
	@echo "  ✓ macOS platform added. Run 'make cap-sync' to sync."

cap-add-ios: cap-init ## Add iOS platform
	@echo "Adding iOS platform..."
	@cd webapp && npm install @capacitor/ios
	@cd webapp && npx cap add ios
	@echo "  ✓ iOS platform added. Run 'make cap-sync' to sync."

cap-add-android: cap-init ## Add Android platform
	@echo "Adding Android platform..."
	@cd webapp && npm install @capacitor/android
	@cd webapp && npx cap add android
	@echo "  ✓ Android platform added. Run 'make cap-sync' to sync."

cap-sync: mvp-build ## Sync web assets to native projects
	@echo "Syncing to native platforms..."
	@cd webapp && npx cap sync
	@echo "  ✓ Sync complete"

cap-open: ## Open native project in IDE (Xcode/Android Studio)
	@echo "Opening native project..."
	@cd webapp && npx cap open macos

cap-build: mvp-build cap-sync ## Full build: web + native sync
	@echo "  ✓ Full Capacitor build complete"
	@echo "  → Native projects synced. Open with 'make cap-open'"

## Webapp Targets ────────────────────────────────────────────────────────────
mvp-webapp: check-env ## Build MVP webapp (development)
	@echo "Building MVP webapp with $(PKG_MANAGER)..."
	@echo "  → Installing dependencies..."
	@cd webapp && $(INSTALL)
	@echo "  → Building..."
	@cd webapp && $(BUILD)
	@echo "  ✓ Build complete!"

mvp-serve: check-env ## Serve MVP webapp in development mode
	@echo "Starting development server..."
	@cd webapp && $(DEV)

mvp-build: check-env ## Production build of MVP webapp
	@echo "Production build with $(PKG_MANAGER)..."
	@cd webapp && $(INSTALL)
	@cd webapp && $(BUILD)
	@echo "  ✓ Production build complete!"

## mvp-test ─────────────────────────────────────────────────────────────────────
mvp-test: check-env ## Run tests for MVP webapp
	@echo "Running tests..."
	@cd webapp && $(TEST) -- --run

mvp-test-coverage: check-env ## Run tests with coverage
	@echo "Running tests with coverage..."
	@cd webapp && $(TEST):coverage

## mvp-lint ─────────────────────────────────────────────────────────────────────
mvp-lint: mvp-typecheck ## Lint code
	@echo "Linting code..."
	@cd webapp && $(LINT)

mvp-typecheck: ## Type check only
	@echo "Type checking..."
	@cd webapp && $(TYPECHECK)

## mvp-clean ─────────────────────────────────────────────────────────────────────
mvp-clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
	@cd webapp && rm -rf dist node_modules .vite
	@echo "  ✓ Clean complete."

## Version-specific builds (for future expansion)
VERSION ?= mvp-webapp

build-$(VERSION): check-env
	@echo "Building $(VERSION)..."
	cd $(VERSION) && $(MAKE) mvp-build PKG_MANAGER=$(PKG_MANAGER)

# Meta targets for version management
versions:
	@echo "Available versions:"
	@echo "  mvp-webapp    - MVP web application (React + TypeScript + PWA)"
	@ls -d */ 2>/dev/null || echo "  (no other versions yet)"
