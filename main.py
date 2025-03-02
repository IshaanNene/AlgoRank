import subprocess, json, os, logging, sys, time, psutil, resource
from colorama import Fore, Style, init
from typing import Dict, List, Tuple, Optional, Any
from dataclasses import dataclass, field
from enum import Enum
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

init(strip=False, convert=True)
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class Language(Enum):
    C = "C"
    CPP = "CPP"
    JAVA = "Java"
    GO = "Go"
    RUST = "Rust"

@dataclass
class ExecutionResult:
    output: str
    success: bool
    execution_time: float
    memory_usage: float
    cpu_usage: float
    error_message: Optional[str] = None

@dataclass
class TestMetrics:
    total_time: float = 0.0
    execution_times: List[float] = field(default_factory=list)
    peak_memory: float = 0.0
    passed_count: int = 0
    failed_count: int = 0
    timeouts: int = 0
    errors: int = 0
    slowest_test: int = 0
    fastest_test: int = 0
    peak_cpu_usage: float = 0.0
    test_results: List[ExecutionResult] = field(default_factory=list)

class CodeExecutor:
    TIMEOUT = 5
    MEMORY_LIMIT = 256 * 1024 * 1024
    CPU_LIMIT = 0.5

    def __init__(self, language: Language):
        self.language = language
        self.compile_commands = {
            Language.C: ["gcc", "-O3", "-march=native", "-Wall", "-fopenmp", "-flto"],
            Language.CPP: ["g++", "-O3", "-march=native", "-Wall", "-std=c++17", "-fopenmp", "-flto"],
            Language.JAVA: ["javac", "-Xlint:all", "-g:none"],
            Language.GO: ["go", "build", "-ldflags", "-s -w -extldflags '-static'"],
            Language.RUST: ["rustc", "--release", "--emit=exe"]
        }
        self.file_extensions = {
            Language.C: ".c",
            Language.CPP: ".cpp",
            Language.JAVA: ".java",
            Language.GO: ".go",
            Language.RUST: ".rs"
        }
        logging.info("Initialized CodeExecutor for language: %s", self.language.value)

    def compile(self, source_file: str, output_file: str) -> Tuple[bool, Optional[str]]:
        if self.language not in self.compile_commands:
            logging.error("Unsupported language for compilation: %s", self.language.value)
            return False, "Unsupported language"

        command = self.compile_commands[self.language] + [source_file, "-o", output_file]
        logging.info("Compiling %s to %s with command: %s", source_file, output_file, ' '.join(command))
        
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=self.TIMEOUT
            )
            if result.returncode != 0:
                logging.error("Compilation failed for %s with error: %s", source_file, result.stderr)
                return False, result.stderr
            logging.info("Compilation successful for %s", source_file)
            return True, None
        except subprocess.TimeoutExpired:
            logging.error("Compilation timed out for %s", source_file)
            return False, "Compilation timed out"
        except Exception as e:
            logging.exception("Unexpected error during compilation of %s", source_file)
            return False, str(e)

    def execute(self, executable: str, args: List[str]) -> ExecutionResult:
        start_time = time.time()
        process = None

        logging.info("Executing %s with arguments: %s", executable, args)
        try:
            process = subprocess.Popen(
                [f"./{executable}"] + args,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                preexec_fn=self._set_process_limits
            )

            stdout, stderr = process.communicate(timeout=self.TIMEOUT)
            execution_time = time.time() - start_time

            if process.returncode != 0:
                logging.error("Execution of %s failed with error: %s", executable, stderr)
                return ExecutionResult(
                    output="",
                    success=False,
                    execution_time=execution_time,
                    memory_usage=0,
                    cpu_usage=0,
                    error_message=stderr
                )

            process_info = psutil.Process(process.pid)
            memory_usage = process_info.memory_info().rss
            cpu_usage = process_info.cpu_percent()

            logging.info("Execution of %s completed successfully in %.2f seconds", executable, execution_time)
            return ExecutionResult(
                output=stdout.strip(),
                success=True,
                execution_time=execution_time,
                memory_usage=memory_usage,
                cpu_usage=cpu_usage
            )

        except subprocess.TimeoutExpired:
            if process:
                process.kill()
            logging.error("Execution of %s timed out after %s seconds", executable, self.TIMEOUT)
            return ExecutionResult(
                output="",
                success=False,
                execution_time=self.TIMEOUT,
                memory_usage=0,
                cpu_usage=0,
                error_message="Execution timed out"
            )
        except Exception as e:
            logging.exception("Unexpected error during execution of %s", executable)
            return ExecutionResult(
                output="",
                success=False,
                execution_time=0,
                memory_usage=0,
                cpu_usage=0,
                error_message=str(e)
            )

    def _set_process_limits(self):
        resource.setrlimit(resource.RLIMIT_AS, (self.MEMORY_LIMIT, self.MEMORY_LIMIT))
        resource.setrlimit(resource.RLIMIT_CPU, (self.CPU_LIMIT, self.CPU_LIMIT))

