package service

import (
	"house/internal/model"
	"house/internal/repository"
)

// HouseService 房产服务
type HouseService struct {
	districtRepo  *repository.DistrictRepository
	blockRepo     *repository.BlockRepository
	lifeCircleRepo *repository.LifeCircleRepository
	communityRepo *repository.CommunityRepository
}

// NewHouseService 创建房产服务
func NewHouseService(
	districtRepo *repository.DistrictRepository,
	blockRepo *repository.BlockRepository,
	lifeCircleRepo *repository.LifeCircleRepository,
	communityRepo *repository.CommunityRepository,
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
func (s *HouseService) ListDistricts() ([]model.District, error) {
	return s.districtRepo.FindAll()
}

// GetDistrict 获取行政区
func (s *HouseService) GetDistrict(id int64) (*model.District, error) {
	return s.districtRepo.FindByID(id)
}

// CreateDistrict 创建行政区
func (s *HouseService) CreateDistrict(d *model.District) error {
	return s.districtRepo.Create(d)
}

// UpdateDistrict 更新行政区
func (s *HouseService) UpdateDistrict(d *model.District) error {
	return s.districtRepo.Update(d)
}

// 板块服务

// ListBlocks 获取所有板块
func (s *HouseService) ListBlocks() ([]model.Block, error) {
	return s.blockRepo.FindAll()
}

// GetBlock 获取板块
func (s *HouseService) GetBlock(id int64) (*model.Block, error) {
	return s.blockRepo.FindByID(id)
}

// ListBlocksByDistrict 获取指定行政区下的板块
func (s *HouseService) ListBlocksByDistrict(districtID int64) ([]model.Block, error) {
	return s.blockRepo.FindByDistrictID(districtID)
}

// CreateBlock 创建板块
func (s *HouseService) CreateBlock(b *model.Block) error {
	return s.blockRepo.Create(b)
}

// UpdateBlock 更新板块
func (s *HouseService) UpdateBlock(b *model.Block) error {
	return s.blockRepo.Update(b)
}

// 生活圈服务

// ListLifeCircles 获取所有生活圈
func (s *HouseService) ListLifeCircles() ([]model.LifeCircle, error) {
	return s.lifeCircleRepo.FindAll()
}

// GetLifeCircle 获取生活圈
func (s *HouseService) GetLifeCircle(id int64) (*model.LifeCircle, error) {
	return s.lifeCircleRepo.FindByID(id)
}

// ListLifeCirclesByBlock 获取指定板块下的生活圈
func (s *HouseService) ListLifeCirclesByBlock(blockID int64) ([]model.LifeCircle, error) {
	return s.lifeCircleRepo.FindByBlockID(blockID)
}

// CreateLifeCircle 创建生活圈
func (s *HouseService) CreateLifeCircle(lc *model.LifeCircle) error {
	return s.lifeCircleRepo.Create(lc)
}

// UpdateLifeCircle 更新生活圈
func (s *HouseService) UpdateLifeCircle(lc *model.LifeCircle) error {
	return s.lifeCircleRepo.Update(lc)
}

// 小区服务

// ListCommunities 获取所有小区
func (s *HouseService) ListCommunities() ([]model.Community, error) {
	return s.communityRepo.FindAll()
}

// GetCommunity 获取小区
func (s *HouseService) GetCommunity(id int64) (*model.Community, error) {
	return s.communityRepo.FindByID(id)
}

// ListCommunitiesByBlock 获取指定板块下的小区
func (s *HouseService) ListCommunitiesByBlock(blockID int64) ([]model.Community, error) {
	return s.communityRepo.FindByBlockID(blockID)
}

// ListCommunitiesByLifeCircle 获取指定生活圈内的小区
func (s *HouseService) ListCommunitiesByLifeCircle(lifeCircleID int64) ([]model.Community, error) {
	return s.communityRepo.FindByLifeCircleID(lifeCircleID)
}

// CreateCommunity 创建小区
func (s *HouseService) CreateCommunity(c *model.Community) error {
	return s.communityRepo.Create(c)
}

// UpdateCommunity 更新小区
func (s *HouseService) UpdateCommunity(c *model.Community) error {
	return s.communityRepo.Update(c)
}
