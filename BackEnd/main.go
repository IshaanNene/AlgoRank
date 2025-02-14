package main

import (
	"log"
	"net/http"

	"github.com/IshaanNene/AlgoRank/config"
	"github.com/IshaanNene/AlgoRank/db"
	"github.com/IshaanNene/AlgoRank/handlers"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)

func main() {
	// Load configuration
	cfg := config.LoadConfig()

	// Initialize database
	database, err := db.Initialize(cfg)
	if err != nil {
		log.Fatal("Could not initialize database:", err)
	}
	defer database.Close()

	// Create server instance
	server := handlers.NewServer(database, cfg.JWTSecret)

	// Setup CORS with more permissive settings for development
	c := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:3000",
			"http://localhost:5173", // Vite dev server
		},
		AllowedMethods: []string{
			"GET", "POST", "PUT", "DELETE", "OPTIONS",
		},
		AllowedHeaders: []string{
			"Content-Type",
			"Authorization",
			"X-Requested-With",
		},
		AllowCredentials: true,
		Debug:            true, // Enable for debugging
	})

	// Wrap router with CORS handler
	handler := c.Handler(server.Router)

	// Start server
	log.Printf("Starting server on port %s", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, handler))
}

func authCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// For now, return a mock response
	w.Write([]byte(`{"user": null}`))
}
