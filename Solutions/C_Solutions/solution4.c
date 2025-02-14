#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void reverseString(char* str) {
    int n = strlen(str);
    for (int i = 0; i < n / 2; i++) {
        char temp = str[i];
        str[i] = str[n - i - 1];
        str[n - i - 1] = temp;
    }
}

void Checker(void (*func)(char*), char* input, char* expected) {
    func(input);
    if (strcmp(input, expected) == 0) {
        printf("Test Case Passed: Result = %s, Expected = %s\n", input, expected);
    } else {
        printf("Failed Test Case: Result = %s, Expected = %s\n", input, expected);
    }
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <string> <expected>\n", argv[0]);
        return 1;
    }
    char* str = argv[1];
    char* expected = argv[2];
    Checker(reverseString, str, expected);
    return 0;
} 