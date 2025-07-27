#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include "json.hpp"
#include "starter_code.cpp" // includes Solution class and twoSum

using namespace std;
using json = nlohmann::json;

int main() {
    ifstream file("testcases.json");
    if (!file.is_open()) {
        cerr << "❌ Failed to open testcases.json" << endl;
        return 1;
    }

    json testcases;
    file >> testcases;

    if (!testcases.contains("test_cases_run") || testcases["test_cases_run"].empty()) {
        cerr << "❌ No testcases under 'test_cases_run' key in JSON.\n";
        return 1;
    }   

    Solution sol;
    int passed = 0, total = 0;

    for (const auto& tc : testcases["run"]) {
        vector<int> nums = tc["input"]["nums"];
        int target = tc["input"]["target"];
        vector<int> expected = tc["output"];

        vector<int> result = sol.twoSum(nums, target);
        total++;

        if (result == expected) {
            cout << "✅ Test " << total << " passed\n";
            passed++;
        } else {
            cout << "❌ Test " << total << " failed\n";
            cout << "   Expected: ";
            for (int n : expected) cout << n << " ";
            cout << "\n   Got     : ";
            for (int n : result) cout << n << " ";
            cout << "\n";
        }
    }

    cout << "\nSummary: " << passed << "/" << total << " tests passed.\n";
    return 0;
}
