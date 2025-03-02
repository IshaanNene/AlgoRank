package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
)

// registerAuthRoutes registers authentication routes
func registerAuthRoutes(router *mux.Router, db *sql.DB) {
	router.HandleFunc("/auth/register", handleRegister(db)).Methods("POST")
	router.HandleFunc("/auth/login", handleLogin(db)).Methods("POST")
}

// handleRegister handles user registration
func handleRegister(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req RegisterRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			RespondWithError(w, http.StatusBadRequest, "Invalid request body")
			return
		}

		// Validate request
		if req.Email == "" || req.Username == "" || req.Password == "" {
			RespondWithError(w, http.StatusBadRequest, "Email, username, and password are required")
			return
		}

		// Check if username already exists
		var count int
		err := db.QueryRow("SELECT COUNT(*) FROM users WHERE username = $1", req.Username).Scan(&count)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Database error")
			return
		}
		if count > 0 {
			RespondWithError(w, http.StatusConflict, "Username already exists")
			return
		}

		// Check if email already exists
		err = db.QueryRow("SELECT COUNT(*) FROM users WHERE email = $1", req.Email).Scan(&count)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Database error")
			return
		}
		if count > 0 {
			RespondWithError(w, http.StatusConflict, "Email already exists")
			return
		}

		// Hash password
		passwordHash, err := HashPassword(req.Password)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to hash password")
			return
		}

		// Insert user
		var userID string
		err = db.QueryRow(`
			INSERT INTO users (email, username, password_hash)
			VALUES ($1, $2, $3)
			RETURNING id
		`, req.Email, req.Username, passwordHash).Scan(&userID)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to create user")
			return
		}

		// Generate JWT
		token, err := GenerateJWT(userID)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to generate token")
			return
		}

		// Get user
		var user User
		err = db.QueryRow(`
			SELECT id, email, username, created_at
			FROM users
			WHERE id = $1
		`, userID).Scan(&user.ID, &user.Email, &user.Username, &user.CreatedAt)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to get user")
			return
		}

		// Return token and user
		RespondWithJSON(w, http.StatusCreated, TokenResponse{
			Token: token,
			User:  user,
		})
	}
}

// handleLogin handles user login
func handleLogin(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			RespondWithError(w, http.StatusBadRequest, "Invalid request body")
			return
		}

		// Validate request
		if req.Username == "" || req.Password == "" {
			RespondWithError(w, http.StatusBadRequest, "Username and password are required")
			return
		}

		// Get user
		var user User
		var passwordHash string
		err := db.QueryRow(`
			SELECT id, email, username, password_hash, created_at
			FROM users
			WHERE username = $1
		`, req.Username).Scan(&user.ID, &user.Email, &user.Username, &passwordHash, &user.CreatedAt)
		if err == sql.ErrNoRows {
			RespondWithError(w, http.StatusUnauthorized, "Invalid username or password")
			return
		} else if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Database error")
			return
		}

		// Check password
		if !CheckPasswordHash(req.Password, passwordHash) {
			RespondWithError(w, http.StatusUnauthorized, "Invalid username or password")
			return
		}

		// Generate JWT
		token, err := GenerateJWT(user.ID)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to generate token")
			return
		}

		// Return token and user
		RespondWithJSON(w, http.StatusOK, TokenResponse{
			Token: token,
			User:  user,
		})
	}
}

// authMiddleware verifies the user's authentication token
func authMiddleware(db *sql.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get token from Authorization header
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				RespondWithError(w, http.StatusUnauthorized, "Authorization header is required")
				return
			}

			// Check if the header has the Bearer prefix
			if !strings.HasPrefix(authHeader, "Bearer ") {
				RespondWithError(w, http.StatusUnauthorized, "Invalid authorization format")
				return
			}

			// Extract the token
			tokenString := strings.TrimPrefix(authHeader, "Bearer ")

			// Validate token
			claims, err := ValidateJWT(tokenString)
			if err != nil {
				RespondWithError(w, http.StatusUnauthorized, "Invalid token")
				return
			}

			// Check if user exists
			var count int
			err = db.QueryRow("SELECT COUNT(*) FROM users WHERE id = $1", claims.UserID).Scan(&count)
			if err != nil {
				RespondWithError(w, http.StatusInternalServerError, "Database error")
				return
			}
			if count == 0 {
				RespondWithError(w, http.StatusUnauthorized, "User not found")
				return
			}

			// Add user ID to context
			ctx := context.WithValue(r.Context(), "userID", claims.UserID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
