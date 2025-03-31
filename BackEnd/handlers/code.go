package handlers

import (
	"encoding/json"
	"net/http"
	"os/exec"
	"path/filepath"
	"strconv"
	"time"

	"github.com/IshaanNene/AlgoRank/models"
	"github.com/IshaanNene/AlgoRank/utils"
)

type CodeRunRequest struct {
	ProblemID int    `json:"problemId"`
	Code      string `json:"code"`
	Language  string `json:"language"`
	Mode      string `json:"mode"` // "Run" or "Submit"
}

func (s *Server) handleRunCode(w http.ResponseWriter, r *http.Request) {
	var req CodeRunRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Save code to temporary file
	filename := filepath.Join("temp", strconv.Itoa(req.ProblemID), "solution.c")
	if err := utils.SaveCodeToFile(filename, req.Code); err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to save code")
		return
	}

	// Execute Python script
	cmd := exec.Command("python", "main.py", req.Mode, strconv.Itoa(req.ProblemID))
	output, err := cmd.CombinedOutput()
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Code execution failed")
		return
	}

	// Parse execution results
	var results models.ExecutionResult
	if err := json.Unmarshal(output, &results); err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to parse execution results")
		return
	}

	// If this is a submission, save it to the database
	if req.Mode == "Submit" {
		userID := r.Context().Value(userIDKey).(string)
		submission := models.Submission{
			ProblemID: req.ProblemID,
			UserID:    userID,
			Language:  req.Language,
			Code:      req.Code,
			Status:    results.Status,
			Runtime:   results.Runtime,
			Memory:    results.Memory,
			CreatedAt: time.Now(),
		}

		if err := s.saveSubmission(&submission); err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to save submission")
			return
		}

		// Update problem statistics
		if err := s.updateProblemStats(req.ProblemID, results.Status == "Accepted"); err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update problem stats")
			return
		}
	}

	utils.RespondWithJSON(w, http.StatusOK, results)
}

func (s *Server) saveSubmission(submission *models.Submission) error {
	_, err := s.db.Exec(`
		INSERT INTO submissions (user_id, problem_id, code, language, status, runtime, memory, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
	`,
		submission.UserID,
		submission.ProblemID,
		submission.Code,
		submission.Language,
		submission.Status,
		submission.Runtime,
		submission.Memory,
		submission.CreatedAt,
	)
	return err
}

func (s *Server) updateProblemStats(problemID int, accepted bool) error {
	query := `
		UPDATE problems 
		SET submissions = submissions + 1,
			accepted = accepted + $1
		WHERE id = $2
	`
	_, err := s.db.Exec(query, map[bool]int{true: 1, false: 0}[accepted], problemID)
	return err
}

func (s *Server) handleGetSubmissions(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(string)
	problemID := r.URL.Query().Get("problemId")
	limit := r.URL.Query().Get("limit")
	offset := r.URL.Query().Get("offset")

	query := `
		SELECT id, problem_id, code, language, status, runtime, memory, created_at
		FROM submissions
		WHERE user_id = $1
	`
	args := []interface{}{userID}

	if problemID != "" {
		query += " AND problem_id = $2"
		args = append(args, problemID)
	}

	query += " ORDER BY created_at DESC"

	if limit != "" {
		query += " LIMIT $" + strconv.Itoa(len(args)+1)
		args = append(args, limit)
	}

	if offset != "" {
		query += " OFFSET $" + strconv.Itoa(len(args)+1)
		args = append(args, offset)
	}

	rows, err := s.db.Query(query, args...)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	var submissions []models.Submission
	for rows.Next() {
		var sub models.Submission
		err := rows.Scan(
			&sub.ID,
			&sub.ProblemID,
			&sub.Code,
			&sub.Language,
			&sub.Status,
			&sub.Runtime,
			&sub.Memory,
			&sub.CreatedAt,
		)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Database error")
			return
		}
		submissions = append(submissions, sub)
	}

	utils.RespondWithJSON(w, http.StatusOK, submissions)
}
