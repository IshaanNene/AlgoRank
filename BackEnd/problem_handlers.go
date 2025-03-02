package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

// registerProblemRoutes registers problem routes
func registerProblemRoutes(router *mux.Router, db *sql.DB) {
	router.HandleFunc("/problems", getProblems(db)).Methods("GET")
	router.HandleFunc("/problems/{id}", getProblem(db)).Methods("GET")
	router.HandleFunc("/problems", createProblem(db)).Methods("POST").Handler(authMiddleware(db)(http.HandlerFunc(createProblem(db))))
	router.HandleFunc("/problems/{id}/testcases", getTestCases(db)).Methods("GET")
}

// getProblems handles getting all problems
func getProblems(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Parse query parameters
		difficulty := r.URL.Query().Get("difficulty")

		// Build query
		query := `
			SELECT id, title, problem_name, difficulty, acceptance, submissions, created_at, updated_at
			FROM problems
			WHERE 1=1
		`
		args := []interface{}{}

		if difficulty != "" {
			query += " AND difficulty = $1"
			args = append(args, difficulty)
		}

		query += " ORDER BY id"

		// Execute query
		rows, err := db.Query(query, args...)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Database error")
			return
		}
		defer rows.Close()

		// Parse results
		var problems []Problem
		for rows.Next() {
			var p Problem
			err := rows.Scan(
				&p.ID,
				&p.Title,
				&p.Name,
				&p.Difficulty,
				&p.Acceptance,
				&p.Submissions,
				&p.CreatedAt,
				&p.UpdatedAt,
			)
			if err != nil {
				RespondWithError(w, http.StatusInternalServerError, "Failed to scan problems")
				return
			}
			problems = append(problems, p)
		}

		RespondWithJSON(w, http.StatusOK, problems)
	}
}

// getProblem handles getting a single problem
func getProblem(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get problem ID from URL
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			RespondWithError(w, http.StatusBadRequest, "Invalid problem ID")
			return
		}

		// Get problem
		var problem Problem
		err = db.QueryRow(`
			SELECT id, title, problem_name, description, difficulty, acceptance, 
				   time_complexity, space_complexity, submissions, accepted,
				   created_at, updated_at
			FROM problems
			WHERE id = $1
		`, id).Scan(
			&problem.ID,
			&problem.Title,
			&problem.Name,
			&problem.Description,
			&problem.Difficulty,
			&problem.Acceptance,
			&problem.TimeComplexity,
			&problem.SpaceComplexity,
			&problem.Submissions,
			&problem.Accepted,
			&problem.CreatedAt,
			&problem.UpdatedAt,
		)
		if err == sql.ErrNoRows {
			RespondWithError(w, http.StatusNotFound, "Problem not found")
			return
		} else if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Database error: "+err.Error())
			return
		}

		// Get examples
		rows, err := db.Query(`
			SELECT input, output, explanation
			FROM problem_examples
			WHERE problem_id = $1
		`, id)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to fetch examples")
			return
		}
		defer rows.Close()

		for rows.Next() {
			var example Example
			err := rows.Scan(&example.Input, &example.Output, &example.Explanation)
			if err != nil {
				RespondWithError(w, http.StatusInternalServerError, "Failed to scan examples")
				return
			}
			problem.Examples = append(problem.Examples, example)
		}

		// Get templates
		var templatesJSON []byte
		err = db.QueryRow(`
			SELECT templates
			FROM problem_templates
			WHERE problem_id = $1
		`, id).Scan(&templatesJSON)
		if err == nil {
			json.Unmarshal(templatesJSON, &problem.Templates)
		}

		// Get test cases
		rows, err = db.Query(`
			SELECT input, expected_output, is_hidden, is_submit
			FROM test_cases
			WHERE problem_id = $1
		`, id)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to fetch test cases")
			return
		}
		defer rows.Close()

		for rows.Next() {
			var tc TestCase
			var input, expected []byte
			var isHidden, isSubmit bool
			err := rows.Scan(&input, &expected, &isHidden, &isSubmit)
			if err != nil {
				RespondWithError(w, http.StatusInternalServerError, "Failed to scan test cases")
				return
			}

			// Parse JSON
			json.Unmarshal(input, &tc.Input)
			json.Unmarshal(expected, &tc.Expected)
			tc.IsHidden = isHidden

			if isSubmit {
				problem.SubmitTestCases = append(problem.SubmitTestCases, tc)
			} else {
				problem.RunTestCases = append(problem.RunTestCases, tc)
			}
		}

		// Calculate acceptance rate
		if problem.Submissions > 0 {
			problem.AcceptanceRate = float64(problem.Accepted) / float64(problem.Submissions) * 100
		}

		RespondWithJSON(w, http.StatusOK, problem)
	}
}

