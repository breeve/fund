package repository

import (
	"context"

	"house/internal/model"

	"gorm.io/gorm"
)

// LifeCircleRepository 生活圈仓储
type LifeCircleRepository struct {
	db *gorm.DB
}

// NewLifeCircleRepository 创建生活圈仓储
func NewLifeCircleRepository(db *gorm.DB) *LifeCircleRepository {
	return &LifeCircleRepository{db: db}
}

// FindAll 获取所有生活圈（分页）
func (r *LifeCircleRepository) FindAll(ctx context.Context, p Pagination) ([]model.LifeCircle, int64, error) {
	var lifeCircles []model.LifeCircle
	var total int64
	if err := r.db.WithContext(ctx).Model(&model.LifeCircle{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := r.db.WithContext(ctx).Offset(p.Offset).Limit(p.Limit).Find(&lifeCircles).Error
	return lifeCircles, total, err
}

// FindByID 根据ID获取
func (r *LifeCircleRepository) FindByID(ctx context.Context, id int64) (*model.LifeCircle, error) {
	var lc model.LifeCircle
	err := r.db.WithContext(ctx).First(&lc, id).Error
	if err != nil {
		return nil, err
	}
	return &lc, nil
}

// FindByBlockID 获取指定板块下的生活圈
func (r *LifeCircleRepository) FindByBlockID(ctx context.Context, blockID int64, p Pagination) ([]model.LifeCircle, int64, error) {
	var lifeCircles []model.LifeCircle
	query := r.db.WithContext(ctx).Model(&model.LifeCircle{}).Where("block_id = ?", blockID)
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := query.Offset(p.Offset).Limit(p.Limit).Find(&lifeCircles).Error
	return lifeCircles, total, err
}

// Create 创建生活圈
func (r *LifeCircleRepository) Create(ctx context.Context, lc *model.LifeCircle) error {
	return r.db.WithContext(ctx).Create(lc).Error
}

// Update 更新生活圈
func (r *LifeCircleRepository) Update(ctx context.Context, lc *model.LifeCircle) error {
	return r.db.WithContext(ctx).Save(lc).Error
}

// Delete 删除生活圈
func (r *LifeCircleRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Delete(&model.LifeCircle{}, id).Error
}