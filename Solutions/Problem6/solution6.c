#include <stdio.h>
#include <string.h>
#include <ctype.h>
#include <stdlib.h>

int isPalindrome(char* str) {
    int left = 0;
    int right = strlen(str) - 1;

    while (left < right) {
        while (left < right && !isalnum(str[left])) left++;
        while (left < right && !isalnum(str[right])) right--;
        if (tolower(str[left]) != tolower(str[right])) return 0;
        left++;
        right--;
    }
    return 1;
}

void Checker(int (*func)(char*), char* input, int expected) {
    int result = func(input);
    if (result == expected) {
        printf("Test Case Passed: Result = %d, Expected = %d\n", result, expected);
    } else {
        printf("Failed Test Case: Result = %d, Expected = %d\n", result, expected);
    }
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <string> <expected>\n", argv[0]);
        return 1;
    }
    char* str = argv[1];
    int expected = atoi(argv[2]);
    Checker(isPalindrome, str, expected);
    return 0;
} 