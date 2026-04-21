# Fund Manager — Root Makefile
#
# This file delegates to sub-project Makefiles (e.g. mvp/Makefile).
# Usage:
#   make help               - Show available targets
#   make mvp-<target>       - Run mvp target  (e.g. make mvp-build)
#   make mvp PKG_MANAGER=pnpm  - Use pnpm instead of npm
#
# Package managers: npm (default), pnpm, yarn

PKG_MANAGER ?= npm
SUB_MAKE := $(MAKE) --directory=mvp PKG_MANAGER=$(PKG_MANAGER)
FUND_MAKE := $(MAKE) --directory=fund

# ── Colours ────────────────────────────────────────────────────────────────────
GREEN  := $(shell tput setaf 2 2>/dev/null || echo '')
YELLOW := $(shell tput setaf 3 2>/dev/null || echo '')
CYAN  := $(shell tput setaf 6 2>/dev/null || echo '')
DIM   := $(shell tput dim 2>/dev/null || echo '')
RESET := $(shell tput sgr0 2>/dev/null || echo '')

define print
	@printf '$(DIM)%s$(RESET)\n' "$(1)"
endef

# ── Default ────────────────────────────────────────────────────────────────────
.PHONY: all
all: help

## help ─────────────────────────────────────────────────────────────────────────
help: ## Show this help message
	@echo "$(CYAN)Fund Manager — Available targets$(RESET)"
	@echo ""
	@echo "$(YELLOW)  General$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-22s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)  MVP Webapp  (prefixed with 'mvp-')$(RESET)"
	@$(SUB_MAKE) help 2>/dev/null | awk '{print "  mvp-" $$0}' | sed '1,3d'
	@echo ""
	@echo "$(YELLOW)  Flutter Fund  (prefixed with 'fund-')$(RESET)"
	@$(FUND_MAKE) help 2>/dev/null | awk '{print "  fund-" $$0}' | sed '1,3d'
	@echo ""
	@echo "$(DIM)  PKG_MANAGER=$(PKG_MANAGER)  — override with: make mvp-build PKG_MANAGER=pnpm$(RESET)"

# ── MVP targets ────────────────────────────────────────────────────────────────
.PHONY: mvp
mvp: ## Run arbitrary mvp target
	@echo "$(YELLOW)Use: make mvp-<target>   e.g. make mvp-build$(RESET)"

.PHONY: mvp-webapp mvp-serve mvp-build mvp-test mvp-test-coverage mvp-lint mvp-clean mvp-typecheck
mvp-webapp:         ## Install deps + build MVP webapp (dev)
	$(SUB_MAKE) mvp-webapp

mvp-serve:          ## Start Vite dev server
	$(SUB_MAKE) mvp-serve

mvp-build:          ## Production build
	$(SUB_MAKE) mvp-build

mvp-test:           ## Run tests
	$(SUB_MAKE) mvp-test

mvp-test-coverage:  ## Run tests with coverage
	$(SUB_MAKE) mvp-test-coverage

mvp-lint:           ## Lint + type-check
	$(SUB_MAKE) mvp-lint

mvp-typecheck:      ## TypeScript type-check only
	$(SUB_MAKE) mvp-typecheck

mvp-clean:          ## Clean build artifacts
	$(SUB_MAKE) mvp-clean

# ── Flutter Fund targets ───────────────────────────────────────────────────────
.PHONY: fund
fund: ## Run arbitrary fund target
	@echo "$(YELLOW)Use: make fund-<target>   e.g. make fund-web$(RESET)"

.PHONY: fund-web fund-web-release fund-dev fund-analyze fund-clean fund-deps fund-test fund-ios fund-macos
fund-web:          ## Build Flutter web app
	$(FUND_MAKE) web

fund-web-release:  ## Build Flutter web app for production
	$(FUND_MAKE) web-release

fund-dev:          ## Run Flutter in dev mode
	$(FUND_MAKE) dev

fund-serve:        ## Serve build/web on http://localhost:8080
	$(FUND_MAKE) serve

fund-analyze:      ## Run Flutter analyzer
	$(FUND_MAKE) analyze

fund-clean:        ## Clean build artifacts
	$(FUND_MAKE) clean

fund-deps:         ## Get dependencies
	$(FUND_MAKE) deps

fund-test:         ## Run tests
	$(FUND_MAKE) test

fund-ios:          ## Build iOS (requires macOS)
	$(FUND_MAKE) ios

fund-macos:        ## Build macOS (requires macOS)
	$(FUND_MAKE) macos

fund-serve-port:   ## Serve build/web on custom port (PORT=8080 make fund-serve-port PORT=9000)
	$(FUND_MAKE) serve-port PORT=$(PORT)

# ── PWA ────────────────────────────────────────────────────────────────────────
.PHONY: pwa-icons pwa-preview github-pages
pwa-icons:          ## Generate PWA icons
	$(SUB_MAKE) pwa-icons

pwa-preview:        ## Preview production build locally
	$(SUB_MAKE) pwa-preview

github-pages:       ## Build for GitHub Pages (/fund/ base path)
	$(SUB_MAKE) github-pages

# ── Capacitor ──────────────────────────────────────────────────────────────────
.PHONY: cap-init cap-add-macos cap-add-ios cap-add-android cap-sync cap-open cap-build
cap-init:           ## Initialize Capacitor in the webapp
	$(SUB_MAKE) cap-init

cap-add-macos:      ## Add macOS platform
	$(SUB_MAKE) cap-add-macos

cap-add-ios:        ## Add iOS platform
	$(SUB_MAKE) cap-add-ios

cap-add-android:    ## Add Android platform
	$(SUB_MAKE) cap-add-android

cap-sync:           ## Sync web assets to native projects
	$(SUB_MAKE) cap-sync

cap-open:           ## Open native project in IDE
	$(SUB_MAKE) cap-open

cap-build:          ## Full build: web + native sync
	$(SUB_MAKE) cap-build

# ── Meta ───────────────────────────────────────────────────────────────────────
.PHONY: check-env versions
check-env:          ## Check required tools (node, package manager)
	$(SUB_MAKE) check-env

versions:           ## List available project versions
	$(SUB_MAKE) versions