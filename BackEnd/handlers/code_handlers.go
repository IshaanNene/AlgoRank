package handlers

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/yourusername/algorank/models"
)

type CodeHandler struct {
	db          *sql.DB
	executorURL string
}

func NewCodeHandler(db *sql.DB, executorURL string) *CodeHandler {
	return &CodeHandler{
		db:          db,
		executorURL: executorURL,
	}
}

func (h *CodeHandler) RunCode(w http.ResponseWriter, r *http.Request) {
	var submission models.Submission
	if err := json.NewDecoder(r.Body).Decode(&submission); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Forward to executor service
	executorResp, err := h.forwardToExecutor(submission, "/execute")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(executorResp)
}

func (h *CodeHandler) SubmitCode(w http.ResponseWriter, r *http.Request) {
	var submission models.Submission
	if err := json.NewDecoder(r.Body).Decode(&submission); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Forward to executor service
	executorResp, err := h.forwardToExecutor(submission, "/submit")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Save submission to database
	if err := submission.Save(h.db); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(executorResp)
}

func (h *CodeHandler) forwardToExecutor(submission models.Submission, endpoint string) (map[string]interface{}, error) {
	jsonData, err := json.Marshal(submission)
	if err != nil {
		return nil, err
	}

	resp, err := http.Post(h.executorURL+endpoint, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return result, nil
}
