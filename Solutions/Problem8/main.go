package main

import (
    "fmt"
    "os"
    "strconv"
    "strings"
)

// BubbleSort sorts the array in ascending order
func BubbleSort(arr []int) {
    n := len(arr)
    for i := 0; i < n-1; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
}

// Checker verifies the solution
func Checker(fn func([]int), arr []int, expected []int) {
    fn(arr)
    passed := true
    if len(arr) != len(expected) {
        passed = false
    } else {
        for i := range arr {
            if arr[i] != expected[i] {
                passed = false
                break
            }
        }
    }
    
    if passed {
        fmt.Printf("Test Case Passed: Result = %v, Expected = %v\n", arr, expected)
    } else {
        fmt.Printf("Failed Test Case: Result = %v, Expected = %v\n", arr, expected)
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
    expected := parseArray(os.Args[2])

    Checker(BubbleSort, arr, expected)
} 