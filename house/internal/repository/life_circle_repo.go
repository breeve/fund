package repository

import (
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

// FindAll 获取所有生活圈
func (r *LifeCircleRepository) FindAll() ([]model.LifeCircle, error) {
	var lifeCircles []model.LifeCircle
	err := r.db.Find(&lifeCircles).Error
	return lifeCircles, err
}

// FindByID 根据ID获取
func (r *LifeCircleRepository) FindByID(id int64) (*model.LifeCircle, error) {
	var lc model.LifeCircle
	err := r.db.First(&lc, id).Error
	if err != nil {
		return nil, err
	}
	return &lc, nil
}

// FindByBlockID 获取指定板块下的生活圈
func (r *LifeCircleRepository) FindByBlockID(blockID int64) ([]model.LifeCircle, error) {
	var lifeCircles []model.LifeCircle
	err := r.db.Where("block_id = ?", blockID).Find(&lifeCircles).Error
	return lifeCircles, err
}

// Create 创建生活圈
func (r *LifeCircleRepository) Create(lc *model.LifeCircle) error {
	return r.db.Create(lc).Error
}

// Update 更新生活圈
func (r *LifeCircleRepository) Update(lc *model.LifeCircle) error {
	return r.db.Save(lc).Error
}

// Delete 删除生活圈
func (r *LifeCircleRepository) Delete(id int64) error {
	return r.db.Delete(&model.LifeCircle{}, id).Error
}
