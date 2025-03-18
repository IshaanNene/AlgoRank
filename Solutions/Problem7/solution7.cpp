#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>

// User input
int findMax(const std::vector<int>& arr) {
    if (arr.empty()) {
        throw std::runtime_error("Array is empty");
    }
    return *std::max_element(arr.begin(), arr.end());
}
// End of user input

class Checker {
public:
    static void check(int (*func)(const std::vector<int>&), 
                     const std::vector<int>& arr, int expected) {
        int result = func(arr);
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
    std::vector<int> arr;
    std::stringstream ss(str.substr(1, str.size() - 2)); // Remove [ ]
    std::string item;
    
    while (std::getline(ss, item, ',')) {
        arr.push_back(std::stoi(item));
    }
    return arr;
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <array> <expected>" << std::endl;
        return 1;
    }

    std::vector<int> arr = parseArray(argv[1]);
    int expected = std::stoi(argv[2]);

    Checker::check(findMax, arr, expected);
    return 0;
} 