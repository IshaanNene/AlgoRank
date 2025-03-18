package models

import (
	"database/sql"
	"encoding/json"
	"time"
)

type Problem struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Difficulty  string    `json:"difficulty"`
	TestCases   TestCases `json:"testCases"`
	CreatedAt   time.Time `json:"createdAt"`
}

type TestCases struct {
	Run    []TestCase `json:"run"`
	Submit []TestCase `json:"submit"`
}

type TestCase struct {
	Input    json.RawMessage `json:"input"`
	Expected json.RawMessage `json:"expected"`
}

type Submission struct {
	ID          int       `json:"id"`
	UserID      int       `json:"userId"`
	ProblemID   int       `json:"problemId"`
	Code        string    `json:"code"`
	Language    string    `json:"language"`
	Status      string    `json:"status"`
	Runtime     float64   `json:"runtime"`
	MemoryUsage int       `json:"memoryUsage"`
	SubmittedAt time.Time `json:"submittedAt"`
}

func (p *Problem) Save(db *sql.DB) error {
	query := `
        INSERT INTO problems (title, description, difficulty, test_cases)
        VALUES ($1, $2, $3, $4)
        RETURNING id, created_at`

	testCasesJSON, err := json.Marshal(p.TestCases)
	if err != nil {
		return err
	}

	return db.QueryRow(
		query,
		p.Title,
		p.Description,
		p.Difficulty,
		testCasesJSON,
	).Scan(&p.ID, &p.CreatedAt)
}

func (s *Submission) Save(db *sql.DB) error {
	query := `
        INSERT INTO submissions (user_id, problem_id, code, language, status, runtime, memory_usage)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id, submitted_at`

	return db.QueryRow(
		query,
		s.UserID,
		s.ProblemID,
		s.Code,
		s.Language,
		s.Status,
		s.Runtime,
		s.MemoryUsage,
	).Scan(&s.ID, &s.SubmittedAt)
}
