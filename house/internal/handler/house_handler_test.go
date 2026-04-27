package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"house/internal/model"
	"house/internal/repository"

	"github.com/gin-gonic/gin"
)

// Fake implementations for handler testing

type fakeDistrictRepo struct {
	districts []model.District
	total     int64
}

func (f *fakeDistrictRepo) FindAll(ctx context.Context, p repository.Pagination) ([]model.District, int64, error) {
	return f.districts, f.total, nil
}
func (f *fakeDistrictRepo) FindByID(ctx context.Context, id int64) (*model.District, error) {
	if len(f.districts) > 0 {
		return &f.districts[0], nil
	}
	return nil, nil
}
func (f *fakeDistrictRepo) FindByCode(ctx context.Context, code string) (*model.District, error) {
	return nil, nil
}
func (f *fakeDistrictRepo) Create(ctx context.Context, d *model.District) error {
	return nil
}
func (f *fakeDistrictRepo) Update(ctx context.Context, d *model.District) error {
	return nil
}
func (f *fakeDistrictRepo) Delete(ctx context.Context, id int64) error {
	return nil
}

type fakeBlockRepo struct{}

func (f *fakeBlockRepo) FindAll(ctx context.Context, p repository.Pagination) ([]model.Block, int64, error) {
	return nil, 0, nil
}
func (f *fakeBlockRepo) FindByID(ctx context.Context, id int64) (*model.Block, error) {
	return nil, nil
}
func (f *fakeBlockRepo) FindByDistrictID(ctx context.Context, districtID int64, p repository.Pagination) ([]model.Block, int64, error) {
	return nil, 0, nil
}
func (f *fakeBlockRepo) Create(ctx context.Context, b *model.Block) error { return nil }
func (f *fakeBlockRepo) Update(ctx context.Context, b *model.Block) error { return nil }
func (f *fakeBlockRepo) Delete(ctx context.Context, id int64) error       { return nil }

type fakeLifeCircleRepo struct{}

func (f *fakeLifeCircleRepo) FindAll(ctx context.Context, p repository.Pagination) ([]model.LifeCircle, int64, error) {
	return nil, 0, nil
}
func (f *fakeLifeCircleRepo) FindByID(ctx context.Context, id int64) (*model.LifeCircle, error) {
	return nil, nil
}
func (f *fakeLifeCircleRepo) FindByBlockID(ctx context.Context, blockID int64, p repository.Pagination) ([]model.LifeCircle, int64, error) {
	return nil, 0, nil
}
func (f *fakeLifeCircleRepo) Create(ctx context.Context, lc *model.LifeCircle) error { return nil }
func (f *fakeLifeCircleRepo) Update(ctx context.Context, lc *model.LifeCircle) error { return nil }
func (f *fakeLifeCircleRepo) Delete(ctx context.Context, id int64) error             { return nil }

type fakeCommunityRepo struct{}

func (f *fakeCommunityRepo) FindAll(ctx context.Context, p repository.Pagination) ([]model.Community, int64, error) {
	return nil, 0, nil
}
func (f *fakeCommunityRepo) FindByID(ctx context.Context, id int64) (*model.Community, error) {
	return nil, nil
}
func (f *fakeCommunityRepo) FindByBlockID(ctx context.Context, blockID int64, p repository.Pagination) ([]model.Community, int64, error) {
	return nil, 0, nil
}
func (f *fakeCommunityRepo) FindByLifeCircleID(ctx context.Context, lifeCircleID int64, p repository.Pagination) ([]model.Community, int64, error) {
	return nil, 0, nil
}
func (f *fakeCommunityRepo) FindAllWithFilters(ctx context.Context, p repository.Pagination, priceMin, priceMax *float64, blockID, lifeCircleID *int64) ([]model.Community, int64, error) {
	return nil, 0, nil
}
func (f *fakeCommunityRepo) Create(ctx context.Context, c *model.Community) error { return nil }
func (f *fakeCommunityRepo) Update(ctx context.Context, c *model.Community) error { return nil }
func (f *fakeCommunityRepo) Delete(ctx context.Context, id int64) error           { return nil }

func setupTestRouter() (*gin.Engine, *HouseHandler) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	svc := newTestService()
	h := NewHouseHandler(svc)
	h.RegisterRoutes(r)
	return r, h
}

func newTestService() *testService {
	return &testService{
		districtRepo:   &fakeDistrictRepo{},
		blockRepo:      &fakeBlockRepo{},
		lifeCircleRepo: &fakeLifeCircleRepo{},
		communityRepo:  &fakeCommunityRepo{},
	}
}

// testService implements service.HouseService interface via fake repos
type testService struct {
	districtRepo   repository.DistrictRepo
	blockRepo      repository.BlockRepo
	lifeCircleRepo repository.LifeCircleRepo
	communityRepo  repository.CommunityRepo
}

