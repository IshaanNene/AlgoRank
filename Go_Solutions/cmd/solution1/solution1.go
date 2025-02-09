package main

import (
    "fmt"
    "os"
    "strconv"
)

// Sum adds two numbers
func Sum(a, b int) int {
    return a + b
}

// Checker verifies the solution
func Checker(fn func(int, int) int, a, b, expected int) {
    result := fn(a, b)
    if result == expected {
        fmt.Printf("Test Case Passed: %d + %d = %d\n", a, b, expected)
    } else {
        fmt.Printf("Failed Test Case: %d + %d != %d\n", a, b, expected)
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

    Checker(Sum, a, b, expected)
} 