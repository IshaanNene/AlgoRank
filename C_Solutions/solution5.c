#include <stdio.h>
#include <stdlib.h>

int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

void Checker(int (*func)(int), int input, int expected) {
    int result = func(input);
    if (result == expected) {
        printf("Test Case Passed: Result = %d, Expected = %d\n", result, expected);
    } else {
        printf("Failed Test Case: Result = %d, Expected = %d\n", result, expected);
    }
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <n> <expected>\n", argv[0]);
        return 1;
    }
    int n = atoi(argv[1]);
    int expected = atoi(argv[2]);
    Checker(fibonacci, n, expected);
    return 0;
} 