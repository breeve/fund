# Fund Manager MVP Makefile
#
# Usage:
#   make mvp-webapp      - Build MVP webapp (npm)
#   make mvp-serve       - Serve MVP webapp in dev mode
#   make mvp-build       - Production build
#   make mvp-test        - Run tests
#   make mvp-lint        - Lint code
#   make mvp-clean       - Clean build artifacts
#
# Alternative package managers (set PKG_MANAGER):
#   make mvp-webapp PKG_MANAGER=pnpm    - Use pnpm
#   make mvp-webapp PKG_MANAGER=yarn    - Use yarn
#
# Version tags for future expansion:
#   make VERSION=mvp-webapp build    - Build specific version

# Package manager (defaults to npm if not specified)
PKG_MANAGER ?= npm

# Commands for different package managers
define PKG_COMMANDS
  npm: install="npm install"; build="npm run build"; dev="npm run dev"; test="npm run test"; lint="npm run lint"; typecheck="npm run type-check"; clean="rm -rf dist node_modules"
  pnpm: install="pnpm install"; build="pnpm build"; dev="pnpm dev"; test="pnpm test"; lint="pnpm lint"; typecheck="pnpm type-check"; clean="pnpm exec rm -rf dist node_modules"
  yarn: install="yarn"; build="yarn build"; dev="yarn dev"; test="yarn test"; lint="yarn lint"; typecheck="yarn type-check"; clean="yarn exec rm -rf dist node_modules"
endef

# Parse package manager commands
INSTALL := $(shell echo "$${PKG_COMMANDS}" | grep "^$(PKG_MANAGER):" | sed 's/.*install="\([^"]*\)".*/\1/')
BUILD := $(shell echo "$${PKG_COMMANDS}" | grep "^$(PKG_MANAGER):" | sed 's/.*build="\([^"]*\)".*/\1/')
DEV := $(shell echo "$${PKG_COMMANDS}" | grep "^$(PKG_MANAGER):" | sed 's/.*dev="\([^"]*\)".*/\1/')
TEST := $(shell echo "$${PKG_COMMANDS}" | grep "^$(PKG_MANAGER):" | sed 's/.*test="\([^"]*\)".*/\1/')
LINT := $(shell echo "$${PKG_COMMANDS}" | grep "^$(PKG_MANAGER):" | sed 's/.*lint="\([^"]*\)".*/\1/')
TYPECHECK := $(shell echo "$${PKG_COMMANDS}" | grep "^$(PKG_MANAGER):" | sed 's/.*typecheck="\([^"]*\)".*/\1/')
CLEAN := $(shell echo "$${PKG_COMMANDS}" | grep "^$(PKG_MANAGER):" | sed 's/.*clean="\([^"]*\)".*/\1/')

.PHONY: mvp-webapp mvp-serve mvp-build mvp-test mvp-test-coverage mvp-lint mvp-clean mvp-typecheck help check-env

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
	@echo "  make mvp-test                # Run tests"

## check-env ────────────────────────────────────────────────────────────────────
check-env: ## Check if required tools are installed
	@echo "Checking environment..."
	@which node > /dev/null || (echo "Error: Node.js is required" && exit 1)
	@echo "  ✓ Node.js: $$(node --version)"
	@which $(PKG_MANAGER) > /dev/null || echo "Warning: $(PKG_MANAGER) not found, falling back to npm"
	@echo "  ✓ Package manager: $(PKG_MANAGER)"

## mvp-webapp ──────────────────────────────────────────────────────────────────
mvp-webapp: check-env ## Build MVP webapp (development)
	@echo "Building MVP webapp with $(PKG_MANAGER)..."
	@echo "  → Installing dependencies..."
	cd webapp && $(or $(shell which $(PKG_MANAGER) 2>/dev/null),npm) install
	@echo "  → Building..."
	cd webapp && $(or $(shell which $(PKG_MANAGER) 2>/dev/null),npm) run build
	@echo "  ✓ Build complete!"

mvp-serve: check-env ## Serve MVP webapp in development mode
	@echo "Starting development server..."
	cd webapp && $(or $(shell which $(PKG_MANAGER) 2>/dev/null),npm) $(DEV)

mvp-build: check-env ## Production build of MVP webapp
	@echo "Production build with $(PKG_MANAGER)..."
	cd webapp && $(or $(shell which $(PKG_MANAGER) 2>/dev/null),npm) install
	cd webapp && $(or $(shell which $(PKG_MANAGER) 2>/dev/null),npm) run build
	@echo "  ✓ Production build complete!"

## mvp-test ─────────────────────────────────────────────────────────────────────
mvp-test: check-env ## Run tests for MVP webapp
	@echo "Running tests..."
	cd webapp && $(or $(shell which $(PKG_MANAGER) 2>/dev/null),npm) run test -- --run

mvp-test-coverage: check-env ## Run tests with coverage
	@echo "Running tests with coverage..."
	cd webapp && $(or $(shell which $(PKG_MANAGER) 2>/dev/null),npm) run test:coverage

## mvp-lint ─────────────────────────────────────────────────────────────────────
mvp-lint: mvp-typecheck ## Lint code
	@echo "Linting code..."
	cd webapp && $(or $(shell which $(PKG_MANAGER) 2>/dev/null),npm) $(LINT)

mvp-typecheck: ## Type check only
	@echo "Type checking..."
	cd webapp && $(or $(shell which $(PKG_MANAGER) 2>/dev/null),npm) $(TYPECHECK)

## mvp-clean ─────────────────────────────────────────────────────────────────────
mvp-clean: ## Clean build artifacts
	@echo "Cleaning build artifacts..."
	cd webapp && rm -rf dist node_modules .vite
	@echo "  ✓ Clean complete."

## Version-specific builds (for future expansion)
VERSION ?= mvp-webapp

build-$(VERSION): check-env
	@echo "Building $(VERSION)..."
	cd $(VERSION) && $(MAKE) mvp-build PKG_MANAGER=$(PKG_MANAGER)

# Meta targets for version management
versions:
	@echo "Available versions:"
	@echo "  mvp-webapp    - MVP web application (React + TypeScript)"
	@ls -d */ 2>/dev/null || echo "  (no other versions yet)"