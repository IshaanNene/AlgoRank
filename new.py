import os
import shutil

# Define base directories
solutions_base = "Solutions"
problems_base = "Problem"

# Define language-wise solution directories
language_dirs = {
    "C": "C_Solutions",
    "Cpp": "Cpp_Solutions",
    "Java": "Java_Solutions",
    "Go": "Go_Solutions/cmd",
    "Rust": "Rust_Solutions"
}

# Move problem JSON files into their respective folders
for filename in os.listdir(problems_base):
    if filename.startswith("problem") and filename.endswith(".json"):
        problem_id = ''.join(filter(str.isdigit, filename))  # Extract problem number

        if not problem_id:
            continue

        # Create problem-wise folder
        problem_folder = os.path.join(solutions_base, f"Problem{problem_id}")
        os.makedirs(problem_folder, exist_ok=True)

        # Move JSON file
        old_path = os.path.join(problems_base, filename)
        new_path = os.path.join(problem_folder, filename)
        shutil.move(old_path, new_path)
        print(f"Moved: {old_path} -> {new_path}")

# Move language-specific solutions into respective problem folders
for lang, dir_name in language_dirs.items():
    lang_path = os.path.join(solutions_base, dir_name)

    if not os.path.exists(lang_path):
        continue

    for filename in os.listdir(lang_path):
        parts = filename.split(".")
        if len(parts) < 2:
            continue

        problem_id = ''.join(filter(str.isdigit, parts[0]))  # Extract problem number
        if not problem_id:
            continue

        problem_folder = os.path.join(solutions_base, f"Problem{problem_id}")
        os.makedirs(problem_folder, exist_ok=True)

        old_path = os.path.join(lang_path, filename)
        new_path = os.path.join(problem_folder, filename)
        shutil.move(old_path, new_path)
        print(f"Moved: {old_path} -> {new_path}")

    # Remove empty directories
    if not os.listdir(lang_path):
        os.rmdir(lang_path)
        print(f"Removed empty directory: {lang_path}")

print("✅ All files have been reorganized successfully!")

