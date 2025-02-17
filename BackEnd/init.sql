-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    location VARCHAR(255),
    github VARCHAR(255),
    twitter VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    profile_completion INTEGER DEFAULT 0
);

CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    acceptance_rate DECIMAL DEFAULT 0,
    submissions_count INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    discussion_count INTEGER DEFAULT 0,
    seen_in_interviews INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    constraints TEXT[] DEFAULT '{}',
    hints TEXT[] DEFAULT '{}',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    problem_id INTEGER REFERENCES problems(id),
    code TEXT NOT NULL,
    language VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    runtime INTEGER,
    memory INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    problem_id INTEGER REFERENCES problems(id),
    input JSONB NOT NULL,
    expected JSONB NOT NULL,
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE leaderboard (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    username VARCHAR(255) NOT NULL,
    problem_id INTEGER REFERENCES problems(id),
    score INTEGER NOT NULL DEFAULT 0,
    runtime INTEGER,
    memory INTEGER,
    language VARCHAR(50),
    submission_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, problem_id)
);

-- Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_submissions_user_problem ON submissions(user_id, problem_id);
CREATE INDEX idx_test_cases_problem ON test_cases(problem_id);
CREATE INDEX idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX idx_leaderboard_problem_score ON leaderboard(problem_id, score DESC);

-- Insert dummy users
INSERT INTO users (email, username, password_hash, name, location, github, profile_completion) VALUES
('test@example.com', 'testuser', '$2a$10$xVQkMcZpqEe1QmHWXa0QKOYz6TtxMQJqhN.bvWH.bHNmQvEJzFXhK', 'Test User', 'Test Location', 'https://github.com/testuser', 100),
('john@example.com', 'john_doe', '$2a$10$xVQkMcZpqEe1QmHWXa0QKOYz6TtxMQJqhN.bvWH.bHNmQvEJzFXhK', 'John Doe', 'New York', 'https://github.com/johndoe', 90),
('alice@example.com', 'alice_smith', '$2a$10$xVQkMcZpqEe1QmHWXa0QKOYz6TtxMQJqhN.bvWH.bHNmQvEJzFXhK', 'Alice Smith', 'London', 'https://github.com/alicesmith', 85),
('bob@example.com', 'bob_jones', '$2a$10$xVQkMcZpqEe1QmHWXa0QKOYz6TtxMQJqhN.bvWH.bHNmQvEJzFXhK', 'Bob Jones', 'Paris', 'https://github.com/bobjones', 95),
('emma@example.com', 'emma_wilson', '$2a$10$xVQkMcZpqEe1QmHWXa0QKOYz6TtxMQJqhN.bvWH.bHNmQvEJzFXhK', 'Emma Wilson', 'Berlin', 'https://github.com/emmawilson', 80),
('michael@example.com', 'michael_brown', '$2a$10$xVQkMcZpqEe1QmHWXa0QKOYz6TtxMQJqhN.bvWH.bHNmQvEJzFXhK', 'Michael Brown', 'Tokyo', 'https://github.com/michaelbrown', 75),
('sarah@example.com', 'sarah_davis', '$2a$10$xVQkMcZpqEe1QmHWXa0QKOYz6TtxMQJqhN.bvWH.bHNmQvEJzFXhK', 'Sarah Davis', 'Sydney', 'https://github.com/sarahdavis', 88),
('david@example.com', 'david_miller', '$2a$10$xVQkMcZpqEe1QmHWXa0QKOYz6TtxMQJqhN.bvWH.bHNmQvEJzFXhK', 'David Miller', 'Toronto', 'https://github.com/davidmiller', 92),
('lisa@example.com', 'lisa_taylor', '$2a$10$xVQkMcZpqEe1QmHWXa0QKOYz6TtxMQJqhN.bvWH.bHNmQvEJzFXhK', 'Lisa Taylor', 'Singapore', 'https://github.com/lisataylor', 87),
('james@example.com', 'james_wilson', '$2a$10$xVQkMcZpqEe1QmHWXa0QKOYz6TtxMQJqhN.bvWH.bHNmQvEJzFXhK', 'James Wilson', 'Dubai', 'https://github.com/jameswilson', 83);

-- Clear existing problems and insert new ones
TRUNCATE problems CASCADE;

