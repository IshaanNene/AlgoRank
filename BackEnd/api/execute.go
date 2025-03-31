package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
)

type ExecuteRequest struct {
	Code      string `json:"code"`
	Language  string `json:"language"`
	ProblemID int    `json:"problemId"`
	Mode      string `json:"mode"`
}

type ExecuteResponse struct {
	Status  string          `json:"status"`
	Metrics json.RawMessage `json:"metrics,omitempty"`
	Message string          `json:"message,omitempty"`
}

func HandleExecute(w http.ResponseWriter, r *http.Request) {
	var req ExecuteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Save the code to the appropriate solution file
	filename := fmt.Sprintf("../Solutions/%s_Solutions/solution%d%s",
		req.Language,
		req.ProblemID,
		getFileExtension(req.Language))

	if err := saveCode(filename, req.Code); err != nil {
		http.Error(w, "Failed to save code", http.StatusInternalServerError)
		return
	}

	// Execute code using the Python engine
	cmd := exec.Command("python3", "../main.py", req.Mode, fmt.Sprint(req.ProblemID), req.Language)
	output, err := cmd.CombinedOutput()

	w.Header().Set("Content-Type", "application/json")
	if err != nil {
		json.NewEncoder(w).Encode(ExecuteResponse{
			Status:  "error",
			Message: string(output),
		})
		return
	}

	// Pass through the Python engine's JSON response
	w.Write(output)
}

func getFileExtension(language string) string {
	extensions := map[string]string{
		"c":    ".c",
		"cpp":  ".cpp",
		"java": ".java",
		"go":   ".go",
		"rust": ".rs",
	}
	return extensions[language]
}

func saveCode(filename, code string) error {
	return os.WriteFile(filename, []byte(code), 0644)
}
