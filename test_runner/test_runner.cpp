#include <iostream>
#include <fstream>
#include <vector>
#include <future>
#include <chrono>
#include <iomanip>
#include "json.hpp"
#include "starter_code.cpp"

using json = nlohmann::json;
using namespace std::chrono;

struct TestResult {
    bool passed;
    std::string error;
    double timeMs;
};

template<typename T>
bool are_equal(const T& actual, const T& expected) {
    if constexpr (std::is_same_v<T, std::vector<int>>) {
        if (actual.size() != expected.size()) return false;
        auto a = actual, b = expected;
        std::sort(a.begin(), a.end());
        std::sort(b.begin(), b.end());
        return a == b;
    }
    return actual == expected;
}

TestResult run_test(const Solution& solution, const json& test_case, const std::string& func_name, size_t index) {
    auto start = high_resolution_clock::now();
    try {
        auto& input = test_case["input"];
        std::variant<std::vector<int>, bool, int, std::string> result;

        // Call appropriate function based on name
        if (func_name == "twoSum") {
            result = solution.twoSum(input["nums"].get<std::vector<int>>(), input["target"].get<int>());
        } else if (func_name == "isAnagram") {
            result = solution.isAnagram(input["s"].get<std::string>(), input["t"].get<std::string>());
        } else if (func_name == "groupAnagrams") {
            result = solution.groupAnagrams(input.get<std::vector<std::string>>());
        } else if (func_name == "topKFrequent") {
            result = solution.topKFrequent(input["nums"].get<std::vector<int>>(), input["k"].get<int>());
        } else if (func_name == "isValid") {
            result = solution.isValid(input["s"].get<std::string>());
        } else if (func_name == "lengthOfLongestSubstring") {
            result = solution.lengthOfLongestSubstring(input["s"].get<std::string>());
        } else if (func_name == "isPalindrome") {
            result = solution.isPalindrome(input["s"].get<std::string>());
        } else if (func_name == "reverseWords") {
            result = solution.reverseWords(input["s"].get<std::string>());
        } else if (func_name == "firstUniqChar") {
            result = solution.firstUniqChar(input["s"].get<std::string>());
        } else if (func_name == "findDuplicates") {
            result = solution.findDuplicates(input.get<std::vector<int>>());
        } else {
            throw std::runtime_error("Unknown function: " + func_name);
        }

        bool passed = std::visit([&](auto&& arg) {
            return are_equal(arg, test_case["output"].get<std::decay_t<decltype(arg)>>());
        }, result);

        auto end = high_resolution_clock::now();
        double timeMs = duration_cast<microseconds>(end - start).count() / 1000.0;

        std::cout << "Test " << std::setw(2) << index + 1 << ": " 
                 << (passed ? "\033[32m✓\033[0m" : "\033[31m✗\033[0m")
                 << " (" << std::fixed << std::setprecision(2) << timeMs << "ms)\n";

        return {passed, "", timeMs};
    } catch (const std::exception& e) {
        auto end = high_resolution_clock::now();
        double timeMs = duration_cast<microseconds>(end - start).count() / 1000.0;

        std::cout << "Test " << std::setw(2) << index + 1 << ": \033[31m✗\033[0m"
                 << " (Error: " << e.what() << ") "
                 << "(" << std::fixed << std::setprecision(2) << timeMs << "ms)\n";

        return {false, e.what(), timeMs};
    }
}

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(nullptr);
    
    try {
        std::ifstream file("testcases.json");
        if (!file) {
            throw std::runtime_error("Cannot open testcases.json");
        }

        json test_data;
        file >> test_data;
        
        const auto& test_cases = test_data["test_cases_run"];
        const std::string& func_name = test_data["function_name"].get<std::string>();
        
        std::cout << "\nRunning tests for function: " << func_name << "\n";
        std::cout << "Number of test cases: " << test_cases.size() << "\n\n";

        auto total_start = high_resolution_clock::now();
        Solution solution;
        
        std::vector<std::future<TestResult>> futures;
        for (size_t i = 0; i < test_cases.size(); ++i) {
            futures.push_back(
                std::async(std::launch::async, run_test, std::ref(solution), 
                          std::ref(test_cases[i]), std::ref(func_name), i)
            );
        }

        size_t passed = 0;
        double total_time = 0;
        std::vector<TestResult> results;
        
        for (auto& f : futures) {
            auto result = f.get();
            passed += result.passed;
            total_time += result.timeMs;
            results.push_back(result);
        }

        auto total_end = high_resolution_clock::now();
        double total_elapsed = duration_cast<microseconds>(total_end - total_start).count() / 1000.0;

        std::cout << "\nSummary:"
                  << "\n--------"
                  << "\nPassed: " << passed << "/" << test_cases.size()
                  << " (" << (passed * 100.0 / test_cases.size()) << "%)"
                  << "\nTotal time: " << std::fixed << std::setprecision(2) << total_elapsed << "ms"
                  << "\nAverage time per test: " << (total_time / test_cases.size()) << "ms\n";

        return passed == test_cases.size() ? 0 : 1;

    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }
}