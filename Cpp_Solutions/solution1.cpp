#include <iostream>
#include <string>

// User input
int Sum(int a, int b) {
    return a + b;
}
// End of user input

class Checker {
public:
    static void check(int (*func)(int, int), int a, int b, int expected) {
        int result = func(a, b);
        if (result == expected) {
            std::cout << "Test Case Passed: " << a << " + " << b << " = " << expected << std::endl;
        } else {
            std::cout << "Failed Test Case: " << a << " + " << b << " != " << expected << std::endl;
        }
    }
};

int main(int argc, char* argv[]) {
    if (argc != 4) {
        std::cerr << "Usage: " << argv[0] << " <a> <b> <expected>" << std::endl;
        return 1;
    }

    int a = std::stoi(argv[1]);
    int b = std::stoi(argv[2]);
    int expected = std::stoi(argv[3]);

    Checker::check(Sum, a, b, expected);
    return 0;
} 