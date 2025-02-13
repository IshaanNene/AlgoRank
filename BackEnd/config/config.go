package config

import (
	"os"
	"strconv"
)

type Config struct {
	DatabaseURL     string
	JWTSecret       string
	Port            string
	CodeExecTimeout int
	MaxMemoryLimit  int64
}

func Load() *Config {
	return &Config{
		DatabaseURL:     getEnv("DATABASE_URL", "postgres://user:password@localhost:5432/algorank?sslmode=disable"),
		JWTSecret:       getEnv("JWT_SECRET", "your-secret-key"),
		Port:            getEnv("PORT", "8080"),
		CodeExecTimeout: getEnvAsInt("CODE_EXEC_TIMEOUT", 10),
		MaxMemoryLimit:  getEnvAsInt64("MAX_MEMORY_LIMIT", 512*1024*1024), // 512MB default
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultVal int) int {
	if val, exists := os.LookupEnv(key); exists {
		if intVal, err := strconv.Atoi(val); err == nil {
			return intVal
		}
	}
	return defaultVal
}

func getEnvAsInt64(key string, defaultVal int64) int64 {
	if val, exists := os.LookupEnv(key); exists {
		if intVal, err := strconv.ParseInt(val, 10, 64); err == nil {
			return intVal
		}
	}
	return defaultVal
}
