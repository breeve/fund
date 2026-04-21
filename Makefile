# Fund Manager — Root Makefile
#
# Usage:
#   make help               - Show available targets
#   make fund-<target>      - Run fund target (e.g. make fund-web)
#
# Examples:
#   make fund-web           - Build web
#   make fund-analyze       - Analyze
#   make fund-test          - Test
#   make fund-serve         - Serve existing build

FUND_MAKE := $(MAKE) --directory=fund

# ── Colours ────────────────────────────────────────────────────────────────────
GREEN  := $(shell tput setaf 2 2>/dev/null || echo '')
YELLOW := $(shell tput setaf 3 2>/dev/null || echo '')
CYAN  := $(shell tput setaf 6 2>/dev/null || echo '')
DIM   := $(shell tput dim 2>/dev/null || echo '')
RESET := $(shell tput sgr0 2>/dev/null || echo '')

# ── Default ────────────────────────────────────────────────────────────────────
.PHONY: all
all: help

## help ─────────────────────────────────────────────────────────────────────────
help: ## Show this help message
	@echo "$(CYAN)Fund Manager — Available targets$(RESET)"
	@echo ""
	@echo "$(YELLOW)  Flutter Fund  (prefixed with 'fund-')$(RESET)"
	@$(FUND_MAKE) help 2>/dev/null | awk '{print "  fund-" $$0}' | sed '1,3d'

# ── Flutter Fund targets ───────────────────────────────────────────────────────
.PHONY: fund-web fund-analyze fund-clean fund-deps fund-test fund-serve fund-serve-build

fund-web:          ## Build Flutter web app
	$(FUND_MAKE) web

fund-analyze:      ## Run Flutter analyzer
	$(FUND_MAKE) analyze

fund-clean:        ## Clean build artifacts
	$(FUND_MAKE) clean

fund-deps:         ## Get dependencies
	$(FUND_MAKE) deps

fund-test:         ## Run tests
	$(FUND_MAKE) test

fund-serve:        ## Serve existing build/web on http://localhost:8080 (no rebuild)
	$(FUND_MAKE) serve

fund-serve-build:  ## Build then serve on http://localhost:8080
	$(FUND_MAKE) serve-build
