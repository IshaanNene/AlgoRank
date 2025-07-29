#include <iostream>
#include <fstream>
#include <vector>
#include <future>
#include <thread>
#include "json.hpp"
#include "starter_code.cpp"

using json = nlohmann::json;

template<typename T>
bool are_equal(const T& actual, const T& expected) {
    if constexpr (std::is_same_v<T, std::vector<int>>) {
        auto a = actual, b = expected;
        std::sort(a.begin(), a.end());
        std::sort(b.begin(), b.end());
        return a == b;
    }
    return actual == expected;
}

bool run_test(const Solution& solution, const json& test_case, size_t index) {
    try {
        auto result = solution.solve(test_case["input"]);
        bool passed = are_equal(result, test_case["output"]);
        std::cout << "Test " << index + 1 << ": " << (passed ? "✓" : "✗") << std::endl;
        return passed;
    } catch (const std::exception& e) {
        std::cout << "Test " << index + 1 << ": ✗ (Error: " << e.what() << ")" << std::endl;
        return false;
    }
}

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(nullptr);
    
    std::ifstream file("testcases.json");
    if (!file) {
        std::cerr << "Error: Cannot open testcases.json\n";
        return 1;
    }

    json test_data;
    file >> test_data;
    
    const auto& test_cases = test_data["test_cases_run"];
    Solution solution;
    
    std::vector<std::future<bool>> futures;
    for (size_t i = 0; i < test_cases.size(); ++i) {
        futures.push_back(
            std::async(std::launch::async, run_test, std::ref(solution), 
                      std::ref(test_cases[i]), i)
        );
    }

    size_t passed = 0;
    for (auto& f : futures) {
        passed += f.get();
    }

    std::cout << "\nSummary: " << passed << "/" << test_cases.size() 
              << " tests passed\n";
    return passed == test_cases.size() ? 0 : 1;
}