package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
	"golang.org/x/crypto/bcrypt"
)

type Server struct {
	db        *sql.DB
	Router    *mux.Router
	jwtSecret string
}

func NewServer(db *sql.DB, jwtSecret string) *Server {
	s := &Server{
		db:        db,
		Router:    mux.NewRouter(),
		jwtSecret: jwtSecret,
	}
	s.setupRoutes()
	return s
}

func (s *Server) setupRoutes() {
	api := s.Router.PathPrefix("/api").Subrouter()

	// Auth routes
	auth := api.PathPrefix("/auth").Subrouter()
	auth.HandleFunc("/signup", s.handleSignup).Methods("POST")
	auth.HandleFunc("/login", s.handleLogin).Methods("POST")
	auth.HandleFunc("/logout", s.handleLogout).Methods("POST")
	auth.HandleFunc("/check", s.handleAuthCheck).Methods("GET")

	// Protected routes
	protected := api.PathPrefix("").Subrouter()
	protected.Use(s.authMiddleware)

	// Problems routes
	protected.HandleFunc("/problems", s.handleGetProblems).Methods("GET")
	protected.HandleFunc("/problems/{id}", s.handleGetProblem).Methods("GET")
	protected.HandleFunc("/problems/{id}/testcases", s.handleGetTestCases).Methods("GET")

	// Code execution routes
	protected.HandleFunc("/code/run", s.handleRunCode).Methods("POST")
	protected.HandleFunc("/submissions", s.handleGetSubmissions).Methods("GET")

	// User routes
	protected.HandleFunc("/users/{username}", s.handleGetProfile).Methods("GET")
	protected.HandleFunc("/users/profile", s.handleUpdateProfile).Methods("PUT")
	protected.HandleFunc("/users/stats", s.handleGetStats).Methods("GET")

	// Leaderboard routes
	protected.HandleFunc("/leaderboard", s.handleGetLeaderboard).Methods("GET")
}

type Claims struct {
	UserID string `json:"user_id"`
	jwt.StandardClaims
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type SignupRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Username string `json:"username"`
	Name     string `json:"name"`
}

func (s *Server) handleSignup(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate input
	if req.Email == "" || req.Password == "" || req.Username == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Check if username already exists
	var exists bool
	err := s.db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)", req.Username).Scan(&exists)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	if exists {
		http.Error(w, "Username already exists", http.StatusConflict)
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	// Create user
	var userID string
	err = s.db.QueryRow(
		`INSERT INTO users (email, password_hash, username, name, created_at) 
		VALUES ($1, $2, $3, $4, $5) 
		RETURNING id`,
		req.Email, hashedPassword, req.Username, req.Name, time.Now(),
	).Scan(&userID)

	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	// Generate token
	token, err := s.generateToken(userID)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":       userID,
			"email":    req.Email,
			"username": req.Username,
			"name":     req.Name,
		},
	})
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var user struct {
		ID           string
		PasswordHash string
		Email        string
		Name         string
	}

	err := s.db.QueryRow(
		"SELECT id, password_hash, email, name FROM users WHERE username = $1",
		req.Username,
	).Scan(&user.ID, &user.PasswordHash, &user.Email, &user.Name)

	if err == sql.ErrNoRows {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := s.generateToken(user.ID)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":       user.ID,
			"email":    user.Email,
			"username": req.Username,
			"name":     user.Name,
		},
	})
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	// In a stateless JWT setup, we don't need to do anything server-side
	// The client should remove the token
	w.WriteHeader(http.StatusOK)
}

func (s *Server) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenString = tokenString[7:] // Remove "Bearer " prefix

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(s.jwtSecret), nil
		})
		type contextKey string
		const userIDKey contextKey = "userID"
		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}


		ctx := context.WithValue(r.Context(), userIDKey, claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *Server) generateToken(userID string) (string, error) {
	claims := Claims{
		UserID: userID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(24 * time.Hour).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}
func (s *Server) handleAuthCheck(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)
	type User struct {
		ID                string    `json:"id"`
		Email             string    `json:"email"`
		Username          string    `json:"username"`
		Name              string    `json:"name"`
		PasswordHash      string    `json:"-"`
		Location          string    `json:"location"`
		GitHub            string    `json:"github"`
		Twitter           string    `json:"twitter"`
		Bio               string    `json:"bio"`
		CreatedAt         time.Time `json:"createdAt"`
		ProfileCompletion int       `json:"profileCompletion"`
	}

	var user User
	err := s.db.QueryRow(
		"SELECT id, email, username, name, location, github, twitter, bio, created_at, profile_completion FROM users WHERE id = $1",
		userID,
	).Scan(
		&user.ID, &user.Email, &user.Username, &user.Name, &user.Location,
		&user.GitHub, &user.Twitter, &user.Bio, &user.CreatedAt, &user.ProfileCompletion,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
