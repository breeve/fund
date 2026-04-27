package repository

import (
	"context"

	"house/internal/model"

	"gorm.io/gorm"
)

// BlockRepository 板块仓储
type BlockRepository struct {
	db *gorm.DB
}

// NewBlockRepository 创建板块仓储
func NewBlockRepository(db *gorm.DB) *BlockRepository {
	return &BlockRepository{db: db}
}

// FindAll 获取所有板块（分页）
func (r *BlockRepository) FindAll(ctx context.Context, p Pagination) ([]model.Block, int64, error) {
	var blocks []model.Block
	var total int64
	if err := r.db.WithContext(ctx).Model(&model.Block{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := r.db.WithContext(ctx).Offset(p.Offset).Limit(p.Limit).Find(&blocks).Error
	return blocks, total, err
}

// FindByID 根据ID获取
func (r *BlockRepository) FindByID(ctx context.Context, id int64) (*model.Block, error) {
	var block model.Block
	err := r.db.WithContext(ctx).First(&block, id).Error
	if err != nil {
		return nil, err
	}
	return &block, nil
}

// FindByDistrictID 获取指定行政区下的板块
func (r *BlockRepository) FindByDistrictID(ctx context.Context, districtID int64, p Pagination) ([]model.Block, int64, error) {
	var blocks []model.Block
	query := r.db.WithContext(ctx).Model(&model.Block{}).Where("district_id = ?", districtID)
	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := query.Offset(p.Offset).Limit(p.Limit).Find(&blocks).Error
	return blocks, total, err
}

// Create 创建板块
func (r *BlockRepository) Create(ctx context.Context, b *model.Block) error {
	return r.db.WithContext(ctx).Create(b).Error
}

// Update 更新板块
func (r *BlockRepository) Update(ctx context.Context, b *model.Block) error {
	return r.db.WithContext(ctx).Save(b).Error
}

// Delete 删除板块
func (r *BlockRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Delete(&model.Block{}, id).Error
}