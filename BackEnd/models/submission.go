package models

import "time"

// Submission represents a code submission
type Submission struct {
	ID        int       `json:"id"`
	ProblemID int       `json:"problem_id"`
	UserID    string    `json:"user_id"`
	Language  string    `json:"language"`
	Code      string    `json:"code"`
	Status    string    `json:"status"`
	Runtime   float64   `json:"runtime"`
	Memory    int64     `json:"memory"`
	CreatedAt time.Time `json:"created_at"`
}

// SubmissionResult represents the result of a submission
type SubmissionResult struct {
	Success     bool         `json:"success"`
	TestResults []TestResult `json:"test_results"`
	TotalTime   float64      `json:"total_time_ms"`
	MaxMemory   int64        `json:"peak_memory_mb"`
	PassedCount int          `json:"passed_count"`
	FailedCount int          `json:"failed_count"`
	Error       string       `json:"error,omitempty"`
}
