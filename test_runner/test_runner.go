package main

import (
    "encoding/json"
    "fmt"
    "os"
)

type Input struct {
    Nums   []int `json:"nums"`
    Target int   `json:"target"`
}

type TestCase struct {
    Input  Input `json:"input"`
    Output []int `json:"output"`
}

type TestSet struct {
    Run []TestCase `json:"run"`
}

// assumes starter_code.go has: func TwoSum(nums []int, target int) []int

func areEqual(a, b []int) bool {
    if len(a) != len(b) {
        return false
    }
    for i := range a {
        if a[i] != b[i] {
            return false
        }
    }
    return true
}

func main() {
    f, err := os.ReadFile("testcases.json")
    if err != nil {
        fmt.Println("❌ Failed to open testcases.json:", err)
        return
    }

    var tests TestSet
    err = json.Unmarshal(f, &tests)
    if err != nil {
        fmt.Println("❌ Invalid JSON format:", err)
        return
    }

    passed := 0
    for i, t := range tests.Run {
        result := TwoSum(t.Input.Nums, t.Input.Target)
        if areEqual(result, t.Output) {
            fmt.Printf("✅ Test %d passed\n", i+1)
            passed++
        } else {
            fmt.Printf("❌ Test %d failed\n", i+1)
            fmt.Println("   Expected:", t.Output)
            fmt.Println("   Got     :", result)
        }
    }

    fmt.Printf("\nSummary: %d/%d tests passed.\n", passed, len(tests.Run))
}

