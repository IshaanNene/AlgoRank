package utils

import (
	"os"
	"path/filepath"
)

func SaveCodeToFile(filename string, code string) error {
	// Create directory if it doesn't exist
	dir := filepath.Dir(filename)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}

	// Write code to file
	return os.WriteFile(filename, []byte(code), 0644)
}