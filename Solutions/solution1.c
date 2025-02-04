#include <stdio.h>
#include <stdlib.h>
//USer input
int Sum(int a, int b) {
    return a + b;
}
//End of user input
void Checker(int (*Sum)(int, int), int Res, int u1, int u2) {
    if (Sum(u1, u2) == Res) {
        printf("Test Case Passed: %d + %d = %d\n", u1, u2, Res);
    } else {
        printf("Failed Test Case: %d + %d != %d\n", u1, u2, Res);
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
    Checker(Sum, expected, a, b);
    return 0;
}