class TestRunner:
    def __init__(self, problem_id: int, language: Language):
        self.problem_id = problem_id
        self.executor = CodeExecutor(language)
        self.metrics = TestMetrics()
        logging.info("Initialized TestRunner for problem ID: %d with language: %s", self.problem_id, language.value)

    def load_test_cases(self, mode: str) -> List[Dict]:
        json_file = f"Problem/problem{self.problem_id}.json"
        logging.info("Loading test cases from %s for mode: %s", json_file, mode)
        if not os.path.exists(json_file):
            logging.error("Problem file not found: %s", json_file)
            raise FileNotFoundError(f"Problem file not found: {json_file}")

        with open(json_file) as f:
            data = json.load(f)

        test_type = f"{mode}_testCases"
        if test_type not in data:
            logging.error("No %s found in problem file", test_type)
            raise ValueError(f"No {test_type} found in problem file")

        return data[test_type]

    def run_tests(self, mode: str) -> TestMetrics:
        logging.info("Starting test run for problem ID: %d in mode: %s", self.problem_id, mode)
        test_cases = self.load_test_cases(mode)
        if mode == "Run":
            test_cases = test_cases[:3]
            logging.info("Limited to %d test cases for mode Run", len(test_cases))

        source_file = f"AlgoRank/Solutions/{self.executor.language.value}_Solutions/solution{self.problem_id}{self.executor.file_extensions[self.executor.language]}"
        executable = f"solution_{self.problem_id}"

        success, error = self.executor.compile(source_file, executable)
        if not success:
            logging.error("Compilation failed: %s", error)
            raise RuntimeError(f"Compilation failed: {error}")

        start_time = time.time()

        for i, test_case in enumerate(test_cases, 1):
            logging.info("Running test %d with input: %s and expected output: %s", i, test_case["input"], test_case["expected"])
            result = self.executor.execute(
                executable,
                [str(arg) for arg in test_case["input"]]
            )

            self.metrics.test_results.append(result)
            self.metrics.execution_times.append(result.execution_time)

            if result.success and result.output == str(test_case["expected"]):
                self.metrics.passed_count += 1
                logging.info("Test %d passed", i)
            else:
                self.metrics.failed_count += 1
                logging.error("Test %d failed - Expected: %s, Got: %s", i, test_case["expected"], result.output)
                if result.error_message and "timeout" in result.error_message.lower():
                    self.metrics.timeouts += 1
                elif result.error_message:
                    self.metrics.errors += 1

            self.metrics.peak_memory = max(self.metrics.peak_memory, result.memory_usage)
            self.metrics.peak_cpu_usage = max(self.metrics.peak_cpu_usage, result.cpu_usage)

        self.metrics.total_time = (time.time() - start_time) * 1000
        logging.info("Completed all tests in %.2f ms", self.metrics.total_time)
        self._update_test_statistics()
        return self.metrics

    def _update_test_statistics(self):
        if self.metrics.execution_times:
            min_time = min(self.metrics.execution_times)
            max_time = max(self.metrics.execution_times)
            self.metrics.fastest_test = self.metrics.execution_times.index(min_time) + 1
            self.metrics.slowest_test = self.metrics.execution_times.index(max_time) + 1
            logging.info("Fastest test: %d, Slowest test: %d", self.metrics.fastest_test, self.metrics.slowest_test)

# New API models
class TestCase(BaseModel):
    input: Any
    expected: Any

class Problem(BaseModel):
    problem_num: int
    problem_name: str
    difficulty: str
    description: str
    Expected_Time_Constraints: str
    Expected_Space_Constraints: str
    Run_testCases: List[TestCase]
    Submit_testCases: List[TestCase]

class CodeSubmission(BaseModel):
    code: str
    language: str

