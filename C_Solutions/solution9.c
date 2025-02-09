#include <stdio.h>
#include <stdlib.h>

int** generate(int numRows, int** returnColumnSizes) {
    if (numRows == 0) {
        *returnColumnSizes = NULL;
        return NULL;
    }

    int** triangle = (int**)malloc(numRows * sizeof(int*));
    *returnColumnSizes = (int*)malloc(numRows * sizeof(int));

    for (int i = 0; i < numRows; i++) {
        triangle[i] = (int*)malloc((i + 1) * sizeof(int));
        (*returnColumnSizes)[i] = i + 1; // Set the size of each row
        triangle[i][0] = triangle[i][i] = 1; // First and last elements are 1

        for (int j = 1; j < i; j++) {
            triangle[i][j] = triangle[i - 1][j - 1] + triangle[i - 1][j];
        }
    }
    return triangle;
}

void Checker(int** (*func)(int, int**), int numRows, int** expected) {
    int* returnColumnSizes;
    int** result = func(numRows, &returnColumnSizes);

    printf("Generated Pascal's Triangle:\n");
    for (int i = 0; i < numRows; i++) {
        for (int j = 0; j < returnColumnSizes[i]; j++) {
            printf("%d ", result[i][j]);
        }
        printf("\n");
    }
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <numRows>\n", argv[0]);
        return 1;
    }
    int numRows = atoi(argv[1]); // Example input
    int* returnColumnSizes;
    int** expected = NULL; // You can define expected output if needed
    Checker(generate, numRows, expected);
    return 0;
} 