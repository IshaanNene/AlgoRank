package main

import (
    "fmt"
    "os"
    "strconv"
    "strings"
)

// FindMax finds the maximum element in an array
func FindMax(arr []int) int {
    if len(arr) == 0 {
        panic("Array is empty")
    }
    
    max := arr[0]
    for _, num := range arr[1:] {
        if num > max {
            max = num
        }
    }
    return max
}

// Checker verifies the solution
func Checker(fn func([]int) int, arr []int, expected int) {
    result := fn(arr)
    if result == expected {
        fmt.Printf("Test Case Passed: Result = %d, Expected = %d\n", result, expected)
    } else {
        fmt.Printf("Failed Test Case: Result = %d, Expected = %d\n", result, expected)
    }
}

func parseArray(input string) []int {
    // Remove brackets and split by comma
    input = strings.Trim(input, "[]")
    strNums := strings.Split(input, ",")
    nums := make([]int, len(strNums))
    
    for i, s := range strNums {
        nums[i], _ = strconv.Atoi(s)
    }
    return nums
}

func main() {
    if len(os.Args) != 3 {
        fmt.Fprintf(os.Stderr, "Usage: %s <array> <expected>\n", os.Args[0])
        os.Exit(1)
    }

    arr := parseArray(os.Args[1])
    expected, _ := strconv.Atoi(os.Args[2])

    Checker(FindMax, arr, expected)
} 