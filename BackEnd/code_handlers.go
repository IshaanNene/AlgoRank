package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"os/exec"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

// registerCodeRoutes registers code execution routes
func registerCodeRoutes(router *mux.Router, db *sql.DB) {
	router.HandleFunc("/code/run", handleRunCode(db)).Methods("POST")
	router.HandleFunc("/code/submit", handleSubmitCode(db)).Methods("POST").Handler(authMiddleware(db)(http.HandlerFunc(handleSubmitCode(db))))
	router.HandleFunc("/submissions", getSubmissions(db)).Methods("GET").Handler(authMiddleware(db)(http.HandlerFunc(getSubmissions(db))))
}

// handleRunCode handles running code without saving it
func handleRunCode(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req CodeRunRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			RespondWithError(w, http.StatusBadRequest, "Invalid request body")
			return
		}

		// Validate request
		if req.ProblemID <= 0 || req.Code == "" || req.Language == "" {
			RespondWithError(w, http.StatusBadRequest, "Problem ID, code, and language are required")
			return
		}

		// Save code to temporary file
		filename := filepath.Join("temp", strconv.Itoa(req.ProblemID), "solution."+getFileExtension(req.Language))
		if err := SaveCodeToFile(filename, req.Code); err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to save code")
			return
		}

		// Execute code
		result, err := executeCode(req.ProblemID, filename, req.Language, "Run")
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to execute code: "+err.Error())
			return
		}

		RespondWithJSON(w, http.StatusOK, result)
	}
}

// handleSubmitCode handles submitting code and saving it
func handleSubmitCode(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req CodeRunRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			RespondWithError(w, http.StatusBadRequest, "Invalid request body")
			return
		}

		// Validate request
		if req.ProblemID <= 0 || req.Code == "" || req.Language == "" {
			RespondWithError(w, http.StatusBadRequest, "Problem ID, code, and language are required")
			return
		}

		// Get user ID from context
		userID := r.Context().Value("userID").(string)

		// Save code to temporary file
		filename := filepath.Join("temp", strconv.Itoa(req.ProblemID), "solution."+getFileExtension(req.Language))
		if err := SaveCodeToFile(filename, req.Code); err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to save code")
			return
		}

		// Execute code
		result, err := executeCode(req.ProblemID, filename, req.Language, "Submit")
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to execute code: "+err.Error())
			return
		}

		// Save submission
		status := "Accepted"
		if result.Error != "" || result.TestResults == nil || len(result.TestResults) == 0 {
			status = "Error"
		} else {
			for _, tr := range result.TestResults {
				if !tr.Passed {
					status = "Failed"
					break
				}
			}
		}

		_, err = db.Exec(`
			INSERT INTO submissions (problem_id, user_id, code, language, status, runtime, memory, created_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		`,
			req.ProblemID,
			userID,
			req.Code,
			req.Language,
			status,
			result.Runtime,
			result.Memory,
			time.Now(),
		)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to save submission")
			return
		}

		// Update problem statistics
		_, err = db.Exec(`
			UPDATE problems
			SET submissions = submissions + 1,
				accepted = accepted + $1
			WHERE id = $2
		`, map[string]int{"Accepted": 1, "Failed": 0, "Error": 0}[status], req.ProblemID)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to update problem statistics")
			return
		}

		RespondWithJSON(w, http.StatusOK, result)
	}
}

// getSubmissions handles getting submissions for a user
func getSubmissions(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get user ID from context
		userID := r.Context().Value("userID").(string)

		// Parse query parameters
		problemID := r.URL.Query().Get("problemId")
		limit := r.URL.Query().Get("limit")
		offset := r.URL.Query().Get("offset")

		// Build query
		query := `
			SELECT id, problem_id, code, language, status, runtime, memory, created_at
			FROM submissions
			WHERE user_id = $1
		`
		args := []interface{}{userID}
		argCount := 2

		if problemID != "" {
			query += " AND problem_id = $" + strconv.Itoa(argCount)
			args = append(args, problemID)
			argCount++
		}

		query += " ORDER BY created_at DESC"

		if limit != "" {
			query += " LIMIT $" + strconv.Itoa(argCount)
			args = append(args, limit)
			argCount++
		}

		if offset != "" {
			query += " OFFSET $" + strconv.Itoa(argCount)
			args = append(args, offset)
			argCount++
		}

		// Execute query
		rows, err := db.Query(query, args...)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Database error")
			return
		}
		defer rows.Close()

		// Parse results
		var submissions []Submission
		for rows.Next() {
			var sub Submission
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
				RespondWithError(w, http.StatusInternalServerError, "Failed to scan submissions")
				return
			}
			sub.UserID = userID
			submissions = append(submissions, sub)
		}

		RespondWithJSON(w, http.StatusOK, submissions)
	}
}

// executeCode executes code and returns the result
func executeCode(problemID int, filename, language, mode string) (*ExecutionResult, error) {
	// Execute Python script
	cmd := exec.Command("python", "main.py", mode, strconv.Itoa(problemID), language)
	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, err
	}

	// Parse execution results
	var result ExecutionResult
	if err := json.Unmarshal(output, &result); err != nil {
		return nil, err
	}

	return &result, nil
}

// getFileExtension returns the file extension for a language
func getFileExtension(language string) string {
	switch language {
	case "javascript":
		return "js"
	case "python":
		return "py"
	case "java":
		return "java"
	case "cpp":
		return "cpp"
	case "go":
		return "go"
	case "rust":
		return "rs"
	default:
		return "txt"
	}
}
