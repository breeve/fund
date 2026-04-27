package service

import (
	"context"

	"house/internal/model"
	"house/internal/repository"
)

// HouseServiceInterface 服务层接口（用于依赖注入和测试 mock）
type HouseServiceInterface interface {
	// 行政区
	ListDistricts(ctx context.Context, p repository.Pagination) ([]model.District, int64, error)
	GetDistrict(ctx context.Context, id int64) (*model.District, error)
	CreateDistrict(ctx context.Context, d *model.District) error
	UpdateDistrict(ctx context.Context, d *model.District) error
	DeleteDistrict(ctx context.Context, id int64) error
	// 板块
	ListBlocks(ctx context.Context, p repository.Pagination) ([]model.Block, int64, error)
	GetBlock(ctx context.Context, id int64) (*model.Block, error)
	ListBlocksByDistrict(ctx context.Context, districtID int64, p repository.Pagination) ([]model.Block, int64, error)
	CreateBlock(ctx context.Context, b *model.Block) error
	UpdateBlock(ctx context.Context, b *model.Block) error
	DeleteBlock(ctx context.Context, id int64) error
	// 生活圈
	ListLifeCircles(ctx context.Context, p repository.Pagination) ([]model.LifeCircle, int64, error)
	GetLifeCircle(ctx context.Context, id int64) (*model.LifeCircle, error)
	ListLifeCirclesByBlock(ctx context.Context, blockID int64, p repository.Pagination) ([]model.LifeCircle, int64, error)
	CreateLifeCircle(ctx context.Context, lc *model.LifeCircle) error
	UpdateLifeCircle(ctx context.Context, lc *model.LifeCircle) error
	DeleteLifeCircle(ctx context.Context, id int64) error
	// 小区
	ListCommunities(ctx context.Context, p repository.Pagination, priceMin, priceMax *float64, blockID, lifeCircleID *int64) ([]model.Community, int64, error)
	GetCommunity(ctx context.Context, id int64) (*model.Community, error)
	CreateCommunity(ctx context.Context, c *model.Community) error
	UpdateCommunity(ctx context.Context, c *model.Community) error
	DeleteCommunity(ctx context.Context, id int64) error
}

// HouseService 房产服务
type HouseService struct {
	districtRepo   repository.DistrictRepo
	blockRepo      repository.BlockRepo
	lifeCircleRepo repository.LifeCircleRepo
	communityRepo  repository.CommunityRepo
}

// NewHouseService 创建房产服务
func NewHouseService(
	districtRepo repository.DistrictRepo,
	blockRepo repository.BlockRepo,
	lifeCircleRepo repository.LifeCircleRepo,
	communityRepo repository.CommunityRepo,
) *HouseService {
	return &HouseService{
		districtRepo:   districtRepo,
		blockRepo:      blockRepo,
		lifeCircleRepo: lifeCircleRepo,
		communityRepo:  communityRepo,
	}
}

// 行政区服务

// ListDistricts 获取所有行政区
func (s *HouseService) ListDistricts(ctx context.Context, p repository.Pagination) ([]model.District, int64, error) {
	return s.districtRepo.FindAll(ctx, p)
}

// GetDistrict 获取行政区
func (s *HouseService) GetDistrict(ctx context.Context, id int64) (*model.District, error) {
	return s.districtRepo.FindByID(ctx, id)
}

// CreateDistrict 创建行政区
func (s *HouseService) CreateDistrict(ctx context.Context, d *model.District) error {
	return s.districtRepo.Create(ctx, d)
}

// UpdateDistrict 更新行政区
func (s *HouseService) UpdateDistrict(ctx context.Context, d *model.District) error {
	return s.districtRepo.Update(ctx, d)
}

// DeleteDistrict 删除行政区
func (s *HouseService) DeleteDistrict(ctx context.Context, id int64) error {
	return s.districtRepo.Delete(ctx, id)
}

// 板块服务

// ListBlocks 获取所有板块
func (s *HouseService) ListBlocks(ctx context.Context, p repository.Pagination) ([]model.Block, int64, error) {
	return s.blockRepo.FindAll(ctx, p)
}

// GetBlock 获取板块
func (s *HouseService) GetBlock(ctx context.Context, id int64) (*model.Block, error) {
	return s.blockRepo.FindByID(ctx, id)
}

// ListBlocksByDistrict 获取指定行政区下的板块
func (s *HouseService) ListBlocksByDistrict(ctx context.Context, districtID int64, p repository.Pagination) ([]model.Block, int64, error) {
	return s.blockRepo.FindByDistrictID(ctx, districtID, p)
}

// CreateBlock 创建板块
func (s *HouseService) CreateBlock(ctx context.Context, b *model.Block) error {
	return s.blockRepo.Create(ctx, b)
}

// UpdateBlock 更新板块
func (s *HouseService) UpdateBlock(ctx context.Context, b *model.Block) error {
	return s.blockRepo.Update(ctx, b)
}

// DeleteBlock 删除板块
func (s *HouseService) DeleteBlock(ctx context.Context, id int64) error {
	return s.blockRepo.Delete(ctx, id)
}

// 生活圈服务

// ListLifeCircles 获取所有生活圈
func (s *HouseService) ListLifeCircles(ctx context.Context, p repository.Pagination) ([]model.LifeCircle, int64, error) {
	return s.lifeCircleRepo.FindAll(ctx, p)
}

// GetLifeCircle 获取生活圈
func (s *HouseService) GetLifeCircle(ctx context.Context, id int64) (*model.LifeCircle, error) {
	return s.lifeCircleRepo.FindByID(ctx, id)
}

// ListLifeCirclesByBlock 获取指定板块下的生活圈
func (s *HouseService) ListLifeCirclesByBlock(ctx context.Context, blockID int64, p repository.Pagination) ([]model.LifeCircle, int64, error) {
	return s.lifeCircleRepo.FindByBlockID(ctx, blockID, p)
}

// CreateLifeCircle 创建生活圈
func (s *HouseService) CreateLifeCircle(ctx context.Context, lc *model.LifeCircle) error {
	return s.lifeCircleRepo.Create(ctx, lc)
}

// UpdateLifeCircle 更新生活圈
func (s *HouseService) UpdateLifeCircle(ctx context.Context, lc *model.LifeCircle) error {
	return s.lifeCircleRepo.Update(ctx, lc)
}

// DeleteLifeCircle 删除生活圈
func (s *HouseService) DeleteLifeCircle(ctx context.Context, id int64) error {
	return s.lifeCircleRepo.Delete(ctx, id)
}

// 小区服务

// ListCommunities 获取小区（支持组合筛选）
func (s *HouseService) ListCommunities(
	ctx context.Context, p repository.Pagination,
	priceMin, priceMax *float64, blockID, lifeCircleID *int64,
) ([]model.Community, int64, error) {
	return s.communityRepo.FindAllWithFilters(ctx, p, priceMin, priceMax, blockID, lifeCircleID)
}

// GetCommunity 获取小区
func (s *HouseService) GetCommunity(ctx context.Context, id int64) (*model.Community, error) {
	return s.communityRepo.FindByID(ctx, id)
}

// CreateCommunity 创建小区
func (s *HouseService) CreateCommunity(ctx context.Context, c *model.Community) error {
	return s.communityRepo.Create(ctx, c)
}

// UpdateCommunity 更新小区
func (s *HouseService) UpdateCommunity(ctx context.Context, c *model.Community) error {
	return s.communityRepo.Update(ctx, c)
}

// DeleteCommunity 删除小区
func (s *HouseService) DeleteCommunity(ctx context.Context, id int64) error {
	return s.communityRepo.Delete(ctx, id)
}