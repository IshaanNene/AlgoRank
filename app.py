from flask import Flask, render_template, request, jsonify
import subprocess
import time
import os
import uuid
import json

app = Flask(__name__)

with open('problem/problem1.json', 'r') as f:
    problem_data = json.load(f)

@app.route('/')
def index():
    return render_template('index.html', problem=problem_data)

@app.route('/compile_run', methods=['POST'])
def compile_run():
    code = request.form.get('code', '').strip()

    if not code:
        return jsonify({"status": "error", "message": "Code cannot be empty!"})
    test_cases = problem_data.get('test_cases', [])

    if not test_cases:
        return jsonify({"status": "error", "message": "No test cases available in the problem data!"})
    filename = f"temp_{uuid.uuid4().hex}"
    c_file = f"{filename}.c"
    executable = f"{filename}.out"

    try:
        with open(c_file, "w") as f:
            f.write(code)
        t1 = time.time()
        compile_process = subprocess.run(
            ["gcc", c_file, "-o", executable],
            capture_output=True,
            text=True
        )
        t2 = time.time()
        if compile_process.returncode != 0:
            error_message = compile_process.stderr.replace('\n', '<br>')
            return jsonify({
                "status": "error",
                "message": f"Compilation Failed:<br>{error_message}"
            })
        compile_time = f"Compilation successful! (Time: {t2 - t1:.2f} seconds)"

        results = []
        for test_case in test_cases:
            input_values = test_case['input']
            expected_output = test_case['output']
            explanation = test_case.get('explanation', '')

            try:
                run_process = subprocess.run(
                    [f"./{executable}"],
                    input=input_values,
                    capture_output=True,
                    text=True,
                    timeout=5
                )
                output = run_process.stdout.strip()
                status = "success" if output == expected_output else "failure"

                results.append({
                    "test_case": test_case['id'],
                    "input": input_values,
                    "expected_output": expected_output,
                    "actual_output": output,
                    "status": status,
                    "explanation": explanation
                })
            except subprocess.TimeoutExpired:
                results.append({
                    "test_case": test_case['id'],
                    "input": input_values,
                    "expected_output": expected_output,
                    "actual_output": "Time Limit Exceeded",
                    "status": "error",
                    "explanation": explanation
                })

        return jsonify({
            "status": "success",
            "compile_time": compile_time,
            "results": results
        })

    finally:
        if os.path.exists(c_file):
            os.remove(c_file)
        if os.path.exists(executable):
            os.remove(executable)
if __name__ == '__main__':
    app.run(debug=True)