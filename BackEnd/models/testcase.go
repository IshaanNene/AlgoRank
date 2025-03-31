package models

// TestCase represents a test case for a problem
type TestCase struct {
	Input    interface{} `json:"input"`
	Expected interface{} `json:"expected"`
	IsHidden bool        `json:"is_hidden,omitempty"`
}

// TestResult represents the result of running a test case
type TestResult struct {
	Input    interface{} `json:"input"`
	Expected interface{} `json:"expected"`
	Output   interface{} `json:"output"`
	Passed   bool        `json:"passed"`
	TimeMS   float64     `json:"timeMs"`
	MemoryKB int64       `json:"memoryKb"`
	IsHidden bool        `json:"isHidden,omitempty"`
	Error    string      `json:"error,omitempty"`
}
