#include <iostream>
#include <string>
#include <vector>
#include <sstream>

// User input
int binarySearch(const std::vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
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
// End of user input

class Checker {
public:
    static void check(int (*func)(const std::vector<int>&, int), 
                     const std::vector<int>& nums, int target, int expected) {
        int result = func(nums, target);
        if (result == expected) {
            std::cout << "Test Case Passed: Result = " << result 
                      << ", Expected = " << expected << std::endl;
        } else {
            std::cout << "Failed Test Case: Result = " << result 
                      << ", Expected = " << expected << std::endl;
        }
    }
};

std::vector<int> parseArray(const std::string& str) {
    std::vector<int> nums;
    std::stringstream ss(str.substr(1, str.size() - 2)); // Remove [ ]
    std::string item;
    
    while (std::getline(ss, item, ',')) {
        nums.push_back(std::stoi(item));
    }
    return nums;
}

int main(int argc, char* argv[]) {
    if (argc != 4) {
        std::cerr << "Usage: " << argv[0] << " <array> <target> <expected>" << std::endl;
        return 1;
    }

    std::vector<int> nums = parseArray(argv[1]);
    int target = std::stoi(argv[2]);
    int expected = std::stoi(argv[3]);

    Checker::check(binarySearch, nums, target, expected);
    return 0;
} 