import json
import sys
import traceback
from starter_code import Solution

def are_equal(a, b):
    if isinstance(a, list) and isinstance(b, list):
        return a == b
    return a == b

def main():
    try:
        with open("testcases.json", "r") as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ Failed to read testcases.json: {e}")
        sys.exit(1)

    run_tests = data.get("run", [])
    passed = 0

    for idx, case in enumerate(run_tests):
        try:
            # Customize per problem
            nums = case["input"]["nums"]
            target = case["input"]["target"]
            expected = case["output"]

            sol = Solution()
            result = sol.twoSum(nums, target)

            if are_equal(result, expected):
                print(f"✅ Test {idx+1} passed")
                passed += 1
            else:
                print(f"❌ Test {idx+1} failed")
                print(f"   Expected: {expected}")
                print(f"   Got     : {result}")

        except Exception as e:
            print(f"❌ Test {idx+1} crashed: {e}")
            traceback.print_exc()

    print(f"\nSummary: {passed}/{len(run_tests)} tests passed.")

if __name__ == "__main__":
    main()

