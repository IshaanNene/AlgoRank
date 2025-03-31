package main

import (
	"log"
	"net/http"
	"os"

	"github.com/IshaanNene/AlgoRank/db"
	"github.com/IshaanNene/AlgoRank/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Initialize database connection
	database, err := db.Connect()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Create router
	router := mux.NewRouter()

	// Initialize handlers
	problemHandler := handlers.NewProblemHandler(database)
	problemHandler.RegisterRoutes(router)

	// Create server
	server := handlers.NewServer(database)
	server.RegisterRoutes(router)

	// Configure CORS
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, corsMiddleware.Handler(router)))
}