// createProblem handles creating a new problem
func createProblem(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var problem Problem
		if err := json.NewDecoder(r.Body).Decode(&problem); err != nil {
			RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
			return
		}

		// Set timestamps
		now := time.Now()
		problem.CreatedAt = now
		problem.UpdatedAt = now
		problem.Submissions = 0
		problem.Accepted = 0

		// Begin transaction
		tx, err := db.Begin()
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to begin transaction")
			return
		}
		defer tx.Rollback()

		// Insert problem
		err = tx.QueryRow(`
			INSERT INTO problems (title, problem_name, description, difficulty, time_complexity, space_complexity, created_at, updated_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
			RETURNING id
		`, problem.Title, problem.Name, problem.Description, problem.Difficulty,
			problem.TimeComplexity, problem.SpaceComplexity, problem.CreatedAt, problem.UpdatedAt).Scan(&problem.ID)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to create problem")
			return
		}

		// Insert examples
		for _, example := range problem.Examples {
			_, err = tx.Exec(`
				INSERT INTO problem_examples (problem_id, input, output, explanation)
				VALUES ($1, $2, $3, $4)
			`, problem.ID, example.Input, example.Output, example.Explanation)
			if err != nil {
				RespondWithError(w, http.StatusInternalServerError, "Failed to create examples")
				return
			}
		}

		// Insert templates
		templatesJSON, err := json.Marshal(problem.Templates)
		if err == nil {
			_, err = tx.Exec(`
				INSERT INTO problem_templates (problem_id, templates)
				VALUES ($1, $2)
			`, problem.ID, templatesJSON)
			if err != nil {
				RespondWithError(w, http.StatusInternalServerError, "Failed to create templates")
				return
			}
		}

		// Insert test cases
		for _, tc := range problem.RunTestCases {
			inputJSON, _ := json.Marshal(tc.Input)
			expectedJSON, _ := json.Marshal(tc.Expected)
			_, err = tx.Exec(`
				INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, is_submit)
				VALUES ($1, $2, $3, $4, $5)
			`, problem.ID, inputJSON, expectedJSON, tc.IsHidden, false)
			if err != nil {
				RespondWithError(w, http.StatusInternalServerError, "Failed to create run test cases")
				return
			}
		}

		for _, tc := range problem.SubmitTestCases {
			inputJSON, _ := json.Marshal(tc.Input)
			expectedJSON, _ := json.Marshal(tc.Expected)
			_, err = tx.Exec(`
				INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, is_submit)
				VALUES ($1, $2, $3, $4, $5)
			`, problem.ID, inputJSON, expectedJSON, tc.IsHidden, true)
			if err != nil {
				RespondWithError(w, http.StatusInternalServerError, "Failed to create submit test cases")
				return
			}
		}

		// Commit transaction
		if err := tx.Commit(); err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Failed to commit transaction")
			return
		}

		RespondWithJSON(w, http.StatusCreated, problem)
	}
}

// getTestCases handles getting test cases for a problem
func getTestCases(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Get problem ID from URL
		vars := mux.Vars(r)
		id, err := strconv.Atoi(vars["id"])
		if err != nil {
			RespondWithError(w, http.StatusBadRequest, "Invalid problem ID")
			return
		}

		// Get mode from query parameters
		mode := r.URL.Query().Get("mode")
		if mode != "Run" && mode != "Submit" {
			mode = "Run" // default to Run mode
		}

		// Build query
		query := `
			SELECT input, expected_output, is_hidden
			FROM test_cases
			WHERE problem_id = $1
		`
		if mode == "Run" {
			query += " AND NOT is_submit"
		} else {
			query += " AND is_submit"
		}

		// Execute query
		rows, err := db.Query(query, id)
		if err != nil {
			RespondWithError(w, http.StatusInternalServerError, "Database error")
			return
		}
		defer rows.Close()

		// Parse results
		var testCases []TestCase
		for rows.Next() {
			var tc TestCase
			var input, expected []byte
			var isHidden bool
			err := rows.Scan(&input, &expected, &isHidden)
			if err != nil {
				RespondWithError(w, http.StatusInternalServerError, "Failed to scan test cases")
				return
			}

			// Parse JSON
			json.Unmarshal(input, &tc.Input)
			json.Unmarshal(expected, &tc.Expected)
			tc.IsHidden = isHidden

			testCases = append(testCases, tc)
		}

		RespondWithJSON(w, http.StatusOK, testCases)
	}
}
