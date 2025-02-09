package main

import (
    "fmt"
    "os"
    "strconv"
)

// Fibonacci calculates the nth Fibonacci number
func Fibonacci(n int) int {
    if n <= 0 {
        return 0
    }
    if n == 1 {
        return 1
    }
    
    prev, curr := 0, 1
    for i := 2; i <= n; i++ {
        next := prev + curr
        prev = curr
        curr = next
    }
    return curr
}

// Checker verifies the solution
func Checker(fn func(int) int, n, expected int) {
    result := fn(n)
    if result == expected {
        fmt.Printf("Test Case Passed: Result = %d, Expected = %d\n", result, expected)
    } else {
        fmt.Printf("Failed Test Case: Result = %d, Expected = %d\n", result, expected)
    }
}

func main() {
    if len(os.Args) != 3 {
        fmt.Fprintf(os.Stderr, "Usage: %s <n> <expected>\n", os.Args[0])
        os.Exit(1)
    }

    n, _ := strconv.Atoi(os.Args[1])
    expected, _ := strconv.Atoi(os.Args[2])

    Checker(Fibonacci, n, expected)
} 