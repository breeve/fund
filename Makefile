# Fund Manager — Root Makefile
#
# This file delegates to sub-project Makefiles.
# Usage:
#   make help               - Show available targets
#   make fund-<target>      - Run fund target  (e.g. make fund-web)
#   make fund PKG_MANAGER=pnpm  - Use pnpm instead of npm
#
# Package managers: npm (default), pnpm, yarn

PKG_MANAGER ?= npm
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
	@echo "$(YELLOW)  Flutter Fund  (prefixed with 'fund-')$(RESET)"
	@$(FUND_MAKE) help 2>/dev/null | awk '{print "  fund-" $$0}' | sed '1,3d'
	@echo ""
	@echo "$(DIM)  PKG_MANAGER=$(PKG_MANAGER)  — override with: make fund-web PKG_MANAGER=pnpm$(RESET)"

# ── Flutter Fund targets ───────────────────────────────────────────────────────
.PHONY: fund
fund: ## Run arbitrary fund target
	@echo "$(YELLOW)Use: make fund-<target>   e.g. make fund-web$(RESET)"

.PHONY: fund-web fund-web-release fund-dev fund-serve fund-analyze fund-clean fund-deps fund-test fund-ios fund-macos
fund-web:          ## Build Flutter web app
	$(FUND_MAKE) web

fund-web-release:  ## Build Flutter web app for production
	$(FUND_MAKE) web-release

fund-dev:          ## Run Flutter in dev mode (hot reload)
	$(FUND_MAKE) dev

fund-serve:        ## Serve existing build/web on http://localhost:8080 (no rebuild)
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

# ── Meta ───────────────────────────────────────────────────────────────────────
.PHONY: check-env versions
check-env:          ## Check required tools (node, package manager)
	$(FUND_MAKE) check-env

versions:           ## List available project versions
	$(FUND_MAKE) versions
