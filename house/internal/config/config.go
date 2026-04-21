package config

import (
	"os"
)

// Config 应用配置
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Gaode    GaodeConfig // 高德API配置
}

// ServerConfig HTTP服务配置
type ServerConfig struct {
	Port string
}

// DatabaseConfig 数据库配置
type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// GaodeConfig 高德开放平台配置
type GaodeConfig struct {
	Key    string // API Key
	Secret string // 密钥（用于签名校验）
}

// Load 加载配置
func Load() (*Config, error) {
	cfg := &Config{
		Server: ServerConfig{
			Port: getEnv("SERVER_PORT", "8080"),
		},
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "postgres"),
			DBName:   getEnv("DB_NAME", "house"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Gaode: GaodeConfig{
			Key:    getEnv("GAODE_KEY", ""),
			Secret: getEnv("GAODE_SECRET", ""),
		},
	}
	return cfg, nil
}

func getEnv(key, defaultValue string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return defaultValue
}
