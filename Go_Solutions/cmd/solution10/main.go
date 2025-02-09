package main

import (
    "fmt"
    "os"
    "strconv"
    "strings"
)

// BinarySearch performs binary search on a sorted array
func BinarySearch(nums []int, target int) int {
    left := 0
    right := len(nums) - 1
    
    for left <= right {
        mid := left + (right - left) / 2
        
        if nums[mid] == target {
            return mid
        }
        
        if nums[mid] < target {
            left = mid + 1
        } else {
            right = mid - 1
        }
    }
    return -1
}

// Checker verifies the solution
func Checker(fn func([]int, int) int, nums []int, target, expected int) {
    result := fn(nums, target)
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
    if len(os.Args) != 4 {
        fmt.Fprintf(os.Stderr, "Usage: %s <array> <target> <expected>\n", os.Args[0])
        os.Exit(1)
    }

    nums := parseArray(os.Args[1])
    target, _ := strconv.Atoi(os.Args[2])
    expected, _ := strconv.Atoi(os.Args[3])

    Checker(BinarySearch, nums, target, expected)
} 