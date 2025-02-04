#include <stdio.h>
#include <stdlib.h>

//User input
int findMax(int a, int b) {
    return (a > b) ? a : b;
}
//End of user input

void Checker(int (*findMax)(int, int), int a, int b, int expected) {
    int result = findMax(a, b);
    if (result == expected) {
        printf("Test Case Passed: Result = %d, Expected = %d\n", result, expected);
    } else {
        printf("Failed Test Case: Result = %d, Expected = %d\n", result, expected);
    }
}

int main(int argc, char *argv[]) {
    if (argc != 4) {  
        fprintf(stderr, "Usage: %s <a> <b> <expected>\n", argv[0]);
        return 1;
    }
    
    int a = atoi(argv[1]);
    int b = atoi(argv[2]);
    int expected = atoi(argv[3]);
    
    Checker(findMax, a, b, expected);
    return 0;
}
