-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    problem_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    acceptance FLOAT DEFAULT 0,
    time_complexity VARCHAR(50),
    space_complexity VARCHAR(50),
    submissions INTEGER DEFAULT 0,
    accepted INTEGER DEFAULT 0,
    tags JSONB DEFAULT '[]',
    constraints JSONB DEFAULT '[]',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create problem examples table
CREATE TABLE IF NOT EXISTS problem_examples (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    output TEXT NOT NULL,
    explanation TEXT
);

-- Create problem templates table
CREATE TABLE IF NOT EXISTS problem_templates (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
    templates JSONB NOT NULL
);

-- Create test cases table
CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
    input JSONB NOT NULL,
    expected_output JSONB NOT NULL,
    is_hidden BOOLEAN DEFAULT false,
    is_submit BOOLEAN DEFAULT false
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    runtime FLOAT,
    memory BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_submissions_user_problem ON submissions(user_id, problem_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_problem ON test_cases(problem_id);

-- Insert sample user
INSERT INTO users (email, username, password_hash)
VALUES ('admin@algorank.com', 'admin', '$2a$10$JdJGQjLMDFgvXXXXXXXXXeXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
ON CONFLICT DO NOTHING;

-- Insert sample problems
INSERT INTO problems (id, title, problem_name, description, difficulty, time_complexity, space_complexity)
VALUES 
    (1, 'Two Sum', 'Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'Easy', 'O(n)', 'O(n)'),
    (2, 'Add Two Numbers', 'Add Two Numbers', 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.', 'Medium', 'O(max(m,n))', 'O(max(m,n))'),
    (3, 'Longest Substring Without Repeating Characters', 'Longest Substring', 'Given a string s, find the length of the longest substring without repeating characters.', 'Medium', 'O(n)', 'O(min(m,n))')
ON CONFLICT DO NOTHING; 