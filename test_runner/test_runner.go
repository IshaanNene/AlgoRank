package main

import (
    "encoding/json"
    "fmt"
    "os"
    "reflect"
    "sort"
    "sync"
)

type TestCase struct {
    Input       map[string]interface{} `json:"input"`
    Output      interface{}            `json:"output"`
    FunctionName string               `json:"function_name"`
}

type TestData struct {
    TestCasesRun []TestCase `json:"test_cases_run"`
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

func runTest(wg *sync.WaitGroup, results chan<- bool, tc TestCase, idx int) {
    defer wg.Done()
    
    defer func() {
        if r := recover(); r != nil {
            fmt.Printf("Test %d: ✗ (Panic: %v)\n", idx+1, r)
            results <- false
        }
    }()

    result := solve(tc.Input) // Call your solution function
    passed := areEqual(result, tc.Output)
    fmt.Printf("Test %d: %s\n", idx+1, map[bool]string{true: "✓", false: "✗"}[passed])
    results <- passed
}

func main() {
    data, err := os.ReadFile("testcases.json")
    if err != nil {
        fmt.Fprintf(os.Stderr, "Error reading testcases.json: %v\n", err)
        os.Exit(1)
    }

    var testData TestData
    if err := json.Unmarshal(data, &testData); err != nil {
        fmt.Fprintf(os.Stderr, "Error parsing JSON: %v\n", err)
        os.Exit(1)
    }

    var wg sync.WaitGroup
    results := make(chan bool, len(testData.TestCasesRun))

    for i, tc := range testData.TestCasesRun {
        wg.Add(1)
        go runTest(&wg, results, tc, i)
    }

    go func() {
        wg.Wait()
        close(results)
    }()

    passed := 0
    for result := range results {
        if result {
            passed++
        }
    }

    fmt.Printf("\nSummary: %d/%d tests passed\n", passed, len(testData.TestCasesRun))
    if passed != len(testData.TestCasesRun) {
        os.Exit(1)
    }
}