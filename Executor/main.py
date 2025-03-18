from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from code_runner import CodeRunner
from pydantic import BaseModel
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
runner = CodeRunner()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeSubmission(BaseModel):
    code: str
    language: str
    problem_id: int
    mode: str  # 'run' or 'submit'

@app.post("/execute")
async def execute_code(submission: CodeSubmission):
    try:
        logger.info(f"Executing {submission.language} code for problem {submission.problem_id}")
        result = runner.run(
            code=submission.code,
            language=submission.language,
            problem_id=submission.problem_id,
            mode=submission.mode
        )
        return result
    except Exception as e:
        logger.error(f"Error executing code: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 