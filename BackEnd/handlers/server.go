package handlers

import (
	"context"
	"database/sql"
	"net/http"

	"github.com/gorilla/mux"
)

// Server represents the API server
type Server struct {
	db *sql.DB
}

// Context keys
type contextKey string

const userIDKey contextKey = "userID"

// NewServer creates a new server instance
func NewServer(db *sql.DB) *Server {
	return &Server{db: db}
}

// RegisterRoutes registers all API routes
func (s *Server) RegisterRoutes(r *mux.Router) {
	// Authentication routes
	r.HandleFunc("/api/auth/register", s.handleRegister).Methods("POST")
	r.HandleFunc("/api/auth/login", s.handleLogin).Methods("POST")

	// User routes (protected)
	userRouter := r.PathPrefix("/api/user").Subrouter()
	userRouter.Use(s.authMiddleware)
	userRouter.HandleFunc("/profile", s.handleGetProfile).Methods("GET")
	userRouter.HandleFunc("/profile", s.handleUpdateProfile).Methods("PUT")

	// Code execution routes
	r.HandleFunc("/api/code/run", s.handleRunCode).Methods("POST")
	r.HandleFunc("/api/code/submit", s.handleRunCode).Methods("POST") // Reuse the same handler with different mode

	// Submission routes
	r.HandleFunc("/api/submissions", s.handleGetSubmissions).Methods("GET")

	// Problem routes (already registered by ProblemHandler)
	// Additional problem routes
	r.HandleFunc("/api/problems/{id}/testcases", s.handleGetTestCases).Methods("GET")
}

// authMiddleware verifies the user's authentication token
func (s *Server) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// For now, just pass a dummy user ID
		// In a real implementation, this would verify a JWT token
		ctx := r.Context()
		ctx = context.WithValue(ctx, userIDKey, "user123")
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// Placeholder handlers for routes not yet implemented
func (s *Server) handleRegister(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement user registration
	w.WriteHeader(http.StatusNotImplemented)
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement user login
	w.WriteHeader(http.StatusNotImplemented)
}

func (s *Server) handleGetProfile(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement get user profile
	w.WriteHeader(http.StatusNotImplemented)
}

func (s *Server) handleUpdateProfile(w http.ResponseWriter, r *http.Request) {
	// TODO: Implement update user profile
	w.WriteHeader(http.StatusNotImplemented)
}
