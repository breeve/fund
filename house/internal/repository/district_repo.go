package repository

import (
	"house/internal/model"

	"gorm.io/gorm"
)

// DistrictRepository 行政区仓储
type DistrictRepository struct {
	db *gorm.DB
}

// NewDistrictRepository 创建行政区仓储
func NewDistrictRepository(db *gorm.DB) *DistrictRepository {
	return &DistrictRepository{db: db}
}

// FindAll 获取所有行政区
func (r *DistrictRepository) FindAll() ([]model.District, error) {
	var districts []model.District
	err := r.db.Find(&districts).Error
	return districts, err
}

// FindByID 根据ID获取
func (r *DistrictRepository) FindByID(id int64) (*model.District, error) {
	var district model.District
	err := r.db.First(&district, id).Error
	if err != nil {
		return nil, err
	}
	return &district, nil
}

// FindByCode 根据代码获取
func (r *DistrictRepository) FindByCode(code string) (*model.District, error) {
	var district model.District
	err := r.db.Where("code = ?", code).First(&district).Error
	if err != nil {
		return nil, err
	}
	return &district, nil
}

// Create 创建行政区
func (r *DistrictRepository) Create(d *model.District) error {
	return r.db.Create(d).Error
}

// Update 更新行政区
func (r *DistrictRepository) Update(d *model.District) error {
	return r.db.Save(d).Error
}

// Delete 删除行政区
func (r *DistrictRepository) Delete(id int64) error {
	return r.db.Delete(&model.District{}, id).Error
}
