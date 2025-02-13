package models

import "time"

type Submission struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	ProblemID string    `json:"problemId"`
	Code      string    `json:"code"`
	Language  string    `json:"language"`
	Status    string    `json:"status"`
	Runtime   int       `json:"runtime"`
	Memory    int       `json:"memory"`
	CreatedAt time.Time `json:"createdAt"`
}

type TestCase struct {
	Input        string `json:"input"`
	Expected     string `json:"expected"`
	ActualOutput string `json:"actualOutput,omitempty"`
	Passed       bool   `json:"passed"`
	Runtime      int    `json:"runtime"`
	Memory       int    `json:"memory"`
}
