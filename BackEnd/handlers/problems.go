package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/IshaanNene/AlgoRank/models"
	"github.com/IshaanNene/AlgoRank/utils"
	"github.com/gorilla/mux"
)

type ProblemHandler struct {
	db *sql.DB
}

func NewProblemHandler(db *sql.DB) *ProblemHandler {
	return &ProblemHandler{db: db}
}

func (h *ProblemHandler) RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/api/problems", h.GetProblems).Methods("GET")
	r.HandleFunc("/api/problems/{id}", h.GetProblem).Methods("GET")
	r.HandleFunc("/api/problems", h.CreateProblem).Methods("POST")
}

func (h *ProblemHandler) GetProblems(w http.ResponseWriter, r *http.Request) {
	problems, err := h.db.Query(`
		SELECT id, title, difficulty, acceptance, submissions, created_at, updated_at
		FROM problems
		ORDER BY id
	`)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch problems")
		return
	}
	defer problems.Close()

	var problemsList []models.Problem
	for problems.Next() {
		var p models.Problem
		err := problems.Scan(&p.ID, &p.Title, &p.Difficulty, &p.Acceptance, &p.Submissions, &p.CreatedAt, &p.UpdatedAt)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to scan problems")
			return
		}
		problemsList = append(problemsList, p)
	}

	utils.RespondWithJSON(w, http.StatusOK, problemsList)
}

func (h *ProblemHandler) GetProblem(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid problem ID")
		return
	}

	var problem models.Problem
	err = h.db.QueryRow(`
		SELECT id, title, description, difficulty, acceptance, 
			   time_complexity, space_complexity, submissions, created_at, updated_at
		FROM problems
		WHERE id = $1
	`, id).Scan(
		&problem.ID, &problem.Title, &problem.Description,
		&problem.Difficulty, &problem.Acceptance, &problem.TimeComplexity,
		&problem.SpaceComplexity, &problem.Submissions, &problem.CreatedAt, &problem.UpdatedAt,
	)

	if err == sql.ErrNoRows {
		utils.RespondWithError(w, http.StatusNotFound, "Problem not found")
		return
	} else if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch problem")
		return
	}

	// Fetch examples
	examples, err := h.db.Query(`
		SELECT input, output, explanation
		FROM problem_examples
		WHERE problem_id = $1
	`, id)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to fetch examples")
		return
	}
	defer examples.Close()

	for examples.Next() {
		var example models.Example
		err := examples.Scan(&example.Input, &example.Output, &example.Explanation)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to scan examples")
			return
		}
		problem.Examples = append(problem.Examples, example)
	}

	// Fetch templates
	var templatesJSON []byte
	err = h.db.QueryRow(`
		SELECT templates
		FROM problem_templates
		WHERE problem_id = $1
	`, id).Scan(&templatesJSON)

	if err == nil {
		json.Unmarshal(templatesJSON, &problem.Templates)
	}

	// Fetch test cases
	testCases, err := h.db.Query(`
		SELECT input, expected_output, is_hidden, is_submit
		FROM test_cases
		WHERE problem_id = $1
	`, id)
	if err == nil {
		defer testCases.Close()

		for testCases.Next() {
			var tc models.TestCase
			var isHidden, isSubmit bool
			err := testCases.Scan(&tc.Input, &tc.Expected, &isHidden, &isSubmit)
			if err != nil {
				continue
			}

			if isSubmit {
				problem.SubmitTestCases = append(problem.SubmitTestCases, tc)
			} else {
				problem.RunTestCases = append(problem.RunTestCases, tc)
			}
		}
	}

	utils.RespondWithJSON(w, http.StatusOK, problem)
}

func (h *ProblemHandler) CreateProblem(w http.ResponseWriter, r *http.Request) {
	var problem models.Problem
	if err := json.NewDecoder(r.Body).Decode(&problem); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	// Set timestamps
	now := time.Now()
	problem.CreatedAt = now
	problem.UpdatedAt = now
	problem.Submissions = 0
	problem.Accepted = 0

	// Insert problem
	err := h.db.QueryRow(`
		INSERT INTO problems (title, description, difficulty, time_complexity, space_complexity, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id
	`, problem.Title, problem.Description, problem.Difficulty,
		problem.TimeComplexity, problem.SpaceComplexity, problem.CreatedAt, problem.UpdatedAt).Scan(&problem.ID)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create problem")
		return
	}

	// Insert examples
	for _, example := range problem.Examples {
		_, err = h.db.Exec(`
			INSERT INTO problem_examples (problem_id, input, output, explanation)
			VALUES ($1, $2, $3, $4)
		`, problem.ID, example.Input, example.Output, example.Explanation)

		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create examples")
			return
		}
	}

	// Insert templates
	templatesJSON, err := json.Marshal(problem.Templates)
	if err == nil {
		_, err = h.db.Exec(`
			INSERT INTO problem_templates (problem_id, templates)
			VALUES ($1, $2)
		`, problem.ID, templatesJSON)

		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create templates")
			return
		}
	}

	// Insert test cases
	for _, tc := range problem.RunTestCases {
		_, err = h.db.Exec(`
			INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, is_submit)
			VALUES ($1, $2, $3, $4, $5)
		`, problem.ID, tc.Input, tc.Expected, tc.IsHidden, false)

		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create run test cases")
			return
		}
	}

	for _, tc := range problem.SubmitTestCases {
		_, err = h.db.Exec(`
			INSERT INTO test_cases (problem_id, input, expected_output, is_hidden, is_submit)
			VALUES ($1, $2, $3, $4, $5)
		`, problem.ID, tc.Input, tc.Expected, tc.IsHidden, true)

		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Failed to create submit test cases")
			return
		}
	}

	utils.RespondWithJSON(w, http.StatusCreated, problem)
}

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
