package repository

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Pagination 分页参数
type Pagination struct {
	Offset int
	Limit  int
}

// ParsePagination 从 Gin query 参数解析分页
func ParsePagination(c *gin.Context) (Pagination, int) {
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "50"))
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 50
	}
	if limit > 200 {
		limit = 200
	}
	return Pagination{
		Offset: (page - 1) * limit,
		Limit:  limit,
	}, page
}

// PaginatedResponse 统一分页响应结构
type PaginatedResponse[T any] struct {
	Data       []T    `json:"data"`
	Total      int64  `json:"total"`
	Page       int    `json:"page"`
	Limit      int    `json:"limit"`
	TotalPages int    `json:"total_pages"`
}

// WritePaginated 写入分页响应到 gin context
func WritePaginated[T any](c *gin.Context, data []T, total int64, p Pagination, pageNum int) {
	pages := int(total) / p.Limit
	if int(total)%p.Limit != 0 {
		pages++
	}
	c.JSON(http.StatusOK, PaginatedResponse[T]{
		Data:       data,
		Total:      total,
		Page:       pageNum,
		Limit:      p.Limit,
		TotalPages: pages,
	})
}