package handlers

import (
	"encoding/json"
	"net/http"

	"strconv"

	"github.com/IshaanNene/AlgoRank/models"
	"github.com/IshaanNene/AlgoRank/utils"
	"github.com/gorilla/mux"
)

func (s *Server) handleGetProfile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	username := vars["username"]

	var user models.User
	err := s.db.QueryRow(`
		SELECT id, email, username, name, location, github, twitter, bio, created_at, profile_completion
		FROM users WHERE username = $1
	`, username).Scan(
		&user.ID, &user.Email, &user.Username, &user.Name, &user.Location,
		&user.GitHub, &user.Twitter, &user.Bio, &user.CreatedAt, &user.ProfileCompletion,
	)

	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	// Get user statistics
	stats, err := s.getUserStats(user.ID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to get user statistics")
		return
	}

	response := map[string]interface{}{
		"user":  user,
		"stats": stats,
	}

	utils.RespondWithJSON(w, http.StatusOK, response)
}

func (s *Server) handleUpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(userIDKey).(string)

	var updates struct {
		Name     *string `json:"name"`
		Location *string `json:"location"`
		GitHub   *string `json:"github"`
		Twitter  *string `json:"twitter"`
		Bio      *string `json:"bio"`
	}

	if err := json.NewDecoder(r.Body).Decode(&updates); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Build dynamic update query
	query := "UPDATE users SET "
	args := []interface{}{userID}
	argCount := 2
	updates_made := false

	if updates.Name != nil {
		if updates_made {
			query += ", "
		}
		query += "name = $" + strconv.Itoa(argCount)
		args = append(args, *updates.Name)
		argCount++
		updates_made = true
	}

	if updates.Location != nil {
		if updates_made {
			query += ", "
		}
		query += "location = $" + strconv.Itoa(argCount)
		args = append(args, *updates.Location)
		argCount++
		updates_made = true
	}

	if updates.GitHub != nil {
		if updates_made {
			query += ", "
		}
		query += "github = $" + strconv.Itoa(argCount)
		args = append(args, *updates.GitHub)
		argCount++
		updates_made = true
	}

	if updates.Twitter != nil {
		if updates_made {
			query += ", "
		}
		query += "twitter = $" + strconv.Itoa(argCount)
		args = append(args, *updates.Twitter)
		argCount++
		updates_made = true
	}

	if updates.Bio != nil {
		if updates_made {
			query += ", "
		}
		query += "bio = $" + strconv.Itoa(argCount)
		args = append(args, *updates.Bio)
		argCount++
		updates_made = true
	}

	// Calculate profile completion
	query += ", profile_completion = CASE "
	query += "WHEN name IS NOT NULL THEN 20 ELSE 0 END + "
	query += "WHEN location IS NOT NULL THEN 20 ELSE 0 END + "
	query += "WHEN github IS NOT NULL THEN 20 ELSE 0 END + "
	query += "WHEN twitter IS NOT NULL THEN 20 ELSE 0 END + "
	query += "WHEN bio IS NOT NULL THEN 20 ELSE 0 END "

	query += "WHERE id = $1 RETURNING *"

	var user models.User
	err := s.db.QueryRow(query, args...).Scan(
		&user.ID, &user.Email, &user.Username, &user.Name, &user.Location,
		&user.GitHub, &user.Twitter, &user.Bio, &user.CreatedAt, &user.ProfileCompletion,
	)

	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to update profile")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, user)
}

func (s *Server) getUserStats(userID string) (*models.UserStats, error) {
	stats := &models.UserStats{}

	// Get problem solving statistics
	err := s.db.QueryRow(`
		WITH user_submissions AS (
			SELECT DISTINCT ON (problem_id) 
				problem_id, 
				status,
				p.difficulty
			FROM submissions s
			JOIN problems p ON s.problem_id = p.id
			WHERE user_id = $1 AND status = 'Accepted'
			ORDER BY problem_id, created_at DESC
		)
		SELECT 
			COUNT(*) as total_solved,
			COUNT(*) FILTER (WHERE difficulty = 'Easy') as easy_solved,
			COUNT(*) FILTER (WHERE difficulty = 'Medium') as medium_solved,
			COUNT(*) FILTER (WHERE difficulty = 'Hard') as hard_solved
		FROM user_submissions
	`, userID).Scan(
		&stats.TotalSolved,
		&stats.EasySolved,
		&stats.MediumSolved,
		&stats.HardSolved,
	)

	if err != nil {
		return nil, err
	}

	// Get submission statistics
	err = s.db.QueryRow(`
		SELECT 
			COUNT(*) as total_submissions,
			ROUND(AVG(CASE WHEN status = 'Accepted' THEN 100.0 ELSE 0 END), 1) as acceptance_rate
		FROM submissions
		WHERE user_id = $1
	`, userID).Scan(
		&stats.Submissions,
		&stats.AcceptanceRate,
	)

	if err != nil {
		return nil, err
	}

	return stats, nil
}

func (s *Server) handleGetStats(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value(userIDKey).(string)

	stats, err := s.getUserStats(userID)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to get user statistics")
		return
	}

	utils.RespondWithJSON(w, http.StatusOK, stats)
}
