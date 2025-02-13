package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/IshaanNene/AlgoRank/models"
	"github.com/IshaanNene/AlgoRank/utils"
	"github.com/gorilla/mux"
)

func (s *Server) handleGetProblems(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	difficulty := r.URL.Query().Get("difficulty")
	tag := r.URL.Query().Get("tag")
	status := r.URL.Query().Get("status")
	userID := r.Context().Value("userID").(string)

	query := `
		SELECT p.id, p.title, p.description, p.difficulty, p.tags, p.examples, 
		       p.constraints, p.created_at, p.submissions, p.accepted,
		       CASE WHEN s.status = 'Accepted' THEN true ELSE false END as solved
		FROM problems p
		LEFT JOIN (
			SELECT DISTINCT ON (problem_id) problem_id, status
			FROM submissions
			WHERE user_id = $1
			ORDER BY problem_id, created_at DESC
		) s ON p.id = s.problem_id
		WHERE 1=1
	`
	args := []interface{}{userID}
	argCount := 2

	if difficulty != "" {
		query += ` AND p.difficulty = $` + strconv.Itoa(argCount)
		args = append(args, difficulty)
		argCount++
	}

	if tag != "" {
		query += ` AND $` + strconv.Itoa(argCount) + ` = ANY(p.tags)`
		args = append(args, tag)
		argCount++
	}

	if status == "solved" {
		query += ` AND s.status = 'Accepted'`
	} else if status == "unsolved" {
		query += ` AND (s.status IS NULL OR s.status != 'Accepted')`
	}

	query += ` ORDER BY p.id ASC`

	rows, err := s.db.Query(query, args...)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	var problems []models.Problem
	for rows.Next() {
		var p models.Problem
		var tags, constraints []byte
		var examples []byte
		var solved bool

		err := rows.Scan(
			&p.ID,
			&p.Title,
			&p.Description,
			&p.Difficulty,
			&tags,
			&examples,
			&constraints,
			&p.CreatedAt,
			&p.Submissions,
			&p.Accepted,
			&solved,
		)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Database error")
			return
		}

		// Parse JSON arrays
		json.Unmarshal(tags, &p.Tags)
		json.Unmarshal(constraints, &p.Constraints)
		json.Unmarshal(examples, &p.Examples)

		// Calculate acceptance rate
		if p.Submissions > 0 {
			p.AcceptanceRate = float64(p.Accepted) / float64(p.Submissions) * 100
		}

		problems = append(problems, p)
	}

	utils.RespondWithJSON(w, http.StatusOK, problems)
}

func (s *Server) handleGetProblem(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	problemID := vars["id"]
	userID := r.Context().Value("userID").(string)

	var p models.Problem
	var tags, constraints []byte
	var examples []byte

	query := `
		SELECT p.*, 
		       CASE WHEN s.status = 'Accepted' THEN true ELSE false END as solved
		FROM problems p
		LEFT JOIN (
			SELECT DISTINCT ON (problem_id) problem_id, status
			FROM submissions
			WHERE user_id = $1
			ORDER BY problem_id, created_at DESC
		) s ON p.id = s.problem_id
		WHERE p.id = $2
	`

	var solved bool
	err := s.db.QueryRow(query, userID, problemID).Scan(
		&p.ID,
		&p.Title,
		&p.Description,
		&p.Difficulty,
		&tags,
		&examples,
		&constraints,
		&p.CreatedAt,
		&p.Submissions,
		&p.Accepted,
		&solved,
	)

	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Problem not found")
		return
	}

	// Parse JSON arrays
	json.Unmarshal(tags, &p.Tags)
	json.Unmarshal(constraints, &p.Constraints)
	json.Unmarshal(examples, &p.Examples)

	// Calculate acceptance rate
	if p.Submissions > 0 {
		p.AcceptanceRate = float64(p.Accepted) / float64(p.Submissions) * 100
	}

	utils.RespondWithJSON(w, http.StatusOK, p)
}

func (s *Server) handleGetTestCases(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	problemID := vars["id"]
	mode := r.URL.Query().Get("mode")

	if mode != "Run" && mode != "Submit" {
		mode = "Run" // default to Run mode
	}

	query := `
		SELECT input, expected_output, is_hidden
		FROM test_cases
		WHERE problem_id = $1
	`
	if mode == "Run" {
		query += ` AND NOT is_hidden
		LIMIT 3`
	}

	rows, err := s.db.Query(query, problemID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	var testCases []models.TestCase
	for rows.Next() {
		var tc models.TestCase
		var isHidden bool
		err := rows.Scan(&tc.Input, &tc.Expected, &isHidden)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Database error")
			return
		}
		testCases = append(testCases, tc)
	}

	utils.RespondWithJSON(w, http.StatusOK, testCases)
}
