#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include "json.hpp"
#include "starter_code.cpp"

using namespace std;
using json = nlohmann::json;

bool areEqual(vector<int> &a, vector<int> &b) {
    return a == b;
}

int main() {
    ifstream file("testcases.json");
    if (!file) {
        cerr << "❌ Failed to open testcases.json\n";
        return 1;
    }

    json testcases;
    file >> testcases;

    int passed = 0;
    int total = testcases["run"].size();

    for (int i = 0; i < total; ++i) {
        auto test = testcases["run"][i];
        vector<int> nums = test["input"]["nums"];
        int target = test["input"]["target"];
        vector<int> expected = test["output"];
        Solution sol;
        vector<int> result = sol.twoSum(nums, target);

        if (areEqual(result, expected)) {
            cout << "✅ Test " << (i + 1) << " passed\n";
            ++passed;
        } else {
            cout << "❌ Test " << (i + 1) << " failed\n";
            cout << "   Expected: ";
            for (int x : expected) cout << x << " ";
            cout << "\n   Got     : ";
            for (int x : result) cout << x << " ";
            cout << endl;
        }
    }

    cout << "\nSummary: " << passed << "/" << total << " tests passed.\n";
    return 0;
}