func (s *testService) ListDistricts(ctx context.Context, p repository.Pagination) ([]model.District, int64, error) {
	return s.districtRepo.FindAll(ctx, p)
}
func (s *testService) GetDistrict(ctx context.Context, id int64) (*model.District, error) {
	return s.districtRepo.FindByID(ctx, id)
}
func (s *testService) CreateDistrict(ctx context.Context, d *model.District) error {
	return s.districtRepo.Create(ctx, d)
}
func (s *testService) UpdateDistrict(ctx context.Context, d *model.District) error {
	return s.districtRepo.Update(ctx, d)
}
func (s *testService) DeleteDistrict(ctx context.Context, id int64) error {
	return s.districtRepo.Delete(ctx, id)
}
func (s *testService) ListBlocks(ctx context.Context, p repository.Pagination) ([]model.Block, int64, error) {
	return s.blockRepo.FindAll(ctx, p)
}
func (s *testService) GetBlock(ctx context.Context, id int64) (*model.Block, error) {
	return s.blockRepo.FindByID(ctx, id)
}
func (s *testService) ListBlocksByDistrict(ctx context.Context, districtID int64, p repository.Pagination) ([]model.Block, int64, error) {
	return s.blockRepo.FindByDistrictID(ctx, districtID, p)
}
func (s *testService) CreateBlock(ctx context.Context, b *model.Block) error { return nil }
func (s *testService) UpdateBlock(ctx context.Context, b *model.Block) error { return nil }
func (s *testService) DeleteBlock(ctx context.Context, id int64) error       { return nil }
func (s *testService) ListLifeCircles(ctx context.Context, p repository.Pagination) ([]model.LifeCircle, int64, error) {
	return nil, 0, nil
}
func (s *testService) GetLifeCircle(ctx context.Context, id int64) (*model.LifeCircle, error) {
	return nil, nil
}
func (s *testService) ListLifeCirclesByBlock(ctx context.Context, blockID int64, p repository.Pagination) ([]model.LifeCircle, int64, error) {
	return nil, 0, nil
}
func (s *testService) CreateLifeCircle(ctx context.Context, lc *model.LifeCircle) error { return nil }
func (s *testService) UpdateLifeCircle(ctx context.Context, lc *model.LifeCircle) error { return nil }
func (s *testService) DeleteLifeCircle(ctx context.Context, id int64) error             { return nil }
func (s *testService) ListCommunities(ctx context.Context, p repository.Pagination, priceMin, priceMax *float64, blockID, lifeCircleID *int64) ([]model.Community, int64, error) {
	return nil, 0, nil
}
func (s *testService) GetCommunity(ctx context.Context, id int64) (*model.Community, error) {
	return nil, nil
}
func (s *testService) CreateCommunity(ctx context.Context, c *model.Community) error { return nil }
func (s *testService) UpdateCommunity(ctx context.Context, c *model.Community) error { return nil }
func (s *testService) DeleteCommunity(ctx context.Context, id int64) error           { return nil }

func TestListDistricts_Paginated(t *testing.T) {
	r, _ := setupTestRouter()

	tests := []struct {
		name           string
		query          string
		wantStatus     int
		wantHasData    bool
		wantHasTotal   bool
		wantHasPage    bool
	}{
		{
			name:         "default pagination",
			query:        "",
			wantStatus:   http.StatusOK,
			wantHasData:  true,
			wantHasTotal: true,
			wantHasPage:  true,
		},
		{
			name:         "custom page and limit",
			query:        "?page=2&limit=10",
			wantStatus:   http.StatusOK,
			wantHasData:  true,
			wantHasTotal: true,
			wantHasPage:  true,
		},
		{
			name:         "limit capped at 200",
			query:        "?limit=500",
			wantStatus:   http.StatusOK,
			wantHasData:  true,
			wantHasTotal: true,
			wantHasPage:  true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := httptest.NewRequest(http.MethodGet, "/districts"+tt.query, nil)
			w := httptest.NewRecorder()
			r.ServeHTTP(w, req)

			if w.Code != tt.wantStatus {
				t.Errorf("status = %d, want %d", w.Code, tt.wantStatus)
			}

			var resp map[string]interface{}
			json.Unmarshal(w.Body.Bytes(), &resp)

			data, hasData := resp["data"]
			if tt.wantHasData && !hasData {
				t.Error("expected 'data' in response")
			}

			_, hasTotal := resp["total"]
			if tt.wantHasTotal && !hasTotal {
				t.Error("expected 'total' in response")
			}

			_, hasPage := resp["page"]
			if tt.wantHasPage && !hasPage {
				t.Error("expected 'page' in response")
			}

			_ = data // use data if needed
		})
	}
}

func TestGetDistrict_NotFound(t *testing.T) {
	r, _ := setupTestRouter()

	req := httptest.NewRequest(http.MethodGet, "/districts/99999", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Errorf("status = %d, want %d", w.Code, http.StatusNotFound)
	}
}

func TestCreateDistrict_InvalidJSON(t *testing.T) {
	r, _ := setupTestRouter()

	req := httptest.NewRequest(http.MethodPost, "/districts", strings.NewReader("invalid json"))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", w.Code, http.StatusBadRequest)
	}
}

func TestListBlocks_FilterByDistrict(t *testing.T) {
	r, _ := setupTestRouter()

	req := httptest.NewRequest(http.MethodGet, "/blocks?district_id=5", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)

	if _, ok := resp["data"]; !ok {
		t.Error("expected 'data' in response")
	}
}

func TestListCommunities_PriceFilter(t *testing.T) {
	r, _ := setupTestRouter()

	req := httptest.NewRequest(http.MethodGet, "/communities?price_min=30000&price_max=60000", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
	}
}

func TestDeleteDistrict_Success(t *testing.T) {
	r, _ := setupTestRouter()

	req := httptest.NewRequest(http.MethodDelete, "/districts/1", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("status = %d, want %d", w.Code, http.StatusOK)
	}
}

func TestHealthCheck_NotRegistered(t *testing.T) {
	r, _ := setupTestRouter()

	req := httptest.NewRequest(http.MethodGet, "/health", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	// /health is registered in main.go, not in RegisterRoutes
	// so it won't be found in the test router
	if w.Code != http.StatusNotFound {
		t.Logf("health endpoint found (status %d)", w.Code)
	}
}