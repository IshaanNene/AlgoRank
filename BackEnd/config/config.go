package config

import (
	"os"
	"strconv"
)

// Config holds application configuration
type Config struct {
	Port            string
	DatabaseURL     string
	JWTSecret       string
	CodeExecTimeout int
	MaxMemoryLimit  int64
}

// Load loads configuration from environment variables
func Load() Config {
	return Config{
		Port:            getEnv("PORT", "8080"),
		DatabaseURL:     getEnv("DATABASE_URL", "postgres://algorank:algorank123@localhost:5432/algorank?sslmode=disable"),
		JWTSecret:       getEnv("JWT_SECRET", "your-secret-key"),
		CodeExecTimeout: getEnvIntOrDefault("CODE_EXEC_TIMEOUT", 10),
		MaxMemoryLimit:  int64(getEnvIntOrDefault("MAX_MEMORY_LIMIT", 536870912)), // 512MB default
	}
}

// Helper function to get environment variable with fallback
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func getEnvIntOrDefault(key string, defaultVal int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultVal
}