-- Insert problems from JSON files
INSERT INTO problems (
    id,
    title,
    description,
    difficulty,
    constraints,
    tags,
    acceptance_rate,
    submissions_count,
    likes,
    dislikes,
    discussion_count,
    seen_in_interviews
) VALUES 
(1, 'Adding two numbers', 'This problem requires you to write a function that adds two integers.', 'Easy', 
 ARRAY['nil'], ARRAY['Math', 'Basic'], 95.5, 1000, 500, 50, 100, 200),
(2, 'Binary Search', 'Implement a binary search algorithm to find the index of a target value in a sorted array.', 'Easy',
 ARRAY['O(log n) time complexity', 'O(1) space complexity'], ARRAY['Binary Search', 'Array'], 85.0, 800, 400, 40, 80, 150),
(3, 'Finding maximum of two numbers', 'Write a function that returns the maximum of two integers.', 'Easy',
 ARRAY['nil'], ARRAY['Math', 'Basic'], 98.0, 1200, 600, 30, 120, 180),
(4, 'Reverse a String', 'Write a function that reverses a given string.', 'Easy',
 ARRAY['O(n) time complexity', 'O(n) space complexity'], ARRAY['String', 'Basic'], 90.0, 900, 450, 45, 90, 160),
(5, 'Fibonacci Sequence', 'Implement a function to return the nth Fibonacci number.', 'Medium',
 ARRAY['O(n) time complexity', 'O(1) space complexity'], ARRAY['Math', 'Dynamic Programming'], 75.0, 700, 350, 70, 140, 120),
(6, 'Check for Palindrome', 'Write a function that checks if a given string is a palindrome.', 'Easy',
 ARRAY['O(n) time complexity', 'O(1) space complexity'], ARRAY['String', 'Two Pointers'], 88.0, 850, 425, 42, 85, 140),
(7, 'Find the Maximum Number', 'Write a function that finds the maximum number in an array.', 'Easy',
 ARRAY['O(n) time complexity', 'O(1) space complexity'], ARRAY['Array', 'Basic'], 92.0, 950, 475, 38, 95, 170),
(8, 'Sort an Array', 'Implement a function to sort an array of integers.', 'Medium',
 ARRAY['O(n log n) time complexity', 'O(n) space complexity'], ARRAY['Array', 'Sorting'], 70.0, 600, 300, 60, 120, 100),
(9, 'Pascal''s Triangle', 'Given a non-negative integer numRows, generate the first numRows of Pascal''s triangle.', 'Easy',
 ARRAY['O(n^2) time complexity', 'O(1) space complexity'], ARRAY['Array', 'Dynamic Programming'], 82.0, 750, 375, 45, 75, 130),
(10, 'Binary Search', 'Implement binary search on a sorted array.', 'Medium',
 ARRAY['O(log n) time complexity', 'O(1) space complexity'], ARRAY['Binary Search', 'Array'], 78.0, 650, 325, 55, 130, 110);

-- Insert test cases for each problem
INSERT INTO test_cases (problem_id, input, expected, is_hidden) VALUES
(1, '{"a": 1, "b": 2}', '{"result": 3}', false),
(1, '{"a": -1, "b": 1}', '{"result": 0}', false),
(2, '{"array": [1,2,3,4,5], "target": 3}', '{"result": 2}', false),
(2, '{"array": [1,2,3,4,5], "target": 6}', '{"result": -1}', false),
(3, '{"a": 5, "b": 3}', '{"result": 5}', false),
(3, '{"a": -1, "b": -5}', '{"result": -1}', false),
(4, '{"str": "hello"}', '{"result": "olleh"}', false),
(4, '{"str": "world"}', '{"result": "dlrow"}', false),
(5, '{"n": 5}', '{"result": 5}', false),
(5, '{"n": 10}', '{"result": 55}', false);

-- Insert sample submissions
INSERT INTO submissions (user_id, problem_id, code, language, status, runtime, memory) 
SELECT 
    u.id,
    p.id,
    'function solution(a, b) { return a + b; }',
    'JavaScript',
    'Accepted',
    floor(random() * 500 + 100)::integer,
    floor(random() * 1000 + 500)::integer
FROM users u
CROSS JOIN problems p
LIMIT 10;

-- Insert sample leaderboard entries
INSERT INTO leaderboard (user_id, username, problem_id, score, runtime, memory, language)
SELECT 
    u.id,
    u.username,
    p.id,
    floor(random() * 500 + 500)::integer,
    floor(random() * 500 + 100)::integer,
    floor(random() * 1000 + 500)::integer,
    'JavaScript'
FROM users u
CROSS JOIN problems p
LIMIT 10;
