import subprocess, json, os, logging, sys, time, psutil, resource
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
from enum import Enum
import uvicorn

logging.basicConfig(level=logging.INFO)

class Language(str, Enum):
    C = "c"
    CPP = "cpp"
    JAVA = "java"
    GO = "go"
    RUST = "rust"

class CodeSubmission(BaseModel):
    code: str
    language: Language
    problem_id: int
    inputs: List[Any]

class ExecutionResult(BaseModel):
    output: str
    success: bool
    execution_time: float
    memory_usage: float
    error_message: Optional[str] = None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LANGUAGE_CONFIGS = {
    Language.C: {
        "file_ext": ".c",
        "compile_cmd": ["gcc", "-o", "{output}", "{source}"],
        "run_cmd": ["./{output}"]
    },
    Language.CPP: {
        "file_ext": ".cpp",
        "compile_cmd": ["g++", "-o", "{output}", "{source}"],
        "run_cmd": ["./{output}"]
    },
    Language.JAVA: {
        "file_ext": ".java",
        "compile_cmd": ["javac", "{source}"],
        "run_cmd": ["java", "-cp", "{dir}", "Main"]
    },
    Language.GO: {
        "file_ext": ".go",
        "compile_cmd": ["go", "build", "-o", "{output}", "{source}"],
        "run_cmd": ["./{output}"]
    },
    Language.RUST: {
        "file_ext": ".rs",
        "compile_cmd": ["rustc", "-o", "{output}", "{source}"],
        "run_cmd": ["./{output}"]
    }
}

def get_java_class_name(code: str) -> str:
    # Simple parser to extract public class name from Java code
    for line in code.split('\n'):
        if 'public class' in line:
            return line.split('public class')[1].split('{')[0].strip()
    return None

def compile_code(language: Language, source_path: str, output_path: str) -> Optional[str]:
    config = LANGUAGE_CONFIGS[language]
    cmd = [x.format(source=source_path, output=output_path,
           classname=os.path.splitext(os.path.basename(source_path))[0],
           dir=os.path.dirname(source_path))
           for x in config["compile_cmd"]]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            return result.stderr
        return None
    except Exception as e:
        return str(e)

def run_code(language: Language, output_path: str, inputs: List[Any], source_dir: str = None) -> ExecutionResult:
    config = LANGUAGE_CONFIGS[language]
    cmd = [x.format(output=output_path,
           classname=os.path.splitext(os.path.basename(output_path))[0],
           dir=source_dir or os.path.dirname(output_path))
           for x in config["run_cmd"]]
    
    start_time = time.time()
    try:
        process = subprocess.run(
            cmd + [str(x) for x in inputs],
            capture_output=True,
            text=True,
            timeout=5
        )
        execution_time = time.time() - start_time
        
        return ExecutionResult(
            output=process.stdout.strip(),
            success=process.returncode == 0,
            execution_time=execution_time,
            memory_usage=0,  # We'll implement memory tracking later
            error_message=process.stderr if process.returncode != 0 else None
        )
    except subprocess.TimeoutExpired:
        return ExecutionResult(
            output="",
            success=False,
            execution_time=5.0,
            memory_usage=0,
            error_message="Execution timed out"
        )
    except Exception as e:
        return ExecutionResult(
            output="",
            success=False,
            execution_time=time.time() - start_time,
            memory_usage=0,
            error_message=str(e)
        )

@app.post("/execute")
async def execute_code(submission: CodeSubmission) -> ExecutionResult:
    # Create directories if they don't exist
    solution_dir = f"Solutions/{submission.language.value.capitalize()}_Solutions"
    os.makedirs(solution_dir, exist_ok=True)
    
    # For Java, we need to match the file name with the class name
    if submission.language == Language.JAVA:
        class_name = get_java_class_name(submission.code)
        if not class_name:
            return ExecutionResult(
                output="",
                success=False,
                execution_time=0,
                memory_usage=0,
                error_message="Could not find public class name in Java code"
            )
        source_file = f"{class_name}.java"
    else:
        source_file = f"solution{submission.problem_id}{LANGUAGE_CONFIGS[submission.language]['file_ext']}"
    
    source_path = os.path.join(solution_dir, source_file)
    output_path = os.path.join(solution_dir, f"solution{submission.problem_id}")
    
    # Write code to file
    try:
        with open(source_path, "w") as f:
            f.write(submission.code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write code file: {str(e)}")
    
    # Compile code
    error = compile_code(submission.language, source_path, output_path)
    if error:
        return ExecutionResult(
            output="",
            success=False,
            execution_time=0,
            memory_usage=0,
            error_message=f"Compilation error: {error}"
        )
    
    # Run code
    result = run_code(submission.language, output_path, submission.inputs, solution_dir)
    
    # Clean up
    try:
        if os.path.exists(output_path) and submission.language != Language.JAVA:
            os.remove(output_path)
        if submission.language == Language.JAVA:
            class_file = os.path.join(solution_dir, f"{os.path.splitext(source_file)[0]}.class")
            if os.path.exists(class_file):
                os.remove(class_file)
    except:
        pass
    
    return result

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 