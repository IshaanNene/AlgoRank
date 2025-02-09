import subprocess
import json
import os
import logging
import sys
import time
from colorama import Fore, Style, init
from typing import Dict, List, Tuple
from dataclasses import dataclass

init(strip=False, convert=True)

@dataclass
class TestMetrics:
    total_time: float = 0.0
    execution_times: List[float] = None
    peak_memory: float = 0.0
    passed_count: int = 0
    failed_count: int = 0
    timeouts: int = 0
    errors: int = 0
    slowest_test: int = 0
    fastest_test: int = 0
    peak_cpu_usage: float = 0.0
    
    def __post_init__(self):
        self.execution_times = []

# Configure logging once at startup
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

class ColoredFormatter(logging.Formatter):
    FORMATS = {
        logging.ERROR: f"{Fore.RED + Style.BRIGHT}%(asctime)s [%(levelname)s] %(message)s{Style.RESET_ALL}",
        logging.WARNING: f"{Fore.YELLOW + Style.BRIGHT}%(asctime)s [%(levelname)s] %(message)s{Style.RESET_ALL}",
        logging.INFO: "%(asctime)s [%(levelname)s] %(message)s", 
        logging.DEBUG: f"{Fore.BLUE + Style.BRIGHT}%(asctime)s [%(levelname)s] %(message)s{Style.RESET_ALL}"
    }

    def format(self, record):
        return logging.Formatter(self.FORMATS.get(record.levelno)).format(record)

handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(ColoredFormatter())
logger.handlers = [handler]

def c_compiler(c_filename: str, output_executable: str) -> bool:
    compile_command = ["gcc", c_filename, "-O3", "-o", output_executable]
    logging.info("Compiling C code: %s", " ".join(compile_command))

    try:
        subprocess.run(compile_command, capture_output=True, text=True, check=True)
        return True
    except subprocess.CalledProcessError as e:
        logging.error("Compilation failed:\n%s", e.stderr)
        return False

def test_case_exec(executable: str, *args) -> tuple[str, bool]:
    command = [f"./{executable}"] + [str(arg) for arg in args]
    logging.debug("Executing command: %s", " ".join(command))

    try:
        start_time = time.time()
        result = subprocess.run(command, capture_output=True, text=True, check=True, timeout=5)
        execution_time = time.time() - start_time
        return result.stdout.strip(), True, execution_time
    except subprocess.TimeoutExpired:
        logging.error("Execution timed out!")
        return "Timeout Error", False, 5.0
    except subprocess.CalledProcessError as e:
        logging.error("Execution failed:\n%s", e.stderr)
        return f"Execution Error: {e.stderr.strip()}", False, 0.0

def test_case_import(json_file: str, mode: str = "Run") -> list:
    if not os.path.exists(json_file):
        raise FileNotFoundError(f"{json_file} not found.")

    with open(json_file) as f:
        data = json.load(f)

    test_type = "Run_testCases" if mode == "Run" else "Submit_testCases"
    test_cases = data.get(test_type)
    if not test_cases:
        raise ValueError(f"No {test_type} found in {json_file}")
    return test_cases

def array_to_str(array: list) -> str:
    return '[' + ','.join(map(str, array)) + ']'

def exec_with_array(executable: str, array: list, *args) -> tuple[str, bool, float]:
    return test_case_exec(executable, array_to_str(array), *args)

