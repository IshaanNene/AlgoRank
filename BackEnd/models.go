package main

import "time"

// User represents a user in the system
type User struct {
	ID           string    `json:"id"`
	Email        string    `json:"email"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"createdAt"`
}

// Problem represents a coding problem
type Problem struct {
	ID              int        `json:"problem_num" db:"id"`
	Name            string     `json:"problem_name" db:"problem_name"`
	Title           string     `json:"title" db:"title"`
	Description     string     `json:"description" db:"description"`
	Difficulty      string     `json:"difficulty" db:"difficulty"`
	Acceptance      float64    `json:"acceptance" db:"acceptance"`
	AcceptanceRate  float64    `json:"acceptanceRate,omitempty"`
	TimeComplexity  string     `json:"Expected_Time_Constraints" db:"time_complexity"`
	SpaceComplexity string     `json:"Expected_Space_Constraints" db:"space_complexity"`
	Templates       Templates  `json:"templates"`
	Examples        []Example  `json:"examples"`
	RunTestCases    []TestCase `json:"Run_testCases"`
	SubmitTestCases []TestCase `json:"Submit_testCases"`
	Submissions     int        `json:"submissions" db:"submissions"`
	Accepted        int        `json:"accepted,omitempty" db:"accepted"`
	Tags            []string   `json:"tags,omitempty"`
	Constraints     []string   `json:"constraints,omitempty"`
	CreatedAt       time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at" db:"updated_at"`
}

// Example represents an example for a problem
type Example struct {
	Input       string `json:"input"`
	Output      string `json:"output"`
	Explanation string `json:"explanation,omitempty"`
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

// ExecutionResult represents the result of code execution
type ExecutionResult struct {
	Status      string       `json:"status"`
	Runtime     float64      `json:"runtime"`
	Memory      int64        `json:"memory"`
	TestResults []TestResult `json:"testResults"`
	Error       string       `json:"error,omitempty"`
}

// Metrics represents performance metrics for code execution
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

// LoginRequest represents a login request
type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// RegisterRequest represents a registration request
type RegisterRequest struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// TokenResponse represents a JWT token response
type TokenResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

// CodeRunRequest represents a code run request
type CodeRunRequest struct {
	ProblemID int    `json:"problemId"`
	Code      string `json:"code"`
	Language  string `json:"language"`
	Mode      string `json:"mode"` // "Run" or "Submit"
}
