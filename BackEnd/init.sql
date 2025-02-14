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

-- Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_submissions_user_problem ON submissions(user_id, problem_id);
CREATE INDEX idx_test_cases_problem ON test_cases(problem_id);

-- Insert sample problem
INSERT INTO problems (
    title,
    description,
    difficulty,
    constraints,
    hints,
    tags
) VALUES (
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    'Easy',
    ARRAY['2 <= nums.length <= 104', '-109 <= nums[i] <= 109', '-109 <= target <= 109'],
    ARRAY['Try using a hash map to store complements', 'Think about the time complexity'],
    ARRAY['Array', 'Hash Table']
);

-- Insert test cases for Two Sum
INSERT INTO test_cases (problem_id, input, expected, is_hidden) VALUES 
(1, 
 '{"a": [2,7,11,15], "b": 9}',
 '[0,1]',
 false
),
(1,
 '{"a": [3,2,4], "b": 6}',
 '[1,2]',
 false
),
(1,
 '{"a": [3,3], "b": 6}',
 '[0,1]',
 false
); 