import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from typing import Any, Dict, List, NamedTuple
from colorama import init, Fore, Style
from starter_code import Solution

init()  # Initialize colorama for cross-platform colored output

class TestResult(NamedTuple):
    passed: bool
    error: str
    time_ms: float

def are_equal(actual: Any, expected: Any) -> bool:
    if isinstance(actual, list) and isinstance(expected, list):
        if len(actual) != len(expected):
            return False
        return sorted(actual) == sorted(expected)
    return actual == expected

def run_test_case(solution: Solution, case: Dict, func_name: str, idx: int) -> TestResult:
    start_time = time.time()
    try:
        # Get the function by name and call it
        func = getattr(solution, func_name)
        if not func:
            raise AttributeError(f"Function '{func_name}' not found in Solution class")
            
        # Call the function with the input
        if isinstance(case["input"], dict):
            result = func(**case["input"])
        else:
            result = func(case["input"])
        
        # Compare results
        passed = are_equal(result, case["output"])
        elapsed_ms = (time.time() - start_time) * 1000
        
        # Print result with color
        status = f"{Fore.GREEN}✓{Style.RESET_ALL}" if passed else f"{Fore.RED}✗{Style.RESET_ALL}"
        print(f"Test {idx+1:2d}: {status} ({elapsed_ms:.2f}ms)")
        
        return TestResult(passed, "", elapsed_ms)
        
    except Exception as e:
        elapsed_ms = (time.time() - start_time) * 1000
        print(f"Test {idx+1:2d}: {Fore.RED}✗{Style.RESET_ALL} (Error: {str(e)}) ({elapsed_ms:.2f}ms)")
        return TestResult(False, str(e), elapsed_ms)

def main() -> None:
    try:
        # Load test cases
        with open("testcases.json", "r") as f:
            data = json.load(f)
    except Exception as e:
        print(f"{Fore.RED}Error loading testcases.json: {e}{Style.RESET_ALL}", file=sys.stderr)
        sys.exit(1)

    func_name = data.get("function_name")
    test_cases = data.get("test_cases_run", [])
    
    print(f"\nRunning tests for function: {Fore.CYAN}{func_name}{Style.RESET_ALL}")
    print(f"Number of test cases: {len(test_cases)}\n")

    solution = Solution()
    total_start = time.time()
    
    # Run tests concurrently
    with ThreadPoolExecutor() as executor:
        futures = [
            executor.submit(run_test_case, solution, case, func_name, idx)
            for idx, case in enumerate(test_cases)
        ]
        
        # Collect results
        results = [future.result() for future in as_completed(futures)]
    
    # Calculate statistics
    total_time = (time.time() - total_start) * 1000
    passed = sum(1 for r in results if r.passed)
    avg_time = sum(r.time_ms for r in results) / len(results)
    
    # Print summary with colors
    print(f"\nSummary:")
    print(f"--------")
    print(f"Passed: {Fore.GREEN if passed == len(test_cases) else Fore.RED}"
          f"{passed}/{len(test_cases)} ({passed * 100.0 / len(test_cases):.1f}%)"
          f"{Style.RESET_ALL}")
    print(f"Total time: {total_time:.2f}ms")
    print(f"Average time per test: {avg_time:.2f}ms")

    sys.exit(0 if passed == len(test_cases) else 1)

if __name__ == "__main__":
    main()