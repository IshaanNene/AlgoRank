package models

import "time"

type Problem struct {
	ID             string    `json:"id"`
	Title          string    `json:"title"`
	Description    string    `json:"description"`
	Difficulty     string    `json:"difficulty"`
	Tags           []string  `json:"tags"`
	Examples       []Example `json:"examples"`
	Constraints    []string  `json:"constraints"`
	CreatedAt      time.Time `json:"createdAt"`
	Submissions    int       `json:"submissions"`
	Accepted       int       `json:"accepted"`
	AcceptanceRate float64   `json:"acceptanceRate"`
}

type Example struct {
	Input       string `json:"input"`
	Output      string `json:"output"`
	Explanation string `json:"explanation,omitempty"`
}
