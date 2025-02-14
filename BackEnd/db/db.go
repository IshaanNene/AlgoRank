package db

import (
	"database/sql"
	"fmt"

	"github.com/IshaanNene/AlgoRank/config"
	_ "github.com/lib/pq"
)

func Initialize(cfg *config.Config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("error connecting to the database: %w", err)
	}

	if err = createTables(db); err != nil {
		return nil, fmt.Errorf("error creating tables: %w", err)
	}

	return db, nil
}

func createTables(db *sql.DB) error {
	queries := []string{
		`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,

		`CREATE TABLE IF NOT EXISTS users (
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
		)`,

		`CREATE TABLE IF NOT EXISTS problems (
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
		)`,

		`CREATE TABLE IF NOT EXISTS submissions (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			user_id UUID REFERENCES users(id),
			problem_id INTEGER REFERENCES problems(id),
			code TEXT NOT NULL,
			language VARCHAR(50) NOT NULL,
			status VARCHAR(20) NOT NULL,
			runtime INTEGER,
			memory INTEGER,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS test_cases (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			problem_id INTEGER REFERENCES problems(id),
			input JSONB NOT NULL,
			expected JSONB NOT NULL,
			is_hidden BOOLEAN DEFAULT false,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`,
		`CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty)`,
		`CREATE INDEX IF NOT EXISTS idx_submissions_user_problem ON submissions(user_id, problem_id)`,
		`CREATE INDEX IF NOT EXISTS idx_test_cases_problem ON test_cases(problem_id)`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			return err
		}
	}

	return nil
}

func CloseDB(db *sql.DB) error {
	if db != nil {
		return db.Close()
	}
	return nil
}
