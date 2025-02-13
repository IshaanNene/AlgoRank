package models

type ExecutionResult struct {
	Status    string     `json:"status"`
	Runtime   int        `json:"runtime"`
	Memory    int        `json:"memory"`
	TestCases []TestCase `json:"testCases"`
	Metrics   Metrics    `json:"metrics"`
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
