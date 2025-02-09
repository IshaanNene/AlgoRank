#include <iostream>
#include <string>

// User input
int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    
    int prev = 0, curr = 1;
    for (int i = 2; i <= n; i++) {
        int next = prev + curr;
        prev = curr;
        curr = next;
    }
    return curr;
}
// End of user input

class Checker {
public:
    static void check(int (*func)(int), int n, int expected) {
        int result = func(n);
        if (result == expected) {
            std::cout << "Test Case Passed: Result = " << result 
                      << ", Expected = " << expected << std::endl;
        } else {
            std::cout << "Failed Test Case: Result = " << result 
                      << ", Expected = " << expected << std::endl;
        }
    }
};

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <n> <expected>" << std::endl;
        return 1;
    }

    int n = std::stoi(argv[1]);
    int expected = std::stoi(argv[2]);

    Checker::check(fibonacci, n, expected);
    return 0;
} 