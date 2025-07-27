#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include "json.hpp"
#include "starter_code.cpp" 
using json = nlohmann::json;
using namespace std;

int main() {
    ifstream file("testcases.json");
    if (!file.is_open()) {
        cerr << "❌ Failed to open testcases.json" << endl;
        return 1;
    }

    json testcases;
    file >> testcases;

    Solution sol;

    for (const auto& tc : testcases["run"]) {
        vector<int> nums = tc["input"]["nums"];
        int target = tc["input"]["target"];
        vector<int> expected = tc["output"];

        vector<int> result = sol.twoSum(nums, target);

        if (result == expected) {
            cout << "✅ Passed\n";
        } else {
            cout << "❌ Failed\nExpected: ";
            for (int x : expected) cout << x << " ";
            cout << "\nGot: ";
            for (int x : result) cout << x << " ";
            cout << "\n\n";
        }
    }

    return 0;
}
