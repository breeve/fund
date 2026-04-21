package repository

import (
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

// FindAll 获取所有小区
func (r *CommunityRepository) FindAll() ([]model.Community, error) {
	var communities []model.Community
	err := r.db.Find(&communities).Error
	return communities, err
}

// FindByID 根据ID获取
func (r *CommunityRepository) FindByID(id int64) (*model.Community, error) {
	var c model.Community
	err := r.db.First(&c, id).Error
	if err != nil {
		return nil, err
	}
	return &c, nil
}

// FindByBlockID 获取指定板块下的小区
func (r *CommunityRepository) FindByBlockID(blockID int64) ([]model.Community, error) {
	var communities []model.Community
	err := r.db.Where("block_id = ?", blockID).Find(&communities).Error
	return communities, err
}

// FindByLifeCircleID 获取指定生活圈内的小区
func (r *CommunityRepository) FindByLifeCircleID(lifeCircleID int64) ([]model.Community, error) {
	var communities []model.Community
	err := r.db.Where("life_circle_id = ?", lifeCircleID).Find(&communities).Error
	return communities, err
}

// Create 创建小区
func (r *CommunityRepository) Create(c *model.Community) error {
	return r.db.Create(c).Error
}

// Update 更新小区
func (r *CommunityRepository) Update(c *model.Community) error {
	return r.db.Save(c).Error
}

// Delete 删除小区
func (r *CommunityRepository) Delete(id int64) error {
	return r.db.Delete(&model.Community{}, id).Error
}
