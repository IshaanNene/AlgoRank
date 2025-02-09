#include <iostream>
#include <string>
#include <vector>
#include <sstream>

// User input
std::vector<std::vector<int>> generatePascal(int numRows) {
    std::vector<std::vector<int>> triangle;
    if (numRows <= 0) return triangle;
    
    triangle.push_back({1}); // First row
    
    for (int i = 1; i < numRows; i++) {
        std::vector<int> row(i + 1, 1); // Initialize with 1s
        for (int j = 1; j < i; j++) {
            row[j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
        triangle.push_back(row);
    }
    return triangle;
}
// End of user input

class Checker {
public:
    static void check(std::vector<std::vector<int>> (*func)(int), 
                     int numRows, const std::vector<std::vector<int>>& expected) {
        auto result = func(numRows);
        bool passed = (result == expected);
        
        std::cout << (passed ? "Test Case Passed:\n" : "Failed Test Case:\n");
        std::cout << "Result = [\n";
        printTriangle(result);
        std::cout << "]\nExpected = [\n";
        printTriangle(expected);
        std::cout << "]" << std::endl;
    }

private:
    static void printTriangle(const std::vector<std::vector<int>>& triangle) {
        for (const auto& row : triangle) {
            std::cout << "  [";
            for (size_t i = 0; i < row.size(); i++) {
                std::cout << row[i];
                if (i < row.size() - 1) std::cout << ",";
            }
            std::cout << "]\n";
        }
    }
};

std::vector<std::vector<int>> parseTriangle(const std::string& str) {
    std::vector<std::vector<int>> triangle;
    std::string row;
    std::stringstream ss(str.substr(1, str.size() - 2)); // Remove outer [ ]
    
    while (std::getline(ss, row, ']')) {
        if (row.empty() || row == "[" || row == ",") continue;
        
        std::vector<int> nums;
        std::stringstream rowss(row.substr(row.find('[')+1));
        std::string num;
        
        while (std::getline(rowss, num, ',')) {
            if (!num.empty()) {
                nums.push_back(std::stoi(num));
            }
        }
        if (!nums.empty()) {
            triangle.push_back(nums);
        }
    }
    return triangle;
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <numRows> <expected>" << std::endl;
        return 1;
    }

    int numRows = std::stoi(argv[1]);
    std::vector<std::vector<int>> expected = parseTriangle(argv[2]);

    Checker::check(generatePascal, numRows, expected);
    return 0;
} 