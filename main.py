import subprocess
import json
import os
import logging
import sys
import time

# Logging setup
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)


# Function to compile the C file
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


# Function to execute the compiled C program with given inputs
def test_case_exec(executable, a, b, expected):
    command = [f"./{executable}", str(a), str(b), str(expected)]
    logging.debug("Executing command: %s", " ".join(command))

    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True, timeout=5)
        output = result.stdout.strip()
    except subprocess.TimeoutExpired:
        logging.error("Execution timed out!")
        return "Timeout Error"
    except subprocess.CalledProcessError as e:
        logging.error("Execution failed:\n%s", e.stderr)
        return f"Execution Error: {e.stderr.strip()}"

    return output


# Function to load test cases from JSON
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

    return test_cases


# Main function
def main(mode="Run"):
    c_filename = "same.c"  # The C program filename
    output_executable = "program"
    json_file = "problem.json"

    # Compile the C code
    if not c_compiler(c_filename, output_executable):
        logging.error("Compilation failed. Stopping execution.")
        return

    # Load test cases
    try:
        test_cases = test_case_import(json_file, mode)
    except Exception as e:
        logging.error("Error loading test cases: %s", e)
        return

    # Limit to 3 test cases for "Run" mode
    if mode == "Run":
        test_cases = test_cases[:3]

    start_time = time.time()

    # Execute test cases
    for i, test in enumerate(test_cases, start=1):
        a, b, expected = test["a"], test["b"], test["expected"]
        logging.info("Running test case %d: a=%s, b=%s, expected=%s", i, a, b, expected)

        output = test_case_exec(output_executable, a, b, expected)
        logging.info("Output: %s", output)
        logging.info("-" * 40)

    logging.info("Total Runtime: %.2f ms", (time.time() - start_time) * 1000)


# Entry point
if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "Run"  # Default mode is "Run"
    main(mode)
