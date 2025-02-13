package utils

import (
	"encoding/json"
	"os"
	"path/filepath"
	"fmt"
)

func LoadProblemTestCases(problemID string, mode string) ([]byte, error) {
	filename := filepath.Join("problems", problemID, "testcases.json")
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var testCases map[string]interface{}
	if err := json.Unmarshal(data, &testCases); err != nil {
		return nil, err
	}

	// Filter test cases based on mode
	key := mode + "_testCases"
	filteredData := map[string]interface{}{
		key: testCases[key],
	}

	return json.Marshal(filteredData)
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
