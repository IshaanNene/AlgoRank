#include <iostream>
#include <string>
#include <algorithm>

// User input
void reverseString(std::string& str) {
    std::reverse(str.begin(), str.end());
}
// End of user input

class Checker {
public:
    static void check(void (*func)(std::string&), std::string input, const std::string& expected) {
        func(input);
        if (input == expected) {
            std::cout << "Test Case Passed: Result = " << input 
                      << ", Expected = " << expected << std::endl;
        } else {
            std::cout << "Failed Test Case: Result = " << input 
                      << ", Expected = " << expected << std::endl;
        }
    }
};

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <string> <expected>" << std::endl;
        return 1;
    }

    std::string input = argv[1];
    std::string expected = argv[2];

    Checker::check(reverseString, input, expected);
    return 0;
} 