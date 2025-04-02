import requests
import json
import os
from typing import Dict, List, Any
import time

class IntegrationTester:
    def __init__(self):
        self.base_url = "http://localhost:8000"
        self.solutions_dir = "Solutions"
        self.supported_languages = ["c", "java", "go"]
        self.results: Dict[str, Dict[str, Any]] = {}

    def load_problem_json(self, problem_id: int) -> Dict:
        path = os.path.join(self.solutions_dir, f"Problem{problem_id}", f"problem{problem_id}.json")
        with open(path, 'r') as f:
            return json.load(f)

    def load_solution_file(self, problem_id: int, language: str) -> str:
        file_extensions = {
            "c": "c",
            "java": "java",
            "go": "go"
        }
        if language == "java":
            filename = f"Solution{problem_id}.java"
        elif language == "go":
            filename = "main.go"
        else:
            filename = f"solution{problem_id}.{file_extensions[language]}"
        
        path = os.path.join(self.solutions_dir, f"Problem{problem_id}", filename)
        with open(path, 'r') as f:
            content = f.read()
            # Fix Java class name
            if language == "java":
                content = content.replace(f"Solution{problem_id}", "Main")
            return content

    def test_problem(self, problem_id: int, language: str) -> Dict:
        print(f"\nTesting Problem {problem_id} with {language}...")
        
        # Load problem details and test cases
        problem_data = self.load_problem_json(problem_id)
        solution_code = self.load_solution_file(problem_id, language)
        
        # Get test cases
        test_cases = problem_data.get("Submit_testCases", [])[:5]  # Take first 5 test cases for brevity
        
        results = []
        for i, test_case in enumerate(test_cases):
            # Prepare inputs based on test case format
            inputs = []
            if isinstance(test_case, dict):
                if 'a' in test_case and 'b' in test_case:
                    inputs = [str(test_case['a']), str(test_case['b']), str(test_case['expected'])]
                elif 'array' in test_case:
                    # Convert array to string representation
                    array_str = json.dumps(test_case['array']).replace(" ", "")
                    inputs = [array_str, str(test_case['target']), str(test_case['expected'])]
            
            try:
                # Execute code
                response = requests.post(
                    f"{self.base_url}/execute",
                    json={
                        "code": solution_code,
                        "language": language,
                        "problem_id": problem_id,
                        "inputs": inputs
                    }
                )
                
                result = response.json()
                success = result.get("success", False)
                output = result.get("output", "")
                
                # Check if the output contains "Test Case Passed"
                if success and "Test Case Passed" in output:
                    success = True
                else:
                    success = False
                
                results.append({
                    "test_case": i + 1,
                    "inputs": inputs,
                    "output": output,
                    "success": success,
                    "execution_time": result.get("execution_time", 0),
                    "error": result.get("error_message")
                })
            except Exception as e:
                print(f"Error executing test case {i + 1}: {str(e)}")
                results.append({
                    "test_case": i + 1,
                    "inputs": inputs,
                    "output": "",
                    "success": False,
                    "execution_time": 0,
                    "error": str(e)
                })
            
            # Small delay between requests
            time.sleep(0.5)
        
        return {
            "problem_id": problem_id,
            "language": language,
            "test_cases": len(results),
            "successful_tests": sum(1 for r in results if r["success"]),
            "failed_tests": sum(1 for r in results if not r["success"]),
            "average_execution_time": sum(r["execution_time"] for r in results) / len(results) if results else 0,
            "detailed_results": results
        }

    def run_all_tests(self):
        for problem_id in range(1, 4):  # Test first 3 problems
            for language in self.supported_languages:
                try:
                    result = self.test_problem(problem_id, language)
                    key = f"problem{problem_id}_{language}"
                    self.results[key] = result
                except Exception as e:
                    print(f"Error testing Problem {problem_id} with {language}: {str(e)}")

    def print_summary(self):
        print("\n=== Integration Test Summary ===")
        for key, result in self.results.items():
            print(f"\n{key}:")
            print(f"Total test cases: {result['test_cases']}")
            print(f"Successful tests: {result['successful_tests']}")
            print(f"Failed tests: {result['failed_tests']}")
            print(f"Average execution time: {result['average_execution_time']:.4f}s")
            print("\nDetailed Results:")
            for test_result in result['detailed_results']:
                print(f"  Test Case {test_result['test_case']}:")
                print(f"    Inputs: {test_result['inputs']}")
                print(f"    Output: {test_result['output']}")
                print(f"    Success: {test_result['success']}")
                if test_result['error']:
                    print(f"    Error: {test_result['error']}")

if __name__ == "__main__":
    tester = IntegrationTester()
    tester.run_all_tests()
    tester.print_summary() 