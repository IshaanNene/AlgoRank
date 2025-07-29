import json
from concurrent.futures import ThreadPoolExecutor
from typing import Any, List
from starter_code import Solution
import sys

def are_equal(actual: Any, expected: Any) -> bool:
    if isinstance(actual, list) and isinstance(expected, list):
        return sorted(actual) == sorted(expected)
    return actual == expected

def run_test_case(solution: Solution, case: dict, idx: int) -> bool:
    try:
        result = getattr(solution, case["function_name"])(**case["input"])
        passed = are_equal(result, case["output"])
        print(f"Test {idx + 1}: {'✓' if passed else '✗'}")
        return passed
    except Exception as e:
        print(f"Test {idx + 1}: ✗ (Error: {str(e)})")
        return False

def main() -> None:
    try:
        with open("testcases.json", "r") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error loading test cases: {e}", file=sys.stderr)
        sys.exit(1)

    solution = Solution()
    run_tests = data.get("test_cases_run", [])
    
    with ThreadPoolExecutor() as executor:
        results = list(executor.map(
            lambda x: run_test_case(solution, x[1], x[0]), 
            enumerate(run_tests)
        ))
    
    passed = sum(results)
    print(f"\nSummary: {passed}/{len(run_tests)} tests passed")
    sys.exit(0 if passed == len(run_tests) else 1)

if __name__ == "__main__":
    main()