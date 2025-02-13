package db

import (
	"database/sql"
)

func Initialize(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("postgres", databaseURL)
	if err != nil {
		return nil, err
	}

	if err = db.Ping(); err != nil {
		return nil, err
	}

	if err = createTables(db); err != nil {
		return nil, err
	}

	return db, nil
}

func createTables(db *sql.DB) error {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			username VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			name VARCHAR(255),
			created_at TIMESTAMP NOT NULL,
			location VARCHAR(255),
			github VARCHAR(255),
			twitter VARCHAR(255),
			bio TEXT,
			profile_completion INTEGER DEFAULT 0
		)`,
		`CREATE TABLE IF NOT EXISTS problems (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			description TEXT NOT NULL,
			difficulty VARCHAR(20) NOT NULL,
			tags TEXT[] DEFAULT '{}',
			examples JSONB DEFAULT '[]',
			constraints TEXT[] DEFAULT '{}',
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
			submissions INTEGER DEFAULT 0,
			accepted INTEGER DEFAULT 0
		)`,
		`CREATE TABLE IF NOT EXISTS test_cases (
			id SERIAL PRIMARY KEY,
			problem_id INTEGER REFERENCES problems(id),
			input TEXT NOT NULL,
			expected_output TEXT NOT NULL,
			is_hidden BOOLEAN DEFAULT false
		)`,
		`CREATE TABLE IF NOT EXISTS submissions (
			id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(id),
			problem_id INTEGER REFERENCES problems(id),
			code TEXT NOT NULL,
			language VARCHAR(50) NOT NULL,
			status VARCHAR(20) NOT NULL,
			runtime INTEGER,
			memory INTEGER,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		)`,
	}

	for _, query := range queries {
		if _, err := db.Exec(query); err != nil {
			return err
		}
	}

	return nil
}
