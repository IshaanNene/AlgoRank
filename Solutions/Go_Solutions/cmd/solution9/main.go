package main

import (
    "fmt"
    "os"
    "strconv"
    "strings"
)

// GeneratePascal generates Pascal's triangle up to numRows
func GeneratePascal(numRows int) [][]int {
    if numRows <= 0 {
        return [][]int{}
    }
    
    triangle := make([][]int, numRows)
    triangle[0] = []int{1} // First row
    
    for i := 1; i < numRows; i++ {
        row := make([]int, i+1)
        row[0], row[i] = 1, 1 // First and last elements are 1
        
        for j := 1; j < i; j++ {
            row[j] = triangle[i-1][j-1] + triangle[i-1][j]
        }
        triangle[i] = row
    }
    return triangle
}

// Checker verifies the solution
func Checker(fn func(int) [][]int, numRows int, expected [][]int) {
    result := fn(numRows)
    passed := true
    
    if len(result) != len(expected) {
        passed = false
    } else {
        for i := range result {
            if len(result[i]) != len(expected[i]) {
                passed = false
                break
            }
            for j := range result[i] {
                if result[i][j] != expected[i][j] {
                    passed = false
                    break
                }
            }
        }
    }
    
    if passed {
        fmt.Printf("Test Case Passed:\nResult = %v\nExpected = %v\n", result, expected)
    } else {
        fmt.Printf("Failed Test Case:\nResult = %v\nExpected = %v\n", result, expected)
    }
}

func parseTriangle(input string) [][]int {
    input = strings.Trim(input, "[]")
    rows := strings.Split(input, "],[")
    triangle := make([][]int, len(rows))
    
    for i, row := range rows {
        row = strings.Trim(row, "[]")
        if row == "" {
            continue
        }
        nums := strings.Split(row, ",")
        triangle[i] = make([]int, len(nums))
        for j, num := range nums {
            triangle[i][j], _ = strconv.Atoi(num)
        }
    }
    return triangle
}

func main() {
    if len(os.Args) != 3 {
        fmt.Fprintf(os.Stderr, "Usage: %s <numRows> <expected>\n", os.Args[0])
        os.Exit(1)
    }

    numRows, _ := strconv.Atoi(os.Args[1])
    expected := parseTriangle(os.Args[2])

    Checker(GeneratePascal, numRows, expected)
} 