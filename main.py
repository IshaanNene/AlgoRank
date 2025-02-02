import subprocess
import json
import os
import logging
import sys
import time

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

def compile_c_code(c_filename, output_executable):
    compile_command = ["gcc", "-O3", c_filename, "-o", output_executable]
    logging.info("Compiling the C code with command: %s", " ".join(compile_command))
    try:
        result = subprocess.run(compile_command, capture_output=True, text=True, check=True)
    except subprocess.CalledProcessError as e:
        logging.error("Compilation failed:\n%s", e.stderr)
        return False
    logging.info("Compilation successful.")
    return True

def run_test_case(executable, a, b, expected):
    command = [f"./{executable}", str(a), str(b), str(expected)]
    logging.debug("Running command: %s", " ".join(command))
    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True)
        output = result.stdout.strip()
    except subprocess.CalledProcessError as e:
        logging.error("Test case execution failed:\n%s", e.stderr)
        output = f"Execution error: {e.stderr}"
    return output

def load_test_cases(json_file):
    if not os.path.exists(json_file):
        raise FileNotFoundError(f"{json_file} not found.")
    with open(json_file, "r") as f:
        data = json.load(f)
    test_cases = data.get("testCases", [])
    if not test_cases:
        raise ValueError("No test cases found in the JSON file.")
    return test_cases

def main():
    c_filename = "same.c"
    output_executable = "program"
    json_file = "problem.json"
    if not compile_c_code(c_filename, output_executable):
        logging.error("Aborting further tests due to compilation error.")
        return
    try:
        test_cases = load_test_cases(json_file)
    except Exception as e:
        logging.error("Error loading test cases: %s", e)
        return
    g = time.time()
    for i, test in enumerate(test_cases, start=1):
        a = test["a"]
        b = test["b"]
        expected = test["expected"]
        logging.info("Running test case %d: a=%s, b=%s, expected=%s", i, a, b, expected)
        output = run_test_case(output_executable, a, b, expected)
        logging.info("Output: %s", output)
        logging.info("-" * 40)
    logging.info("RunTime: %.2f ms", (time.time() - g) * 1000)

if __name__ == "__main__":
    main()
