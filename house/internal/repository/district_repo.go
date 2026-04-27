package repository

import (
	"context"

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

// FindAll 获取所有行政区（分页）
func (r *DistrictRepository) FindAll(ctx context.Context, p Pagination) ([]model.District, int64, error) {
	var districts []model.District
	var total int64
	if err := r.db.WithContext(ctx).Model(&model.District{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := r.db.WithContext(ctx).Offset(p.Offset).Limit(p.Limit).Find(&districts).Error
	return districts, total, err
}

// FindByID 根据ID获取
func (r *DistrictRepository) FindByID(ctx context.Context, id int64) (*model.District, error) {
	var district model.District
	err := r.db.WithContext(ctx).First(&district, id).Error
	if err != nil {
		return nil, err
	}
	return &district, nil
}

// FindByCode 根据代码获取
func (r *DistrictRepository) FindByCode(ctx context.Context, code string) (*model.District, error) {
	var district model.District
	err := r.db.WithContext(ctx).Where("code = ?", code).First(&district).Error
	if err != nil {
		return nil, err
	}
	return &district, nil
}

// Create 创建行政区
func (r *DistrictRepository) Create(ctx context.Context, d *model.District) error {
	return r.db.WithContext(ctx).Create(d).Error
}

// Update 更新行政区
func (r *DistrictRepository) Update(ctx context.Context, d *model.District) error {
	return r.db.WithContext(ctx).Save(d).Error
}

// Delete 删除行政区
func (r *DistrictRepository) Delete(ctx context.Context, id int64) error {
	return r.db.WithContext(ctx).Delete(&model.District{}, id).Error
}