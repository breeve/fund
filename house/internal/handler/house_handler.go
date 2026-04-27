package handler

import (
	"net/http"
	"strconv"

	"house/internal/model"
	"house/internal/repository"
	"house/internal/service"

	"github.com/gin-gonic/gin"
)

// HouseHandler 房产HTTP处理
type HouseHandler struct {
	svc service.HouseServiceInterface
}

// NewHouseHandler 创建房产处理器
func NewHouseHandler(svc service.HouseServiceInterface) *HouseHandler {
	return &HouseHandler{svc: svc}
}

// RegisterRoutes 注册路由
func (h *HouseHandler) RegisterRoutes(r *gin.Engine) {
	// 行政区
	r.GET("/districts", h.ListDistricts)
	r.GET("/districts/:id", h.GetDistrict)
	r.POST("/districts", h.CreateDistrict)
	r.PUT("/districts/:id", h.UpdateDistrict)
	r.DELETE("/districts/:id", h.DeleteDistrict)

	// 板块
	r.GET("/blocks", h.ListBlocks)
	r.GET("/blocks/:id", h.GetBlock)
	r.POST("/blocks", h.CreateBlock)
	r.PUT("/blocks/:id", h.UpdateBlock)
	r.DELETE("/blocks/:id", h.DeleteBlock)

	// 生活圈
	r.GET("/life-circles", h.ListLifeCircles)
	r.GET("/life-circles/:id", h.GetLifeCircle)
	r.POST("/life-circles", h.CreateLifeCircle)
	r.PUT("/life-circles/:id", h.UpdateLifeCircle)
	r.DELETE("/life-circles/:id", h.DeleteLifeCircle)

	// 小区
	r.GET("/communities", h.ListCommunities)
	r.GET("/communities/:id", h.GetCommunity)
	r.POST("/communities", h.CreateCommunity)
	r.PUT("/communities/:id", h.UpdateCommunity)
	r.DELETE("/communities/:id", h.DeleteCommunity)
}

// 行政区处理函数

func (h *HouseHandler) ListDistricts(c *gin.Context) {
	ctx := c.Request.Context()
	p, page := repository.ParsePagination(c)
	districts, total, err := h.svc.ListDistricts(ctx, p)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	repository.WritePaginated(c, districts, total, p, page)
}

func (h *HouseHandler) GetDistrict(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	district, err := h.svc.GetDistrict(ctx, id)
	if err != nil || district == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": district})
}

func (h *HouseHandler) CreateDistrict(c *gin.Context) {
	ctx := c.Request.Context()
	var district model.District
	if err := c.ShouldBindJSON(&district); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.CreateDistrict(ctx, &district); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": district})
}

func (h *HouseHandler) UpdateDistrict(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var district model.District
	if err := c.ShouldBindJSON(&district); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	district.ID = id
	if err := h.svc.UpdateDistrict(ctx, &district); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": district})
}