# Problem handler functions
problem_handlers = {
    1: {
        'import': lambda t: (t['a'], t['b'], t['expected']),
        'exec': test_case_exec
    },
    2: {
        'import': lambda t: (t['array'], t['target'], t['expected']),
        'exec': lambda exe, arr, target, expected: exec_with_array(exe, arr, target, expected)
    },
    3: {
        'import': lambda t: (t['a'], t['b'], t['expected']),
        'exec': test_case_exec
    },
    4: {
        'import': lambda t: (t['input'], t['expected']),
        'exec': test_case_exec
    },
    5: {
        'import': lambda t: (t['n'], t['expected']),
        'exec': test_case_exec
    },
    6: {
        'import': lambda t: (t['input'], t['expected']),
        'exec': lambda exe, i, e: test_case_exec(exe, i, 1 if e else 0)
    },
    7: {
        'import': lambda t: (t['array'], t['expected']),
        'exec': lambda exe, arr, expected: exec_with_array(exe, arr, expected)
    },
    8: {
        'import': lambda t: (t['array'], t['expected']),
        'exec': lambda exe, arr, e: test_case_exec(exe, e)
    },
    9: {
        'import': lambda t: (t['numRows'],),
        'exec': test_case_exec
    },
    10: {
        'import': lambda t: (t['array'], t['target'], t['expected']),
        'exec': test_case_exec
    }
}

def print_metrics(metrics: TestMetrics, mode: str):
    logging.info(f"\n{mode} Test Summary:")
    logging.info("Total Runtime: %.2f ms", metrics.total_time)
    logging.info("Fastest Test Case: #%d (%.2f ms)", metrics.fastest_test, min(metrics.execution_times) * 1000)
    logging.info("Slowest Test Case: #%d (%.2f ms)", metrics.slowest_test, max(metrics.execution_times) * 1000)
    logging.info("Peak Memory Usage: %.2f MB", metrics.peak_memory)
    logging.info("Peak CPU Usage: %.1f%%", metrics.peak_cpu_usage)
    logging.info("Timeouts: %d", metrics.timeouts)
    logging.info("Errors: %d", metrics.errors)
    
    pass_percentage = (metrics.passed_count/(metrics.passed_count + metrics.failed_count)*100) if (metrics.passed_count + metrics.failed_count) > 0 else 0
    result_color = Fore.GREEN + Style.BRIGHT if pass_percentage >= 80 else Fore.RED + Style.BRIGHT
    logging.info(f"Passed: {result_color}%d/%d (%.1f%%){Style.RESET_ALL}", 
                metrics.passed_count, metrics.passed_count + metrics.failed_count, pass_percentage)

def main():
    if len(sys.argv) < 3:
        logging.error("Usage: python main.py <Run|Submit> <problem_number>")
        return

    mode, problem_num = sys.argv[1], sys.argv[2]
    if mode not in {"Run", "Submit"}:
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

    metrics = TestMetrics()
    start_time = time.time()

    for i, test_case in enumerate(test_cases, 1):
        try:
            args = handler['import'](test_case)
            output, passed, exec_time = handler['exec'](executable, *args)
            
            metrics.execution_times.append(exec_time)
            if passed:
                metrics.passed_count += 1
            else:
                metrics.failed_count += 1
                if "Timeout Error" in output:
                    metrics.timeouts += 1
                elif "Execution Error" in output:
                    metrics.errors += 1
            
            # Track fastest/slowest tests
            if exec_time == min(metrics.execution_times):
                metrics.fastest_test = i
            if exec_time == max(metrics.execution_times):
                metrics.slowest_test = i
                
            # Get resource usage
            try:
                process = subprocess.check_output(['ps', '-p', str(os.getpid()), '-o', '%cpu,%mem']).decode().split('\n')[1].split()
                cpu_usage = float(process[0])
                memory = float(process[1])
                metrics.peak_cpu_usage = max(metrics.peak_cpu_usage, cpu_usage)
                metrics.peak_memory = max(metrics.peak_memory, memory)
            except:
                pass
                
            status = f"{Fore.GREEN + Style.BRIGHT}PASS{Style.RESET_ALL}" if passed else f"{Fore.RED + Style.BRIGHT}FAIL{Style.RESET_ALL}"
            logging.info(f"Test {i}: {status} (%.2f ms)\n%s", exec_time * 1000, output)
            
        except Exception as e:
            logging.error(f"Error processing test case {i}: {str(e)}")
            metrics.errors += 1

    metrics.total_time = (time.time() - start_time) * 1000
    print_metrics(metrics, mode)

if __name__ == "__main__":
    main()