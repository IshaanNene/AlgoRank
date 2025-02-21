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

type Problem struct {
	ID              int        `json:"id"`
	Title           string     `json:"title"`
	Description     string     `json:"description"`
	Difficulty      string     `json:"difficulty"`
	TimeComplexity  string     `json:"timeComplexity"`
	SpaceComplexity string     `json:"spaceComplexity"`
	Examples        []Example  `json:"examples"`
	TestCases       []TestCase `json:"testCases,omitempty"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}
