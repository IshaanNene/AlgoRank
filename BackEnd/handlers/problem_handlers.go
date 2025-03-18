package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/yourusername/algorank/models"
)

type ProblemHandler struct {
	db *sql.DB
}

func NewProblemHandler(db *sql.DB) *ProblemHandler {
	return &ProblemHandler{db: db}
}

func (h *ProblemHandler) GetProblems(w http.ResponseWriter, r *http.Request) {
	problems, err := models.GetAllProblems(h.db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(problems)
}

func (h *ProblemHandler) GetProblem(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid problem ID", http.StatusBadRequest)
		return
	}

	problem, err := models.GetProblemByID(h.db, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(problem)
}
