package handler

import (
	"net/http"
	"strconv"

	"house/internal/model"
	"house/internal/service"

	"github.com/gin-gonic/gin"
)

// HouseHandler 房产HTTP处理
type HouseHandler struct {
	svc *service.HouseService
}

// NewHouseHandler 创建房产处理器
func NewHouseHandler(svc *service.HouseService) *HouseHandler {
	return &HouseHandler{svc: svc}
}

// RegisterRoutes 注册路由
func (h *HouseHandler) RegisterRoutes(r *gin.Engine) {
	// 行政区
	r.GET("/districts", h.ListDistricts)
	r.GET("/districts/:id", h.GetDistrict)
	r.POST("/districts", h.CreateDistrict)
	r.PUT("/districts/:id", h.UpdateDistrict)

	// 板块
	r.GET("/blocks", h.ListBlocks)
	r.GET("/blocks/:id", h.GetBlock)
	r.POST("/blocks", h.CreateBlock)
	r.PUT("/blocks/:id", h.UpdateBlock)

	// 生活圈
	r.GET("/life-circles", h.ListLifeCircles)
	r.GET("/life-circles/:id", h.GetLifeCircle)
	r.POST("/life-circles", h.CreateLifeCircle)
	r.PUT("/life-circles/:id", h.UpdateLifeCircle)

	// 小区
	r.GET("/communities", h.ListCommunities)
	r.GET("/communities/:id", h.GetCommunity)
	r.POST("/communities", h.CreateCommunity)
	r.PUT("/communities/:id", h.UpdateCommunity)
}

// 行政区处理函数

func (h *HouseHandler) ListDistricts(c *gin.Context) {
	districts, err := h.svc.ListDistricts()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": districts})
}

func (h *HouseHandler) GetDistrict(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	district, err := h.svc.GetDistrict(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": district})
}

func (h *HouseHandler) CreateDistrict(c *gin.Context) {
	var district model.District
	if err := c.ShouldBindJSON(&district); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.CreateDistrict(&district); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": district})
}

func (h *HouseHandler) UpdateDistrict(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var district model.District
	if err := c.ShouldBindJSON(&district); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	district.ID = id
	if err := h.svc.UpdateDistrict(&district); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": district})
}

// 板块处理函数

func (h *HouseHandler) ListBlocks(c *gin.Context) {
	// 支持按 district_id 过滤
	if districtIDStr := c.Query("district_id"); districtIDStr != "" {
		districtID, _ := strconv.ParseInt(districtIDStr, 10, 64)
		blocks, err := h.svc.ListBlocksByDistrict(districtID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": blocks})
		return
	}
	blocks, err := h.svc.ListBlocks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": blocks})
}

func (h *HouseHandler) GetBlock(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	block, err := h.svc.GetBlock(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": block})
}

func (h *HouseHandler) CreateBlock(c *gin.Context) {
	var block model.Block
	if err := c.ShouldBindJSON(&block); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.CreateBlock(&block); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": block})
}

func (h *HouseHandler) UpdateBlock(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var block model.Block
	if err := c.ShouldBindJSON(&block); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	block.ID = id
	if err := h.svc.UpdateBlock(&block); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": block})
}

// 生活圈处理函数

func (h *HouseHandler) ListLifeCircles(c *gin.Context) {
	// 支持按 block_id 过滤
	if blockIDStr := c.Query("block_id"); blockIDStr != "" {
		blockID, _ := strconv.ParseInt(blockIDStr, 10, 64)
		lifeCircles, err := h.svc.ListLifeCirclesByBlock(blockID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": lifeCircles})
		return
	}
	lifeCircles, err := h.svc.ListLifeCircles()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lifeCircles})
}

func (h *HouseHandler) GetLifeCircle(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	lc, err := h.svc.GetLifeCircle(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lc})
}

func (h *HouseHandler) CreateLifeCircle(c *gin.Context) {
	var lc model.LifeCircle
	if err := c.ShouldBindJSON(&lc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.CreateLifeCircle(&lc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": lc})
}

func (h *HouseHandler) UpdateLifeCircle(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var lc model.LifeCircle
	if err := c.ShouldBindJSON(&lc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	lc.ID = id
	if err := h.svc.UpdateLifeCircle(&lc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": lc})
}

// 小区处理函数

func (h *HouseHandler) ListCommunities(c *gin.Context) {
	// 支持按 block_id 和 life_circle_id 过滤
	if blockIDStr := c.Query("block_id"); blockIDStr != "" {
		blockID, _ := strconv.ParseInt(blockIDStr, 10, 64)
		communities, err := h.svc.ListCommunitiesByBlock(blockID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": communities})
		return
	}
	if lifeCircleIDStr := c.Query("life_circle_id"); lifeCircleIDStr != "" {
		lifeCircleID, _ := strconv.ParseInt(lifeCircleIDStr, 10, 64)
		communities, err := h.svc.ListCommunitiesByLifeCircle(lifeCircleID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": communities})
		return
	}
	communities, err := h.svc.ListCommunities()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": communities})
}

func (h *HouseHandler) GetCommunity(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	community, err := h.svc.GetCommunity(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": community})
}

func (h *HouseHandler) CreateCommunity(c *gin.Context) {
	var community model.Community
	if err := c.ShouldBindJSON(&community); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.svc.CreateCommunity(&community); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"data": community})
}

func (h *HouseHandler) UpdateCommunity(c *gin.Context) {
	id, _ := strconv.ParseInt(c.Param("id"), 10, 64)
	var community model.Community
	if err := c.ShouldBindJSON(&community); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	community.ID = id
	if err := h.svc.UpdateCommunity(&community); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": community})
}
