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
    test_cases = request.form.get('test_cases', '').strip()

    if not code:
        return jsonify({"status": "error", "message": "Code cannot be empty!"})

    if not test_cases:
        return jsonify({"status": "error", "message": "Test cases cannot be empty!"})

    # Generate unique filenames
    filename = f"temp_{uuid.uuid4().hex}"
    c_file = f"{filename}.c"
    executable = f"{filename}.out"

    try:
        # Write code to a temporary file
        with open(c_file, "w") as f:
            f.write(code)

        # Compile the code
        t1 = time.time()
        compile_process = subprocess.run(
            ["gcc", c_file, "-o", executable],
            capture_output=True,
            text=True
        )
        t2 = time.time()

        if compile_process.returncode != 0:
            # Compilation failed
            error_message = compile_process.stderr.replace('\n', '<br>')
            return jsonify({
                "status": "error",
                "message": f"Compilation Failed:<br>{error_message}"
            })

        # Compilation successful
        compile_time = f"Compilation successful! (Time: {t2 - t1:.2f} seconds)"

        # Parse test cases
        test_cases = test_cases.split('\n')
        results = []

        for i, test_case in enumerate(test_cases):
            input_values = test_case.strip()
            if not input_values:
                continue

            try:
                # Run the program with input values
                run_process = subprocess.run(
                    [f"./{executable}"],
                    input=input_values,
                    capture_output=True,
                    text=True,
                    timeout=5  # Set a timeout to prevent infinite loops
                )
                output = run_process.stdout.strip()
                results.append({
                    "test_case": i + 1,
                    "input": input_values,
                    "output": output,
                    "status": "success"
                })
            except subprocess.TimeoutExpired:
                results.append({
                    "test_case": i + 1,
                    "input": input_values,
                    "output": "Time Limit Exceeded",
                    "status": "error"
                })
            except subprocess.CalledProcessError as e:
                results.append({
                    "test_case": i + 1,
                    "input": input_values,
                    "output": f"Runtime Error: {e.stderr}",
                    "status": "error"
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