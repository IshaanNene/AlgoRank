#include <iostream>
#include <string>
#include <vector>
#include <sstream>

// User input
void bubbleSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                std::swap(arr[j], arr[j + 1]);
            }
        }
    }
}
// End of user input

class Checker {
public:
    static void check(void (*func)(std::vector<int>&), 
                     std::vector<int>& arr, const std::vector<int>& expected) {
        func(arr);
        bool passed = (arr == expected);
        
        std::cout << (passed ? "Test Case Passed: " : "Failed Test Case: ");
        std::cout << "Result = [";
        for (size_t i = 0; i < arr.size(); i++) {
            std::cout << arr[i];
            if (i < arr.size() - 1) std::cout << ",";
        }
        std::cout << "], Expected = [";
        for (size_t i = 0; i < expected.size(); i++) {
            std::cout << expected[i];
            if (i < expected.size() - 1) std::cout << ",";
        }
        std::cout << "]" << std::endl;
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
    std::vector<int> expected = parseArray(argv[2]);

    Checker::check(bubbleSort, arr, expected);
    return 0;
} 