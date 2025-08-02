#include <iostream>
#include <fstream>
#include <vector>
#include <future>
#include <chrono>
#include <iomanip>
#include <cstdlib>
#include <sstream>
#include <algorithm>
#include <type_traits>
#include <string>
#include "json.hpp"
#include "starter_code.cpp"

using json = nlohmann::json;
using namespace std::chrono;

struct TestResult {
    bool passed;
    std::string error;
    double timeMs;

    TestResult(bool p = false, const std::string& e = "", double t = 0.0)
        : passed(p), error(e), timeMs(t) {}
};

// Enhanced are_equal function with better formatting and type support
template<typename T>
std::string format_value(const T& value) {
    if constexpr (std::is_arithmetic_v<T>) {
        return std::to_string(value);
    } else if constexpr (std::is_same_v<T, std::string>) {
        return "\"" + value + "\"";
    } else {
        std::ostringstream oss;
        oss << value;
        return oss.str();
    }
}

template<typename Container>
std::string format_container(const Container& container, const std::string& name = "") {
    std::ostringstream oss;
    if (!name.empty()) oss << name << ": ";
    oss << "[";
    
    bool first = true;
    for (const auto& item : container) {
        if (!first) oss << ", ";
        // Check if this is a nested container (2D vector)
        if constexpr (std::is_same_v<typename Container::value_type, std::vector<int>> ||
                      std::is_same_v<typename Container::value_type, std::vector<double>> ||
                      std::is_same_v<typename Container::value_type, std::vector<long>>) {
            oss << format_container(item);
        } else {
            oss << format_value(item);
        }
        first = false;
    }
    oss << "]";
    return oss.str();
}

template<typename T>
bool are_equal(const T& actual, const T& expected, bool verbose = false) {
    bool result = false;
    
    // Handle different vector types with sorting
    if constexpr (std::is_same_v<T, std::vector<int>> || 
                  std::is_same_v<T, std::vector<long>> ||
                  std::is_same_v<T, std::vector<long long>> ||
                  std::is_same_v<T, std::vector<double>> ||
                  std::is_same_v<T, std::vector<float>>) {
        
        if (actual.size() != expected.size()) {
            result = false;
        } else {
            auto a = actual;
            auto b = expected;
            std::sort(a.begin(), a.end());
            std::sort(b.begin(), b.end());
            result = (a == b);
        }
        
        if (!result && verbose) {
            std::cout << "    " << format_container(expected, "Expected") << "\n";
            std::cout << "    " << format_container(actual, "Got     ") << "\n";
            if (actual.size() != expected.size()) {
                std::cout << "    Size mismatch: expected " << expected.size() 
                         << ", got " << actual.size() << "\n";
            }
            
            // Show sorted versions for comparison
            auto a_sorted = actual, b_sorted = expected;
            std::sort(a_sorted.begin(), a_sorted.end());
            std::sort(b_sorted.begin(), b_sorted.end());
            if (a_sorted != actual || b_sorted != expected) {
                std::cout << "    " << format_container(b_sorted, "Expected (sorted)") << "\n";
                std::cout << "    " << format_container(a_sorted, "Got      (sorted)") << "\n";
            }
        }
        
    } 
    // Handle 2D vectors
    else if constexpr (std::is_same_v<T, std::vector<std::vector<int>>> ||
                       std::is_same_v<T, std::vector<std::vector<double>>> ||
                       std::is_same_v<T, std::vector<std::vector<long>>>) {
        
        if (actual.size() != expected.size()) {
            result = false;
        } else {
            result = true;
            for (size_t i = 0; i < actual.size() && result; ++i) {
                if (actual[i].size() != expected[i].size()) {
                    result = false;
                } else {
                    auto a_row = actual[i];
                    auto b_row = expected[i];
                    std::sort(a_row.begin(), a_row.end());
                    std::sort(b_row.begin(), b_row.end());
                    if (a_row != b_row) {
                        result = false;
                    }
                }
            }
        }
        
        if (!result && verbose) {
            std::cout << "    Expected 2D vector:\n";
            for (size_t i = 0; i < expected.size(); ++i) {
                std::cout << "      [" << i << "]: " << format_container(expected[i]) << "\n";
            }
            std::cout << "    Got 2D vector:\n";
            for (size_t i = 0; i < actual.size(); ++i) {
                std::cout << "      [" << i << "]: " << format_container(actual[i]) << "\n";
            }
            
            // Show which specific rows differ
            if (actual.size() == expected.size()) {
                for (size_t i = 0; i < actual.size(); ++i) {
                    auto a_row = actual[i], b_row = expected[i];
                    std::sort(a_row.begin(), a_row.end());
                    std::sort(b_row.begin(), b_row.end());
                    if (a_row != b_row) {
                        std::cout << "    Row " << i << " differs after sorting\n";
                    }
                }
            }
        }
    }
    // Handle regular types
    else {
        result = (actual == expected);
        
        if (!result && verbose) {
            std::cout << "    Expected: " << format_value(expected) << "\n";
            std::cout << "    Got     : " << format_value(actual) << "\n";
            
            // For string comparisons, show character differences
            if constexpr (std::is_same_v<T, std::string>) {
                if (actual.length() != expected.length()) {
                    std::cout << "    Length mismatch: expected " << expected.length() 
                             << ", got " << actual.length() << "\n";
                }
                // Show first difference
                size_t min_len = std::min(actual.length(), expected.length());
                for (size_t i = 0; i < min_len; ++i) {
                    if (actual[i] != expected[i]) {
                        std::cout << "    First difference at position " << i 
                                 << ": expected '" << expected[i] 
                                 << "', got '" << actual[i] << "'\n";
                        break;
                    }
                }
            }
        }
    }
    
    return result;
}

