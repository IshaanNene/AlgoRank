package handlers

import (
	"database/sql"

	"github.com/gorilla/mux"
)

type contextKey string

const userIDKey contextKey = "userID"

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
