package main

import (
    "fmt"
    "os"
    "strconv"
    "strings"
    "unicode"
)

// IsPalindrome checks if a string is a palindrome
func IsPalindrome(s string) bool {
    s = strings.ToLower(s)
    left, right := 0, len(s)-1

    for left < right {
        for left < right && !unicode.IsLetter(rune(s[left])) && !unicode.IsNumber(rune(s[left])) {
            left++
        }
        for left < right && !unicode.IsLetter(rune(s[right])) && !unicode.IsNumber(rune(s[right])) {
            right--
        }
        if s[left] != s[right] {
            return false
        }
        left++
        right--
    }
    return true
}

// Checker verifies the solution
func Checker(fn func(string) bool, input string, expected bool) {
    result := fn(input)
    if result == expected {
        fmt.Printf("Test Case Passed: Result = %v, Expected = %v\n", result, expected)
    } else {
        fmt.Printf("Failed Test Case: Result = %v, Expected = %v\n", result, expected)
    }
}

func main() {
    if len(os.Args) != 3 {
        fmt.Fprintf(os.Stderr, "Usage: %s <string> <expected>\n", os.Args[0])
        os.Exit(1)
    }

    input := os.Args[1]
    expected, _ := strconv.ParseBool(os.Args[2])

    Checker(IsPalindrome, input, expected)
} 