func (h *HouseHandler) DeleteDistrict(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	if err := h.svc.DeleteDistrict(ctx, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": "deleted"})
}

// 板块处理函数

func (h *HouseHandler) ListBlocks(c *gin.Context) {
	ctx := c.Request.Context()
	p, page := repository.ParsePagination(c)
	var blocks []model.Block
	var total int64
	var err error

	if districtIDStr := c.Query("district_id"); districtIDStr != "" {
		districtID, _ := strconv.ParseInt(districtIDStr, 10, 64)
		blocks, total, err = h.svc.ListBlocksByDistrict(ctx, districtID, p)
	} else {
		blocks, total, err = h.svc.ListBlocks(ctx, p)
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	repository.WritePaginated(c, blocks, total, p, page)
}

func (h *HouseHandler) GetBlock(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	block, err := h.svc.GetBlock(ctx, id)
	if err != nil || block == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": block})
}

func (h *HouseHandler) CreateBlock(c *gin.Context) {
	ctx := c.Request.Context()
	var block model.Block
	if err := c.ShouldBindJSON(&block); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.CreateBlock(ctx, &block); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": block})
}

func (h *HouseHandler) UpdateBlock(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var block model.Block
	if err := c.ShouldBindJSON(&block); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	block.ID = id
	if err := h.svc.UpdateBlock(ctx, &block); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": block})
}

func (h *HouseHandler) DeleteBlock(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	if err := h.svc.DeleteBlock(ctx, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": "deleted"})
}

// 生活圈处理函数

func (h *HouseHandler) ListLifeCircles(c *gin.Context) {
	ctx := c.Request.Context()
	p, page := repository.ParsePagination(c)
	var lifeCircles []model.LifeCircle
	var total int64
	var err error

	if blockIDStr := c.Query("block_id"); blockIDStr != "" {
		blockID, _ := strconv.ParseInt(blockIDStr, 10, 64)
		lifeCircles, total, err = h.svc.ListLifeCirclesByBlock(ctx, blockID, p)
	} else {
		lifeCircles, total, err = h.svc.ListLifeCircles(ctx, p)
	}
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	repository.WritePaginated(c, lifeCircles, total, p, page)
}

func (h *HouseHandler) GetLifeCircle(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	lc, err := h.svc.GetLifeCircle(ctx, id)
	if err != nil || lc == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lc})
}

func (h *HouseHandler) CreateLifeCircle(c *gin.Context) {
	ctx := c.Request.Context()
	var lc model.LifeCircle
	if err := c.ShouldBindJSON(&lc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.CreateLifeCircle(ctx, &lc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": lc})
}

func (h *HouseHandler) UpdateLifeCircle(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var lc model.LifeCircle
	if err := c.ShouldBindJSON(&lc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	lc.ID = id
	if err := h.svc.UpdateLifeCircle(ctx, &lc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lc})
}

func (h *HouseHandler) DeleteLifeCircle(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	if err := h.svc.DeleteLifeCircle(ctx, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": "deleted"})
}

// 小区处理函数

func (h *HouseHandler) ListCommunities(c *gin.Context) {
	ctx := c.Request.Context()
	p, page := repository.ParsePagination(c)

	// 解析价格区间筛选参数
	var priceMin, priceMax *float64
	if pm := c.Query("price_min"); pm != "" {
		if v, err := strconv.ParseFloat(pm, 64); err == nil {
			priceMin = &v
		}
	}
	if pmax := c.Query("price_max"); pmax != "" {
		if v, err := strconv.ParseFloat(pmax, 64); err == nil {
			priceMax = &v
		}
	}

	// 解析 block_id / life_circle_id
	var blockID, lifeCircleID *int64
	if bStr := c.Query("block_id"); bStr != "" {
		if v, err := strconv.ParseInt(bStr, 10, 64); err == nil {
			blockID = &v
		}
	}
	if lcStr := c.Query("life_circle_id"); lcStr != "" {
		if v, err := strconv.ParseInt(lcStr, 10, 64); err == nil {
			lifeCircleID = &v
		}
	}

	communities, total, err := h.svc.ListCommunities(ctx, p, priceMin, priceMax, blockID, lifeCircleID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	repository.WritePaginated(c, communities, total, p, page)
}

func (h *HouseHandler) GetCommunity(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	community, err := h.svc.GetCommunity(ctx, id)
	if err != nil || community == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": community})
}

func (h *HouseHandler) CreateCommunity(c *gin.Context) {
	ctx := c.Request.Context()
	var community model.Community
	if err := c.ShouldBindJSON(&community); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.CreateCommunity(ctx, &community); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": community})
}

func (h *HouseHandler) UpdateCommunity(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var community model.Community
	if err := c.ShouldBindJSON(&community); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	community.ID = id
	if err := h.svc.UpdateCommunity(ctx, &community); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": community})
}

func (h *HouseHandler) DeleteCommunity(c *gin.Context) {
	ctx := c.Request.Context()
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	if err := h.svc.DeleteCommunity(ctx, id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": "deleted"})
}