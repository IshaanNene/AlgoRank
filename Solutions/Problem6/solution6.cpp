#include <iostream>
#include <string>
#include <cctype>

// User input
bool isPalindrome(const std::string& str) {
    int left = 0;
    int right = str.length() - 1;
    
    while (left < right) {
        while (left < right && !std::isalnum(str[left])) left++;
        while (left < right && !std::isalnum(str[right])) right--;
        
        if (std::tolower(str[left]) != std::tolower(str[right])) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}
// End of user input

class Checker {
public:
    static void check(bool (*func)(const std::string&), const std::string& input, bool expected) {
        bool result = func(input);
        if (result == expected) {
            std::cout << "Test Case Passed: Result = " << std::boolalpha << result 
                      << ", Expected = " << expected << std::endl;
        } else {
            std::cout << "Failed Test Case: Result = " << std::boolalpha << result 
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
    bool expected = (std::string(argv[2]) == "1" || std::string(argv[2]) == "true");

    Checker::check(isPalindrome, input, expected);
    return 0;
} 