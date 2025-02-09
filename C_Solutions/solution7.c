#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int findMax(int* arr, int size) {
    int max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

void Checker(int (*func)(int*, int), int* arr, int size, int expected) {
    int result = func(arr, size);
    if (result == expected) {
        printf("Test Case Passed: Result = %d, Expected = %d\n", result, expected);
    } else {
        printf("Failed Test Case: Result = %d, Expected = %d\n", result, expected);
    }
}

int main(int argc, char *argv[]) {
    if (argc < 3) {
        fprintf(stderr, "Usage: %s <array> <expected>\n", argv[0]);
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

    int expected = atoi(argv[2]);
    Checker(findMax, arr, size, expected);
    return 0;
} 