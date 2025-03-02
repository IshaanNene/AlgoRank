package main

import (
	"database/sql"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

// ConnectDB establishes a connection to the database
func ConnectDB() (*sql.DB, error) {
	// Get database URL from environment variable
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://algorank:algorank123@localhost:5432/algorank?sslmode=disable"
	}

	// Connect to the database
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		return nil, err
	}

	// Set connection pool parameters
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Ping the database to verify the connection
	err = db.Ping()
	if err != nil {
		return nil, err
	}

	// Initialize database tables
	if err := createTables(db); err != nil {
		log.Println("Warning: Failed to create tables:", err)
	}

	// Log successful connection
	log.Println("Connected to database:", dbURL)

	// Test query to verify schema
	rows, err := db.Query("SELECT column_name FROM information_schema.columns WHERE table_name = 'problems'")
	if err != nil {
		log.Println("Error querying schema:", err)
	} else {
		defer rows.Close()
		log.Println("Problems table columns:")
		for rows.Next() {
			var columnName string
			if err := rows.Scan(&columnName); err == nil {
				log.Println("- " + columnName)
			}
		}
	}

	return db, nil
}

// createTables creates the necessary database tables if they don't exist
func createTables(db *sql.DB) error {
	queries := []string{
		`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,

		`CREATE TABLE IF NOT EXISTS users (
			id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
			email VARCHAR(255) UNIQUE NOT NULL,
			username VARCHAR(255) UNIQUE NOT NULL,
			password_hash VARCHAR(255) NOT NULL,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		)`,

		`CREATE TABLE IF NOT EXISTS problems (
			id SERIAL PRIMARY KEY,
			title VARCHAR(255) NOT NULL,
			name VARCHAR(255) NOT NULL,
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
		)`,

		`CREATE TABLE IF NOT EXISTS problem_examples (
			id SERIAL PRIMARY KEY,
			problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
			input TEXT NOT NULL,
			output TEXT NOT NULL,
			explanation TEXT
		)`,

		`CREATE TABLE IF NOT EXISTS problem_templates (
			id SERIAL PRIMARY KEY,
			problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
			templates JSONB NOT NULL
		)`,

		`CREATE TABLE IF NOT EXISTS test_cases (
			id SERIAL PRIMARY KEY,
			problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
			input JSONB NOT NULL,
			expected_output JSONB NOT NULL,
			is_hidden BOOLEAN DEFAULT false,
			is_submit BOOLEAN DEFAULT false
		)`,

		`CREATE TABLE IF NOT EXISTS submissions (
			id SERIAL PRIMARY KEY,
			problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
			user_id UUID REFERENCES users(id) ON DELETE CASCADE,
			code TEXT NOT NULL,
			language VARCHAR(50) NOT NULL,
			status VARCHAR(50) NOT NULL,
			runtime FLOAT,
			memory BIGINT,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		)`,

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
