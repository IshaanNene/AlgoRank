package models

import "time"

type Example struct {
	Input       string `json:"input"`
	Output      string `json:"output"`
	Explanation string `json:"explanation,omitempty"`
}

type TestCase struct {
	Input    string `json:"input"`
	Expected string `json:"expected"`
	IsHidden bool   `json:"is_hidden"`
}

// Problem represents a coding problem
type Problem struct {
	ID               int        `json:"problem_num"`
	Name             string     `json:"problem_name"`
	Description      string     `json:"description"`
	Difficulty       string     `json:"difficulty"`
	Acceptance       float64    `json:"acceptance"`
	TimeConstraints  string     `json:"Expected_Time_Constraints"`
	SpaceConstraints string     `json:"Expected_Space_Constraints"`
	Templates        Templates  `json:"templates"`
	RunTestCases     []TestCase `json:"Run_testCases"`
	SubmitTestCases  []TestCase `json:"Submit_testCases"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`
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
