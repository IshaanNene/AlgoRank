import subprocess
import json
import os
import logging
import sys
import time

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

def c_compiler(c_filename, output_executable):
    compile_command = ["gcc", c_filename, "-O3", "-o", output_executable]
    logging.info("Compiling C code: %s", " ".join(compile_command))

    try:
        subprocess.run(compile_command, capture_output=True, text=True, check=True)
    except subprocess.CalledProcessError as e:
        logging.error("Compilation failed:\n%s", e.stderr)
        return False

    logging.info("Compilation successful.")
    return True

def test_case_exec(executable, a, b, expected):
    command = [f"./{executable}", str(a), str(b), str(expected)]
    logging.debug("Executing command: %s", " ".join(command))

    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True, timeout=5)
        output = result.stdout.strip()
        return output, "Test Case Passed" in output
    except subprocess.TimeoutExpired:
        logging.error("Execution timed out!")
        return "Timeout Error", False
    except subprocess.CalledProcessError as e:
        logging.error("Execution failed:\n%s", e.stderr)
        return f"Execution Error: {e.stderr.strip()}", False

def test_case_import(json_file, mode="Run"):
    if not os.path.exists(json_file):
        raise FileNotFoundError(f"{json_file} not found.")

    try:
        with open(json_file, "r") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        logging.error("JSON decoding error: %s", e)
        return []

    test_cases = data.get("Run_testCases" if mode == "Run" else "Submit_testCases", [])
    if not test_cases:
        raise ValueError(f"No test cases found for mode: {mode}")
    logging.debug("First test case structure: %s", test_cases[0] if test_cases else "No test cases")
    return test_cases 
def main():
    if len(sys.argv) < 3:
        logging.error("Usage: python main.py <mode> <problem_number>")
        logging.error("mode: Run or Submit")
        return
        
    mode = sys.argv[1]
    if mode not in ["Run", "Submit"]:
        logging.error("Invalid mode. Must be 'Run' or 'Submit'")
        return
        
    try:
        problem_num = int(sys.argv[2])
    except ValueError:
        logging.error("Problem number must be an integer")
        return
        
    c_filename = f"Solutions/solution{problem_num}.c"
    test_case_count = 0
    passed_count = 0
    output_executable = "program"
    json_file = f"Problem/problem{problem_num}.json"

    if not c_compiler(c_filename, output_executable):
        logging.error("Compilation failed. Stopping execution.")
        return  # Ensure to return if compilation fails

    test_cases = test_case_import(json_file, mode)  # Import test cases here

    if mode == "Run":
        test_cases = test_cases[:3]  # Limit to first 3 test cases
        for i, test in enumerate(test_cases, start=1):
            test_case_count += 1
            try:
                a, b, expected = test.get("a"), test.get("b"), test.get("expected")
                if any(v is None for v in (a, b, expected)):
                    logging.error("Test case %d is missing required fields. Test case structure: %s", i, test)
                    continue
                
                logging.info("Running test case %d: a=%s, b=%s, expected=%s", i, a, b, expected)
                output, passed = test_case_exec(output_executable, b, a, expected)
                if passed:
                    passed_count += 1
                logging.info("Output: %s", output)
                logging.info("-" * 40)
            except Exception as e:
                logging.error("Error processing test case %d: %s", i, e)
                continue
    elif mode == "Submit":
        start_time = time.time()
        for i, test in enumerate(test_cases, start=1):
            test_case_count += 1
            try:
                a, b, expected = test.get("a"), test.get("b"), test.get("expected")
                if any(v is None for v in (a, b, expected)):
                    logging.error("Test case %d is missing required fields. Test case structure: %s", i, test)
                    continue
                
                logging.info("Running test case %d: a=%s, b=%s, expected=%s", i, a, b, expected)
                output, passed = test_case_exec(output_executable, a, b, expected)
                if passed:
                    passed_count += 1
                logging.info("Output: %s", output)
                logging.info("-" * 40)
            except Exception as e:
                logging.error("Error processing test case %d: %s", i, e)
                continue
        logging.info("Total Runtime: %.2f ms", (time.time() - start_time) * 1000)
        logging.info("Number of TestCases: %d", test_case_count)
        logging.info("Passed TestCases: %d/%d (%.1f%%)", passed_count, test_case_count, (passed_count/test_case_count*100) if test_case_count > 0 else 0)
if __name__ == "__main__":
    main()