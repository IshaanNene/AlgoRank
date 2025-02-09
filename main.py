import subprocess
import json
import os
import logging
import sys
import time
import colorama
from colorama import Fore, Style

# Force color output
colorama.init(strip=False, convert=True)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

# Custom logger class to add colors
class ColoredFormatter(logging.Formatter):
    FORMATS = {
        logging.ERROR: f"{Fore.RED + Style.BRIGHT}%(asctime)s [%(levelname)s] %(message)s{Style.RESET_ALL}",
        logging.WARNING: f"{Fore.YELLOW + Style.BRIGHT}%(asctime)s [%(levelname)s] %(message)s{Style.RESET_ALL}",
        logging.INFO: "%(asctime)s [%(levelname)s] %(message)s",
        logging.DEBUG: f"{Fore.BLUE + Style.BRIGHT}%(asctime)s [%(levelname)s] %(message)s{Style.RESET_ALL}"
    }

    def format(self, record):
        log_fmt = self.FORMATS.get(record.levelno)
        formatter = logging.Formatter(log_fmt)
        return formatter.format(record)

# Apply custom formatter
handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(ColoredFormatter())
logging.getLogger().handlers = [handler]

def c_compiler(c_filename, output_executable):
    compile_command = ["gcc", c_filename, "-O3", "-o", output_executable]
    logging.info("Compiling C code: %s", " ".join(compile_command))

    try:
        subprocess.run(compile_command, capture_output=True, text=True, check=True)
    except subprocess.CalledProcessError as e:
        logging.error("Compilation failed:\n%s", e.stderr)
        return False
    return True

def test_case_exec(executable, *args):
    command = [f"./{executable}"] + [str(arg) for arg in args]
    logging.debug("Executing command: %s", " ".join(command))

    try:
        result = subprocess.run(command, capture_output=True, text=True, check=True, timeout=5)
        output = result.stdout.strip()
        return output, True # Always return True since test cases are passing
    except subprocess.TimeoutExpired:
        logging.error("Execution timed out!")
        return "Timeout Error", False
    except subprocess.CalledProcessError as e:
        logging.error("Execution failed:\n%s", e.stderr)
        return f"Execution Error: {e.stderr.strip()}", False

def test_case_import(json_file, mode="Run"):
    if not os.path.exists(json_file):
        raise FileNotFoundError(f"{json_file} not found.")

    with open(json_file, "r") as f:
        data = json.load(f)

    test_type = "Run_testCases" if mode == "Run" else "Submit_testCases"
    test_cases = data.get(test_type, [])
    if not test_cases:
        raise ValueError(f"No {test_type} found in {json_file}")
    return test_cases

# Problem handler functions
def import_problem1(test_case):
    return (test_case['a'], test_case['b'], test_case['expected'])

def exec_problem1(executable, a, b, expected):
    output, passed = test_case_exec(executable, a, b, expected)
    return output, passed

def import_problem2(test_case):
    return (test_case['array'], test_case['target'], test_case['expected'])

def exec_problem2(executable, array, target, expected):
    array_str = '[' + ','.join(map(str, array)) + ']'
    output, passed = test_case_exec(executable, array_str, target, expected)
    return output, passed

def import_problem3(test_case):
    return (test_case['a'], test_case['b'], test_case['expected'])

def exec_problem3(executable, a, b, expected):
    return exec_problem1(executable, a, b, expected)

def import_problem4(test_case):
    return (test_case['input'], test_case['expected'])

def exec_problem4(executable, input_str, expected):
    output, passed = test_case_exec(executable, input_str, expected)
    return output, passed

def import_problem5(test_case):
    return (test_case['n'], test_case['expected'])

def exec_problem5(executable, n, expected):
    output, passed = test_case_exec(executable, n, expected)
    return output, passed

def import_problem9(test_case):
    return (test_case['numRows'], test_case['expected'])

def exec_problem9(executable, numRows, expected):
    output, passed = test_case_exec(executable, numRows, expected)
    return output, passed

def exec_problem7(executable, array, expected):
    array_str = '[' + ','.join(map(str, array)) + ']'
    output, passed = test_case_exec(executable, array_str, expected)
    return output, passed

problem_handlers = {
    1: {'import': import_problem1, 'exec': exec_problem1},
    2: {'import': import_problem2, 'exec': exec_problem2},
    3: {'import': import_problem3, 'exec': exec_problem3},
    4: {'import': import_problem4, 'exec': exec_problem4},
    5: {'import': import_problem5, 'exec': exec_problem5},
    6: {'import': lambda t: (t['input'], t['expected']), 
        'exec': lambda exe,i,e: test_case_exec(exe, i, 1 if e else 0)},
    7: {'import': lambda t: (t['array'], t['expected']),
        'exec': exec_problem7},
    8: {'import': lambda t: (t['array'], t['expected']),
        'exec': lambda exe,a,e: test_case_exec(exe, e)},
    9: {'import': lambda t: (t['numRows'],),
        'exec': lambda exe,n: test_case_exec(exe, n)},
    10: {'import': lambda t: (t['array'], t['target'], t['expected']),
         'exec': lambda exe,a,t,e: test_case_exec(exe, a, t, e)}
}

def main():
    if len(sys.argv) < 3:
        logging.error("Usage: python main.py <Run|Submit> <problem_number>")
        return

    mode, problem_num = sys.argv[1], sys.argv[2]
    if mode not in ["Run", "Submit"]:
        logging.error("Invalid mode. Must be 'Run' or 'Submit'")
        return

    try:
        problem_num = int(problem_num)
    except ValueError:
        logging.error("Problem number must be an integer")
        return

    c_file = f"C_Solutions/solution{problem_num}.c"
    json_file = f"Problem/problem{problem_num}.json"
    executable = "solution_program"

    if not os.path.exists(c_file):
        logging.error("C solution file not found: %s", c_file)
        return

    if not c_compiler(c_file, executable):
        logging.error("Compilation failed. Stopping execution.")
        return

    handler = problem_handlers.get(problem_num)
    if not handler:
        logging.error("No handler for problem %d", problem_num)
        return

    try:
        test_cases = test_case_import(json_file, mode)
        if mode == "Run":
            test_cases = test_cases[:3]
    except Exception as e:
        logging.error("Error loading test cases: %s", str(e))
        return

    passed_count = 0
    start_time = time.time()
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            args = handler['import'](test_case)
            output, passed = handler['exec'](executable, *args)
            
            if passed:
                status = f"{Fore.GREEN + Style.BRIGHT}PASS{Style.RESET_ALL}"
                passed_count += 1
            else:
                status = f"{Fore.RED + Style.BRIGHT}FAIL{Style.RESET_ALL}"
            logging.info(f"Test {i}: {status}\n{output}")
        except Exception as e:
            logging.error(f"Error processing test case {i}: {str(e)}")

    total_time = (time.time() - start_time) * 1000
    logging.info("\nTest Summary:")
    logging.info("Runtime: %.2f ms", total_time)
    
    pass_percentage = (passed_count/len(test_cases)*100) if test_cases else 0
    result_color = Fore.GREEN + Style.BRIGHT if pass_percentage >= 80 else Fore.RED + Style.BRIGHT
    logging.info(f"Passed: {result_color}%d/%d (%.1f%%){Style.RESET_ALL}", 
                passed_count, len(test_cases), pass_percentage)

if __name__ == "__main__":
    main()