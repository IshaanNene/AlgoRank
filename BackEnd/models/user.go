package models

import "time"

type User struct {
	ID                string    `json:"id"`
	Email             string    `json:"email"`
	Username          string    `json:"username"`
	Name              string    `json:"name,omitempty"`
	PasswordHash      string    `json:"-"`
	Location          string    `json:"location"`
	GitHub            string    `json:"github"`
	Twitter           string    `json:"twitter"`
	Bio               string    `json:"bio"`
	CreatedAt         time.Time `json:"createdAt"`
	ProfileCompletion int       `json:"profileCompletion"`
}

type UserStats struct {
	TotalSolved    int     `json:"totalSolved"`
	EasySolved     int     `json:"easySolved"`
	MediumSolved   int     `json:"mediumSolved"`
	HardSolved     int     `json:"hardSolved"`
	Submissions    int     `json:"submissions"`
	AcceptanceRate float64 `json:"acceptanceRate"`
}
