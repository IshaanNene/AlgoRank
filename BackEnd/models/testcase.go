package models

// TestCase represents a single test case with input and expected output
type TestCase struct {
	Input    interface{} `json:"input"`
	Expected interface{} `json:"expected"`
}

// TestResult represents the result of running a test case
type TestResult struct {
	Success       bool    `json:"success"`
	ExecutionTime float64 `json:"execution_time"`
	Memory        int64   `json:"memory_usage"`
	Output        string  `json:"output"`
	Error         string  `json:"error,omitempty"`
}