// Floating point comparison with tolerance
template<typename T>
bool are_equal_approx(const T& actual, const T& expected, double tolerance = 1e-9, bool verbose = false) {
    static_assert(std::is_floating_point_v<T>, "are_equal_approx only works with floating point types");
    
    bool result = std::abs(actual - expected) <= tolerance;
    
    if (!result && verbose) {
        std::cout << "    Expected: " << std::fixed << std::setprecision(10) << expected << "\n";
        std::cout << "    Got     : " << std::fixed << std::setprecision(10) << actual << "\n";
        std::cout << "    Diff    : " << std::abs(actual - expected) 
                  << " (tolerance: " << tolerance << ")\n";
    }
    
    return result;
}

template<typename T>
T convert_input(const json& input) {
    return input.get<T>();
}

TestResult run_test(Solution& solution, const json& test_case, size_t index, bool verbose = false) {
    auto start = high_resolution_clock::now();
    
    try {
        auto& input = test_case["input"];
        auto& output = test_case["output"];

        // Convert input and store in variables to allow reference binding
        auto nums = convert_input<std::vector<int>>(input["nums"]);
        auto target = input["target"].get<int>();
        
        auto result = solution.twoSum(nums, target);

        bool passed = are_equal(result, output.get<std::vector<int>>(), verbose);

        auto end = high_resolution_clock::now();
        double timeMs = duration_cast<microseconds>(end - start).count() / 1000.0;

        std::cout << "Test " << std::setw(3) << index + 1 << ": "
                  << (passed ? "\033[32m✓\033[0m" : "\033[31m✗\033[0m")
                  << " (" << std::fixed << std::setprecision(2) << timeMs << "ms)";
        
        if (!passed && verbose) {
            std::cout << "\n    Input:    nums=" << format_container(nums) 
                      << ", target=" << target << "\n";
        } else if (!passed) {
            std::cout << " [Use VERBOSE=1 to see details]";
        }
        
        std::cout << "\n";

        return {passed, "", timeMs};

    } catch (const std::exception& e) {
        auto end = high_resolution_clock::now();
        double timeMs = duration_cast<microseconds>(end - start).count() / 1000.0;

        std::cout << "Test " << std::setw(3) << index + 1 << ": \033[31m✗\033[0m"
                  << " (Error: " << e.what() << ") "
                  << "(" << std::fixed << std::setprecision(2) << timeMs << "ms)\n";

        return {false, e.what(), timeMs};
    }
}

