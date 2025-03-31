package utils

import (
	"database/sql"
	"fmt"
)

var db *sql.DB

func InitDB(database *sql.DB) {
	db = database
}

func LoadProblemTestCases(problemID string, mode string) ([]byte, error) {
	if db == nil {
		return nil, fmt.Errorf("database connection not initialized")
	}

	query := `
		SELECT json_build_object(
			'test_cases',
			json_agg(
				json_build_object(
					'input', input,
					'expected', expected
				)
			)
		)
		FROM test_cases
		WHERE problem_id = $1
		AND ($2 = 'Submit' OR NOT is_hidden)
	`

	var result []byte
	err := db.QueryRow(query, problemID, mode).Scan(&result)
	if err != nil {
		return nil, fmt.Errorf("error querying test cases: %v", err)
	}

	return result, nil
}

func ValidateProblemInput(problem map[string]interface{}) error {
	required := []string{"title", "description", "difficulty"}
	for _, field := range required {
		if _, ok := problem[field]; !ok {
			return ErrMissingField(field)
		}
	}

	difficulty := problem["difficulty"].(string)
	validDifficulties := map[string]bool{
		"Easy":   true,
		"Medium": true,
		"Hard":   true,
	}

	if !validDifficulties[difficulty] {
		return ErrInvalidDifficulty(difficulty)
	}

	return nil
}

func ErrMissingField(field string) error {
	return fmt.Errorf("missing required field: %s", field)
}

func ErrInvalidDifficulty(difficulty string) error {
	return fmt.Errorf("invalid difficulty: %s", difficulty)
}
