#include <stdio.h>
#include <stdlib.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

void bubbleSort(int* arr, int size) {
    for (int i = 0; i < size - 1; i++) {
        for (int j = 0; j < size - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
            }
        }
    }
}

void Checker(void (*func)(int*, int), int* arr, int size, int* expected) {
    func(arr, size);
    printf("Sorted Array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <expected>\n", argv[0]);
        return 1;
    }
    int arr[] = {5, 3, 8, 1, 2}; // Example input
    int expected[] = {1, 2, 3, 5, 8}; // Expected output
    Checker(bubbleSort, arr, 5, expected);
    return 0;
} 