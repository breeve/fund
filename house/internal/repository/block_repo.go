package repository

import (
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

// FindAll 获取所有板块
func (r *BlockRepository) FindAll() ([]model.Block, error) {
	var blocks []model.Block
	err := r.db.Find(&blocks).Error
	return blocks, err
}

// FindByID 根据ID获取
func (r *BlockRepository) FindByID(id int64) (*model.Block, error) {
	var block model.Block
	err := r.db.First(&block, id).Error
	if err != nil {
		return nil, err
	}
	return &block, nil
}

// FindByDistrictID 获取指定行政区下的板块
func (r *BlockRepository) FindByDistrictID(districtID int64) ([]model.Block, error) {
	var blocks []model.Block
	err := r.db.Where("district_id = ?", districtID).Find(&blocks).Error
	return blocks, err
}

// Create 创建板块
func (r *BlockRepository) Create(b *model.Block) error {
	return r.db.Create(b).Error
}

// Update 更新板块
func (r *BlockRepository) Update(b *model.Block) error {
	return r.db.Save(b).Error
}

// Delete 删除板块
func (r *BlockRepository) Delete(id int64) error {
	return r.db.Delete(&model.Block{}, id).Error
}
