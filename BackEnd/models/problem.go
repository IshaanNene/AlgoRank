package models

import "time"

type Example struct {
	Input       string `json:"input"`
	Output      string `json:"output"`
	Explanation string `json:"explanation,omitempty"`
}

// Problem represents a coding problem
type Problem struct {
	ID              int        `json:"problem_num"`
	Name            string     `json:"problem_name"`
	Title           string     `json:"title"`
	Description     string     `json:"description"`
	Difficulty      string     `json:"difficulty"`
	Acceptance      float64    `json:"acceptance"`
	AcceptanceRate  float64    `json:"acceptanceRate,omitempty"`
	TimeComplexity  string     `json:"Expected_Time_Constraints"`
	SpaceComplexity string     `json:"Expected_Space_Constraints"`
	Templates       Templates  `json:"templates"`
	Examples        []Example  `json:"examples"`
	RunTestCases    []TestCase `json:"Run_testCases"`
	SubmitTestCases []TestCase `json:"Submit_testCases"`
	Submissions     int        `json:"submissions"`
	Accepted        int        `json:"accepted,omitempty"`
	Tags            []string   `json:"tags,omitempty"`
	Constraints     []string   `json:"constraints,omitempty"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

// Templates holds code templates for different programming languages
type Templates struct {
	JavaScript string `json:"javascript,omitempty"`
	Python     string `json:"python,omitempty"`
	Java       string `json:"java,omitempty"`
	Cpp        string `json:"cpp,omitempty"`
	Go         string `json:"go,omitempty"`
	Rust       string `json:"rust,omitempty"`
}
