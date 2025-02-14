#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int binarySearch(int* arr, int size, int target) {
    int left = 0;
    int right = size - 1;

    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1; // Target not found
}

void Checker(int (*func)(int*, int, int), int* arr, int size, int target, int expected) {
    int result = func(arr, size, target);
    if (result == expected) {
        printf("Test Case Passed: Result = %d, Expected = %d\n", result, expected);
    } else {
        printf("Failed Test Case: Result = %d, Expected = %d\n", result, expected);
    }
}

int main(int argc, char *argv[]) {
    if (argc < 4) {
        fprintf(stderr, "Usage: %s <array> <target> <expected>\n", argv[0]);
        return 1;
    }

    // Parse array from string format [1,2,3,4,5]
    char *array_str = argv[1];
    array_str++; // Skip first '['
    int arr[100]; // Assuming max array size of 100
    int size = 0;
    
    char *token = strtok(array_str, ",]");
    while (token != NULL && size < 100) {
        arr[size++] = atoi(token);
        token = strtok(NULL, ",]");
    }

    int target = atoi(argv[2]);
    int expected = atoi(argv[3]);
    Checker(binarySearch, arr, size, target, expected);
    return 0;
} 