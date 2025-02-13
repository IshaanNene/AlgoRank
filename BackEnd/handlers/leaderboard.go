package handlers

import (
	"net/http"
	"strconv"

	"github.com/IshaanNene/AlgoRank/utils"
)

type LeaderboardEntry struct {
	Rank           int     `json:"rank"`
	Username       string  `json:"username"`
	Name           string  `json:"name"`
	TotalSolved    int     `json:"totalSolved"`
	AcceptanceRate float64 `json:"acceptanceRate"`
}

func (s *Server) handleGetLeaderboard(w http.ResponseWriter, r *http.Request) {
	timeRange := r.URL.Query().Get("timeRange")
	page, _ := strconv.Atoi(r.URL.Query().Get("page"))
	limit, _ := strconv.Atoi(r.URL.Query().Get("limit"))

	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 20
	}
	offset := (page - 1) * limit

	query := `
		WITH user_stats AS (
			SELECT 
				u.id,
				u.username,
				u.name,
				COUNT(DISTINCT CASE WHEN s.status = 'Accepted' THEN s.problem_id END) as problems_solved,
				ROUND(AVG(CASE WHEN s.status = 'Accepted' THEN 100.0 ELSE 0 END), 1) as acceptance_rate
			FROM users u
			LEFT JOIN submissions s ON u.id = s.user_id
	`

	if timeRange == "weekly" {
		query += " WHERE s.created_at >= NOW() - INTERVAL '7 days'"
	} else if timeRange == "monthly" {
		query += " WHERE s.created_at >= NOW() - INTERVAL '30 days'"
	}

	query += `
			GROUP BY u.id, u.username, u.name
		)
		SELECT 
			ROW_NUMBER() OVER (ORDER BY problems_solved DESC, acceptance_rate DESC) as rank,
			username,
			name,
			problems_solved,
			acceptance_rate
		FROM user_stats
		ORDER BY problems_solved DESC, acceptance_rate DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := s.db.Query(query, limit, offset)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Database error")
		return
	}
	defer rows.Close()

	var leaderboard []LeaderboardEntry
	for rows.Next() {
		var entry LeaderboardEntry
		err := rows.Scan(
			&entry.Rank,
			&entry.Username,
			&entry.Name,
			&entry.TotalSolved,
			&entry.AcceptanceRate,
		)
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Database error")
			return
		}
		leaderboard = append(leaderboard, entry)
	}

	utils.RespondWithJSON(w, http.StatusOK, leaderboard)
}
