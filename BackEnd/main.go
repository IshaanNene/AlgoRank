package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file, using default environment variables")
	}

	// Initialize DB
	db, err := InitDB()
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer db.Close()

	// Create router
	r := mux.NewRouter()

	// Initialize handlers
	ph := NewProblemHandler(db)
	ch := NewCodeHandler(db)
	ah := NewAuthHandler(db)

	// Routes
	r.HandleFunc("/api/problems", ph.GetProblems).Methods("GET")
	r.HandleFunc("/api/problems/{id}", ph.GetProblem).Methods("GET")
	r.HandleFunc("/api/problems/{id}/run", ch.RunCode).Methods("POST")
	r.HandleFunc("/api/problems/{id}/submit", ch.SubmitCode).Methods("POST")

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:80"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"Content-Type", "Authorization"},
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("Server starting on port", port)
	log.Fatal(http.ListenAndServe(":"+port, c.Handler(r)))
}
