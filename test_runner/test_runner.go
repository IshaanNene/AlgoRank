package main

import (
    "encoding/json"
    "fmt"
    "os"
    "reflect"
    "sort"
    "sync"
    "time"
)

type TestCase struct {
    Input  interface{} `json:"input"`
    Output interface{} `json:"output"`
}

type TestData struct {
    ProblemID    int         `json:"problem_id"`
    ProblemName  string      `json:"problem_name"`
    FunctionName string      `json:"function_name"`
    TestCasesRun []TestCase  `json:"test_cases_run"`
}

type TestResult struct {
    Passed   bool
    Error    string
    TimeInMs float64
}

func areEqual(actual, expected interface{}) bool {
    if reflect.TypeOf(actual) != reflect.TypeOf(expected) {
        return false
    }

    switch actual := actual.(type) {
    case []int:
        expectedSlice := expected.([]int)
        if len(actual) != len(expectedSlice) {
            return false
        }
        actualCopy := make([]int, len(actual))
        expectedCopy := make([]int, len(expectedSlice))
        copy(actualCopy, actual)
        copy(expectedCopy, expectedSlice)
        sort.Ints(actualCopy)
        sort.Ints(expectedCopy)
        return reflect.DeepEqual(actualCopy, expectedCopy)
    default:
        return reflect.DeepEqual(actual, expected)
    }
}

func runTest(wg *sync.WaitGroup, results chan<- TestResult, solution interface{}, tc TestCase, funcName string, idx int) {
    defer wg.Done()
    start := time.Now()
    
    result := TestResult{}
    defer func() {
        if r := recover(); r != nil {
            result.Error = fmt.Sprintf("Panic: %v", r)
            result.Passed = false
        }
        result.TimeInMs = float64(time.Since(start).Microseconds()) / 1000.0
        results <- result
        
        status := "✓"
        color := "\033[32m" // Green
        if !result.Passed {
            status = "✗"
            color = "\033[31m" // Red
        }
        fmt.Printf("Test %2d: %s%s\033[0m (%.2fms)", idx+1, color, status, result.TimeInMs)
        if result.Error != "" {
            fmt.Printf(" Error: %s", result.Error)
        }
        fmt.Println()
    }()

    // Get the solution function by name
    method := reflect.ValueOf(solution).MethodByName(funcName)
    if !method.IsValid() {
        result.Error = fmt.Sprintf("Function '%s' not found", funcName)
        result.Passed = false
        return
    }

    // Convert input to reflect.Value
    var args []reflect.Value
    switch input := tc.Input.(type) {
    case map[string]interface{}:
        for _, v := range input {
            args = append(args, reflect.ValueOf(v))
        }
    default:
        args = []reflect.Value{reflect.ValueOf(tc.Input)}
    }

    // Call the function
    outputs := method.Call(args)
    if len(outputs) != 1 {
        result.Error = "Expected single return value"
        result.Passed = false
        return
    }

    result.Passed = areEqual(outputs[0].Interface(), tc.Output)
}

func main() {
    // Read test cases
    data, err := os.ReadFile("testcases.json")
    if err != nil {
        fmt.Fprintf(os.Stderr, "\033[31mError reading testcases.json: %v\033[0m\n", err)
        os.Exit(1)
    }

    var testData TestData
    if err := json.Unmarshal(data, &testData); err != nil {
        fmt.Fprintf(os.Stderr, "\033[31mError parsing JSON: %v\033[0m\n", err)
        os.Exit(1)
    }

    fmt.Printf("\nRunning tests for function: \033[36m%s\033[0m\n", testData.FunctionName)
    fmt.Printf("Number of test cases: %d\n\n", len(testData.TestCasesRun))

    startTime := time.Now()
    var wg sync.WaitGroup
    results := make(chan TestResult, len(testData.TestCasesRun))

    solution := &Solution{}
    for i, tc := range testData.TestCasesRun {
        wg.Add(1)
        go runTest(&wg, results, solution, tc, testData.FunctionName, i)
    }

    go func() {
        wg.Wait()
        close(results)
    }()

    passed := 0
    totalTime := 0.0
    for result := range results {
        if result.Passed {
            passed++
        }
        totalTime += result.TimeInMs
    }

    elapsed := float64(time.Since(startTime).Microseconds()) / 1000.0
    
    // Print summary
    fmt.Printf("\nSummary:\n--------\n")
    passColor := "\033[32m"
    if passed != len(testData.TestCasesRun) {
        passColor = "\033[31m"
    }
    fmt.Printf("Passed: %s%d/%d (%.1f%%)\033[0m\n", 
        passColor, passed, len(testData.TestCasesRun), 
        float64(passed) * 100 / float64(len(testData.TestCasesRun)))
    fmt.Printf("Total time: %.2fms\n", elapsed)
    fmt.Printf("Average time per test: %.2fms\n", totalTime/float64(len(testData.TestCasesRun)))

    if passed != len(testData.TestCasesRun) {
        os.Exit(1)
    }
}