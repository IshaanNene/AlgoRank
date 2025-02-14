package db

import (
	"database/sql"
	"github.com/IshaanNene/AlgoRank/models"
)

func GetUserByID(db *sql.DB, userID string) (*models.User, error) {
	var user models.User
	err := db.QueryRow(`
		SELECT id, email, username, name, location, github, twitter, bio, 
		created_at, profile_completion 
		FROM users WHERE id = $1`,
		userID,
	).Scan(
		&user.ID, &user.Email, &user.Username, &user.Name, &user.Location,
		&user.GitHub, &user.Twitter, &user.Bio, &user.CreatedAt, &user.ProfileCompletion,
	)
	if err != nil {
		return nil, err
	}
	return &user, nil
} 