# Initialize FastAPI
app = FastAPI(
    title="AlgoRank Executor",
    description="Code execution service for AlgoRank",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add a health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# API Routes
@app.get("/api/problems")
async def get_problems():
    problems = []
    problem_dir = 'Problem'
    for filename in os.listdir(problem_dir):
        if filename.endswith('.json'):
            with open(os.path.join(problem_dir, filename), 'r') as f:
                problem = json.load(f)
                problems.append(problem)
    return problems

@app.get("/api/problems/{problem_id}")
async def get_problem(problem_id: int):
    try:
        with open(f'Problem/problem{problem_id}.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Problem not found")

@app.post("/api/problems/{problem_id}/run")
async def run_test_case(problem_id: int, submission: CodeSubmission):
    try:
        # Save the submission
        lang = submission.language.upper()
        if lang not in [l.name for l in Language]:
            raise HTTPException(status_code=400, detail="Unsupported language")

        language = Language[lang]
        solution_path = f"AlgoRank/Solutions/{language.value}_Solutions/temp_{problem_id}{CodeExecutor(language).file_extensions[language]}"
        
        # Save the code
        os.makedirs(os.path.dirname(solution_path), exist_ok=True)
        with open(solution_path, "w") as f:
            f.write(submission.code)

        # Run tests
        runner = TestRunner(problem_id, language)
        metrics = runner.run_tests("Run")

        return {
            "status": "success",
            "metrics": {
                "total_time_ms": metrics.total_time,
                "passed_count": metrics.passed_count,
                "failed_count": metrics.failed_count,
                "timeouts": metrics.timeouts,
                "errors": metrics.errors,
                "peak_memory_mb": metrics.peak_memory / (1024 * 1024),
                "peak_cpu_percent": metrics.peak_cpu_usage,
                "test_results": [
                    {
                        "success": result.success,
                        "execution_time_ms": result.execution_time * 1000,
                        "output": result.output,
                        "error": result.error_message
                    }
                    for result in metrics.test_results
                ]
            }
        }
    except Exception as e:
        logging.exception("Error running test case")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/problems/{problem_id}/submit")
async def submit_solution(problem_id: int, submission: CodeSubmission):
    try:
        # Similar to run_test_case but uses the permanent solution path
        lang = submission.language.upper()
        if lang not in [l.name for l in Language]:
            raise HTTPException(status_code=400, detail="Unsupported language")

        language = Language[lang]
        solution_path = f"AlgoRank/Solutions/{language.value}_Solutions/solution_{problem_id}{CodeExecutor(language).file_extensions[language]}"
        
        # Save the code
        os.makedirs(os.path.dirname(solution_path), exist_ok=True)
        with open(solution_path, "w") as f:
            f.write(submission.code)

        # Run tests
        runner = TestRunner(problem_id, language)
        metrics = runner.run_tests("Submit")

        return {
            "status": "success",
            "metrics": {
                "total_time_ms": metrics.total_time,
                "passed_count": metrics.passed_count,
                "failed_count": metrics.failed_count,
                "timeouts": metrics.timeouts,
                "errors": metrics.errors,
                "peak_memory_mb": metrics.peak_memory / (1024 * 1024),
                "peak_cpu_percent": metrics.peak_cpu_usage,
                "test_results": [
                    {
                        "success": result.success,
                        "execution_time_ms": result.execution_time * 1000,
                        "output": result.output,
                        "error": result.error_message
                    }
                    for result in metrics.test_results
                ]
            }
        }
    except Exception as e:
        logging.exception("Error submitting solution")
        raise HTTPException(status_code=500, detail=str(e))

# Main function
def main():
    if len(sys.argv) > 1:
        # Handle CLI mode
        if len(sys.argv) != 4:
            print("Usage: python main.py <Run|Submit> <problem_number> <language>")
            logging.error("Invalid number of arguments provided")
            return

        mode, problem_id, lang = sys.argv[1], int(sys.argv[2]), sys.argv[3]
        logging.info("Starting main with mode: %s, problem_id: %d, language: %s", mode, problem_id, lang)
        
        try:
            # Update language handling to be case-insensitive
            language_map = {
                "c": Language.C,
                "cpp": Language.CPP,
                "java": Language.JAVA,
                "go": Language.GO,
                "rust": Language.RUST
            }
            
            if lang.lower() not in language_map:
                logging.error("Unsupported language: %s", lang)
                raise ValueError(f"Unsupported language: {lang}")
                
            language = language_map[lang.lower()]
            runner = TestRunner(problem_id, language)
            metrics = runner.run_tests(mode)
            
            result = {
                "status": "success",
                "metrics": {
                    "total_time_ms": metrics.total_time,
                    "passed_count": metrics.passed_count,
                    "failed_count": metrics.failed_count,
                    "timeouts": metrics.timeouts,
                    "errors": metrics.errors,
                    "peak_memory_mb": metrics.peak_memory / (1024 * 1024),
                    "peak_cpu_percent": metrics.peak_cpu_usage,
                    "fastest_test": metrics.fastest_test,
                    "slowest_test": metrics.slowest_test,
                    "test_results": [
                        {
                            "success": result.success,
                            "execution_time_ms": result.execution_time * 1000,
                            "output": result.output,
                            "error": result.error_message
                        }
                        for result in metrics.test_results
                    ]
                }
            }
            logging.info("Test run successful for problem ID: %d", problem_id)
            print(json.dumps(result, indent=2))

        except Exception as e:
            logging.exception("An error occurred during test execution")
            error_result = {
                "status": "error",
                "message": str(e)
            }
            print(json.dumps(error_result, indent=2))
            sys.exit(1)

    else:
        # Start FastAPI server
        logging.info("Starting FastAPI server")
        uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()