void print_performance_stats(const std::vector<TestResult>& results, double total_elapsed) {
    if (results.empty()) return;
    
    // Calculate statistics
    double min_time = results[0].timeMs;
    double max_time = results[0].timeMs;
    double sum_time = 0.0;
    
    for (const auto& result : results) {
        min_time = std::min(min_time, result.timeMs);
        max_time = std::max(max_time, result.timeMs);
        sum_time += result.timeMs;
    }
    
    double avg_time = sum_time / results.size();
    
    std::cout << "\nPerformance Stats:"
              << "\n-----------------"
              << "\nMin time:     " << std::fixed << std::setprecision(2) << min_time << "ms"
              << "\nMax time:     " << max_time << "ms"
              << "\nAverage time: " << avg_time << "ms"
              << "\nTotal time:   " << total_elapsed << "ms\n";
}

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(nullptr);

    try {
        std::ifstream file("testcases.json");
        if (!file) throw std::runtime_error("Cannot open testcases.json");

        std::stringstream buffer;
        buffer << file.rdbuf();
        json test_data = json::parse(buffer.str());

        // Environment configuration
        const char* mode_env = std::getenv("RUN_MODE");
        const char* verbose_env = std::getenv("VERBOSE");
        const char* parallel_env = std::getenv("PARALLEL");
        
        std::string run_mode = mode_env ? mode_env : "run";
        bool verbose = verbose_env && std::string(verbose_env) == "1";
        bool parallel = !parallel_env || std::string(parallel_env) != "0"; // Default to parallel
        
        // Auto-enable verbose mode for failed tests in submit mode
        bool show_failures = verbose || (run_mode == "submit");

        std::string field = (run_mode == "submit") ? "test_cases_submit" : "test_cases_run";
        
        std::cout << "🚀 Test Runner Configuration:"
                  << "\n   Mode: " << run_mode
                  << "\n   Field: " << field
                  << "\n   Verbose: " << (verbose ? "ON" : "OFF")
                  << "\n   Show Failures: " << (show_failures ? "ON" : "OFF")
                  << "\n   Parallel: " << (parallel ? "ON" : "OFF") << "\n";

        if (!test_data.contains(field) || !test_data[field].is_array() || test_data[field].empty()) {
            std::cerr << "❌ No valid test cases found under '" << field << "'.\n";
            return 1;
        }

        const auto& test_cases = test_data[field];
        std::cout << "\n📝 Problem: " << test_data.value("problem_name", "Unknown")
                  << "\n📊 Test cases: " << test_cases.size() << "\n\n";

        Solution solution;
        auto total_start = high_resolution_clock::now();

        std::vector<TestResult> results;
        
        if (parallel && test_cases.size() > 1) {
            // Note: Parallel execution disabled due to non-const method calls
            // Each thread would need its own Solution instance for thread safety
            std::cout << "⚠️  Parallel execution disabled (using serial mode for thread safety)\n";
            for (size_t i = 0; i < test_cases.size(); ++i) {
                results.push_back(run_test(solution, test_cases[i], i, show_failures));
            }
        } else {
            // Serial execution (better for debugging)
            for (size_t i = 0; i < test_cases.size(); ++i) {
                results.push_back(run_test(solution, test_cases[i], i, show_failures));
            }
        }

        auto total_end = high_resolution_clock::now();
        double total_elapsed = duration_cast<microseconds>(total_end - total_start).count() / 1000.0;

        // Calculate results
        size_t passed = 0;
        for (const auto& result : results) {
            passed += result.passed;
        }

        // Print summary
        std::cout << "\n" << std::string(50, '=');
        std::cout << "\n📈 Test Summary:"
                  << "\n   Passed: " << passed << "/" << test_cases.size()
                  << " (" << std::fixed << std::setprecision(1) << (passed * 100.0 / test_cases.size()) << "%)"
                  << "\n   Status: " << (passed == test_cases.size() ? "\033[32mALL PASSED ✓\033[0m" : "\033[31mSOME FAILED ✗\033[0m");

        print_performance_stats(results, total_elapsed);
        std::cout << std::string(50, '=') << "\n";

        return passed == test_cases.size() ? 0 : 1;

    } catch (const json::parse_error& e) {
        std::cerr << "❌ JSON Parse Error: " << e.what() << std::endl;
        return 1;
    } catch (const std::exception& e) {
        std::cerr << "❌ Error: " << e.what() << std::endl;
        return 1;
    }
}
