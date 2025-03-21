package main

import (
    "fmt"
    "os"
    "strconv"
)

// FindMax finds the maximum of two numbers
func FindMax(a, b int) int {
    if a > b {
        return a
    }
    return b
}

// Checker verifies the solution
func Checker(fn func(int, int) int, a, b, expected int) {
    result := fn(a, b)
    if result == expected {
        fmt.Printf("Test Case Passed: Result = %d, Expected = %d\n", result, expected)
    } else {
        fmt.Printf("Failed Test Case: Result = %d, Expected = %d\n", result, expected)
    }
}

func main() {
    if len(os.Args) != 4 {
        fmt.Fprintf(os.Stderr, "Usage: %s <a> <b> <expected>\n", os.Args[0])
        os.Exit(1)
    }

    a, _ := strconv.Atoi(os.Args[1])
    b, _ := strconv.Atoi(os.Args[2])
    expected, _ := strconv.Atoi(os.Args[3])

    Checker(FindMax, a, b, expected)
} 