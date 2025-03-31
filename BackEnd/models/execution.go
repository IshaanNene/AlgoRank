package models

// ExecutionResult represents the result of code execution
type ExecutionResult struct {
	Status      string       `json:"status"`
	Runtime     float64      `json:"runtime"`
	Memory      int64        `json:"memory"`
	TestResults []TestResult `json:"testResults"`
	Error       string       `json:"error,omitempty"`
}

type Metrics struct {
	TotalTime      float64   `json:"totalTime"`
	ExecutionTimes []float64 `json:"executionTimes"`
	PeakMemory     float64   `json:"peakMemory"`
	PassedCount    int       `json:"passedCount"`
	FailedCount    int       `json:"failedCount"`
	Timeouts       int       `json:"timeouts"`
	Errors         int       `json:"errors"`
	SlowestTest    int       `json:"slowestTest"`
	FastestTest    int       `json:"fastestTest"`
	PeakCPUUsage   float64   `json:"peakCpuUsage"`
}
