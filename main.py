import subprocess,json,os,logging,sys,time,psutil,resource
from colorama import Fore, Style, init
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass, field
from enum import Enum

init(strip=False, convert=True)

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

    def compile(self, source_file: str, output_file: str) -> Tuple[bool, Optional[str]]:
        if self.language not in self.compile_commands:
            return False, "Unsupported language"

        command = self.compile_commands[self.language] + [source_file, "-o", output_file]
        
        try:
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=self.TIMEOUT
            )
            if result.returncode != 0:
                return False, result.stderr
            return True, None
        except subprocess.TimeoutExpired:
            return False, "Compilation timed out"
        except Exception as e:
            return False, str(e)

    def execute(self, executable: str, args: List[str]) -> ExecutionResult:
        start_time = time.time()
        process = None

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
            return ExecutionResult(
                output="",
                success=False,
                execution_time=self.TIMEOUT,
                memory_usage=0,
                cpu_usage=0,
                error_message="Execution timed out"
            )
        except Exception as e:
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

    def load_test_cases(self, mode: str) -> List[Dict]:
        json_file = f"Problem/problem{self.problem_id}.json"
        if not os.path.exists(json_file):
            raise FileNotFoundError(f"Problem file not found: {json_file}")

        with open(json_file) as f:
            data = json.load(f)

        test_type = f"{mode}_testCases"
        if test_type not in data:
            raise ValueError(f"No {test_type} found in problem file")

        return data[test_type]

    def run_tests(self, mode: str) -> TestMetrics:
        test_cases = self.load_test_cases(mode)
        if mode == "Run":
            test_cases = test_cases[:3]  

        source_file = f"AlgoRank/Solutions/{self.executor.language.value}_Solutions/solution{self.problem_id}{self.executor.file_extensions[self.executor.language]}"
        executable = f"solution_{self.problem_id}"

        success, error = self.executor.compile(source_file, executable)
        if not success:
            raise RuntimeError(f"Compilation failed: {error}")

        start_time = time.time()

        for i, test_case in enumerate(test_cases, 1):
            result = self.executor.execute(
                executable,
                [str(arg) for arg in test_case["input"]]
            )

            self.metrics.test_results.append(result)
            self.metrics.execution_times.append(result.execution_time)

            if result.success and result.output == str(test_case["expected"]):
                self.metrics.passed_count += 1
            else:
                self.metrics.failed_count += 1
                if result.error_message and "timeout" in result.error_message.lower():
                    self.metrics.timeouts += 1
                elif result.error_message:
                    self.metrics.errors += 1

            self.metrics.peak_memory = max(self.metrics.peak_memory, result.memory_usage)
            self.metrics.peak_cpu_usage = max(self.metrics.peak_cpu_usage, result.cpu_usage)

        self.metrics.total_time = (time.time() - start_time) * 1000
        self._update_test_statistics()
        return self.metrics

    def _update_test_statistics(self):
        if self.metrics.execution_times:
            min_time = min(self.metrics.execution_times)
            max_time = max(self.metrics.execution_times)
            self.metrics.fastest_test = self.metrics.execution_times.index(min_time) + 1
            self.metrics.slowest_test = self.metrics.execution_times.index(max_time) + 1

def main():
    if len(sys.argv) != 4:
        print("Usage: python main.py <Run|Submit> <problem_number> <language>")
        return

    mode, problem_id, lang = sys.argv[1], int(sys.argv[2]), sys.argv[3]
    
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
        print(json.dumps(result, indent=2))

    except Exception as e:
        error_result = {
            "status": "error",
            "message": str(e)
        }
        print(json.dumps(error_result, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()