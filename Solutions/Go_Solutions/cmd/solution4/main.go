package main

import (
    "fmt"
    "os"
)

// ReverseString reverses the input string
func ReverseString(s string) string {
    runes := []rune(s)
    for i, j := 0, len(runes)-1; i < j; i, j = i+1, j-1 {
        runes[i], runes[j] = runes[j], runes[i]
    }
    return string(runes)
}

// Checker verifies the solution
func Checker(fn func(string) string, input, expected string) {
    result := fn(input)
    if result == expected {
        fmt.Printf("Test Case Passed: Result = %s, Expected = %s\n", result, expected)
    } else {
        fmt.Printf("Failed Test Case: Result = %s, Expected = %s\n", result, expected)
    }
}

func main() {
    if len(os.Args) != 3 {
        fmt.Fprintf(os.Stderr, "Usage: %s <string> <expected>\n", os.Args[0])
        os.Exit(1)
    }

    input := os.Args[1]
    expected := os.Args[2]

    Checker(ReverseString, input, expected)
} 