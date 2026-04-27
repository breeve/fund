package repository

import (
	"context"

	"house/internal/model"
)

// DistrictRepo 行政区仓储接口
type DistrictRepo interface {
	FindAll(ctx context.Context, p Pagination) ([]model.District, int64, error)
	FindByID(ctx context.Context, id int64) (*model.District, error)
	FindByCode(ctx context.Context, code string) (*model.District, error)
	Create(ctx context.Context, d *model.District) error
	Update(ctx context.Context, d *model.District) error
	Delete(ctx context.Context, id int64) error
}

// BlockRepo 板块仓储接口
type BlockRepo interface {
	FindAll(ctx context.Context, p Pagination) ([]model.Block, int64, error)
	FindByID(ctx context.Context, id int64) (*model.Block, error)
	FindByDistrictID(ctx context.Context, districtID int64, p Pagination) ([]model.Block, int64, error)
	Create(ctx context.Context, b *model.Block) error
	Update(ctx context.Context, b *model.Block) error
	Delete(ctx context.Context, id int64) error
}

// LifeCircleRepo 生活圈仓储接口
type LifeCircleRepo interface {
	FindAll(ctx context.Context, p Pagination) ([]model.LifeCircle, int64, error)
	FindByID(ctx context.Context, id int64) (*model.LifeCircle, error)
	FindByBlockID(ctx context.Context, blockID int64, p Pagination) ([]model.LifeCircle, int64, error)
	Create(ctx context.Context, lc *model.LifeCircle) error
	Update(ctx context.Context, lc *model.LifeCircle) error
	Delete(ctx context.Context, id int64) error
}

// CommunityRepo 小区仓储接口
type CommunityRepo interface {
	FindAll(ctx context.Context, p Pagination) ([]model.Community, int64, error)
	FindByID(ctx context.Context, id int64) (*model.Community, error)
	FindByBlockID(ctx context.Context, blockID int64, p Pagination) ([]model.Community, int64, error)
	FindByLifeCircleID(ctx context.Context, lifeCircleID int64, p Pagination) ([]model.Community, int64, error)
	FindAllWithFilters(ctx context.Context, p Pagination, priceMin, priceMax *float64, blockID, lifeCircleID *int64) ([]model.Community, int64, error)
	Create(ctx context.Context, c *model.Community) error
	Update(ctx context.Context, c *model.Community) error
	Delete(ctx context.Context, id int64) error
}