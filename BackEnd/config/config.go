package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port            string
	DatabaseURL     string
	JWTSecret       string
	CodeExecTimeout int
	MaxMemoryLimit  int64
}

func LoadConfig() *Config {
	return &Config{
		Port:            getEnvOrDefault("PORT", "8080"),
		DatabaseURL:     getEnvOrDefault("DATABASE_URL", "postgres://algorank:algorank123@localhost:5432/algorank?sslmode=disable"),
		JWTSecret:       getEnvOrDefault("JWT_SECRET", "your-secret-key-here"),
		CodeExecTimeout: getEnvIntOrDefault("CODE_EXEC_TIMEOUT", 10),
		MaxMemoryLimit:  int64(getEnvIntOrDefault("MAX_MEMORY_LIMIT", 536870912)), // 512MB default
	}
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvIntOrDefault(key string, defaultVal int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultVal
}
