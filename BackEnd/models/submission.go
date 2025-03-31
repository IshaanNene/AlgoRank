package models

import "time"

// Submission represents a code submission
type Submission struct {
	ID        int       `json:"id"`
	ProblemID int       `json:"problemId"`
	UserID    string    `json:"userId"`
	Language  string    `json:"language"`
	Code      string    `json:"code"`
	Status    string    `json:"status"`
	Runtime   float64   `json:"runtime"`
	Memory    int64     `json:"memory"`
	CreatedAt time.Time `json:"createdAt"`
}

// SubmissionResult represents the result of a submission
type SubmissionResult struct {
	Success     bool         `json:"success"`
	TestResults []TestResult `json:"testResults"`
	TotalTime   float64      `json:"totalTime"`
	MaxMemory   int64        `json:"maxMemory"`
	PassedCount int          `json:"passedCount"`
	FailedCount int          `json:"failedCount"`
	Error       string       `json:"error,omitempty"`
}
