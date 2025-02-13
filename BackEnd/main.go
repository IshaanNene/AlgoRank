package main

import (
	"log"
	"net/http"

	_ "github.com/lib/pq"
	"github.com/rs/cors"

	"github.com/IshaanNene/AlgoRank/config"
	"github.com/IshaanNene/AlgoRank/db"
	"github.com/IshaanNene/AlgoRank/handlers"
)

func main() {
	// Initialize config
	cfg := config.Load()

	// Initialize database
	database, err := db.Initialize(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Could not initialize database:", err)
	}
	defer database.Close()

	// Initialize server
	server := handlers.NewServer(database, cfg.JWTSecret)

	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Start server
	handler := c.Handler(server.Router)
	log.Printf("Starting server on port %s", cfg.Port)
	log.Fatal(http.ListenAndServe(":"+cfg.Port, handler))
}
