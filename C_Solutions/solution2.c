#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//User input
int search(int* nums, int numsSize, int target) {
    int left = 0;
    int right = numsSize - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        }
        
        if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}
//End of user input

void Checker(int (*search)(int*, int, int), int* nums, int size, int target, int expected) {
    int result = search(nums, size, target);
    if (result == expected) {
        printf("Test Case Passed: Result = %d, Expected = %d\n", result, expected);
    } else {
        printf("Failed Test Case: Result = %d, Expected = %d\n", result, expected);
    }
}

int* parseArray(const char* str, int* size) {
    int capacity = 10;
    int* nums = (int*)malloc(capacity * sizeof(int));
    *size = 0;

    const char* ptr = strchr(str, '[');
    if (!ptr) return nums;
    ptr++;
    
    while (*ptr) {
        if (*ptr == ']') break;
        
        if (*ptr >= '0' && *ptr <= '9' || *ptr == '-') {
            if (*size >= capacity) {
                capacity *= 2;
                nums = (int*)realloc(nums, capacity * sizeof(int));
            }
            nums[*size] = atoi(ptr);
            (*size)++;
            
            while (*ptr && *ptr != ',' && *ptr != ']') ptr++;
        } else {
            ptr++;
        }
    }
    
    return nums;
}

int main(int argc, char *argv[]) {
    if (argc != 4) {
        fprintf(stderr, "Usage: %s <array> <target> <expected>\n", argv[0]);
        return 1;
    }
    
    int size;
    int* nums = parseArray(argv[1], &size);
    int target = atoi(argv[2]);
    int expected = atoi(argv[3]);
    
    Checker(search, nums, size, target, expected);
    
    free(nums);
    return 0;
}