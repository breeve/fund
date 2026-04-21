package main

import (
	"fmt"
	"log"

	"house/internal/config"
	"house/internal/handler"
	"house/internal/model"
	"house/internal/repository"
	"house/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 加载配置
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	// 连接数据库
	dsn := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.DBName,
		cfg.Database.SSLMode,
	)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// 自动迁移
	if err := db.AutoMigrate(
		&model.District{},
		&model.Block{},
		&model.LifeCircle{},
		&model.Community{},
	); err != nil {
		log.Fatalf("failed to migrate: %v", err)
	}

	// 初始化仓储
	districtRepo := repository.NewDistrictRepository(db)
	blockRepo := repository.NewBlockRepository(db)
	lifeCircleRepo := repository.NewLifeCircleRepository(db)
	communityRepo := repository.NewCommunityRepository(db)

	// 初始化服务
	houseSvc := service.NewHouseService(districtRepo, blockRepo, lifeCircleRepo, communityRepo)

	// 初始化处理器
	houseHandler := handler.NewHouseHandler(houseSvc)

	// 启动HTTP服务
	r := gin.Default()
	houseHandler.RegisterRoutes(r)

	log.Printf("Server starting on port %s", cfg.Server.Port)
	if err := r.Run(":" + cfg.Server.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
