package repository

import (
	"context"

	"house/internal/model"

	"gorm.io/gorm"
)

// CommunityRepository 小区仓储
type CommunityRepository struct {
	db *gorm.DB
}

// NewCommunityRepository 创建小区仓储
func NewCommunityRepository(db *gorm.DB) *CommunityRepository {
	return &CommunityRepository{db: db}
}

// FindAll 获取所有小区（分页）
func (r *CommunityRepository) FindAll(ctx context.Context, p Pagination) ([]model.Community, int64, error) {
	var communities []model.Community
	var total int64
	if err := r.db.WithContext(ctx).Model(&model.Community{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := r.db.WithContext(ctx).Offset(p.Offset).Limit(p.Limit).Find(&communities).Error
	return communities, total, err
}

// FindByID 根据ID获取
func (r *CommunityRepository) FindByID(ctx context.Context, id int64) (*model.Community, error) {
	var c model.Community
	err := r.db.WithContext(ctx).First(&c, id).Error
	if err != nil {
		return nil, err
	}
	return &c, nil
}

// FindByBlockID 获取指定板块下的小区
func (r *CommunityRepository) FindByBlockID(ctx context.Context, blockID int64, p Pagination) ([]model.Community, int64, error) {
	var communities []model.Community
	query := r.db.WithContext(ctx).Model(&model.Community{}).Where("block_id = ?", blockID)
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := query.Offset(p.Offset).Limit(p.Limit).Find(&communities).Error
	return communities, total, err
}

// FindByLifeCircleID 获取指定生活圈内的小区
func (r *CommunityRepository) FindByLifeCircleID(ctx context.Context, lifeCircleID int64, p Pagination) ([]model.Community, int64, error) {
	var communities []model.Community
	query := r.db.WithContext(ctx).Model(&model.Community{}).Where("life_circle_id = ?", lifeCircleID)
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := query.Offset(p.Offset).Limit(p.Limit).Find(&communities).Error
	return communities, total, err
}

// FindAllWithFilters 支持组合条件查询（价格区间 + block_id + life_circle_id，分页）
func (r *CommunityRepository) FindAllWithFilters(
	ctx context.Context, p Pagination,
	priceMin, priceMax *float64, blockID, lifeCircleID *int64,
) ([]model.Community, int64, error) {
	query := r.db.WithContext(ctx).Model(&model.Community{})
	if priceMin != nil {
		query = query.Where("listing_price >= ?", *priceMin)
	}
	if priceMax != nil {
		query = query.Where("listing_price <= ?", *priceMax)
	}
	if blockID != nil {
		query = query.Where("block_id = ?", *blockID)
	}
	if lifeCircleID != nil {
		query = query.Where("life_circle_id = ?", *lifeCircleID)
	}
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	var communities []model.Community
	err := query.Offset(p.Offset).Limit(p.Limit).Find(&communities).Error
	return communities, total, err
}

// Create 创建小区
func (r *CommunityRepository) Create(ctx context.Context, c *model.Community) error {
	return r.db.WithContext(ctx).Create(c).Error
}

// Update 更新小区
func (r *CommunityRepository) Update(ctx context.Context, c *model.Community) error {
	return r.db.WithContext(ctx).Save(c).Error
}

// Delete 删除小区
func (r *CommunityRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Delete(&model.Community{}, id).Error
}