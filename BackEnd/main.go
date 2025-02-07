package main

import (
	"encoding/json"
	"net/http"

	"github.com/gorilla/handlers"
)

type UserStats struct {
	TotalSolved    int    `json:"totalSolved"`
	EasySolved     int    `json:"easySolved"`
	MediumSolved   int    `json:"mediumSolved"`
	HardSolved     int    `json:"hardSolved"`
	Submissions    int    `json:"submissions"`
	AcceptanceRate string `json:"acceptanceRate"`
}

type User struct {
	Email             string    `json:"email"`
	Password          string    `json:"password"`
	Name              string    `json:"name"`
	Username          string    `json:"username"`
	Location          string    `json:"location"`
	GitHub            string    `json:"github"`
	Twitter           string    `json:"twitter"`
	JoinDate          string    `json:"joinDate"`
	Stats             UserStats `json:"stats"`
	Bio               string    `json:"bio"`
	ProfileCompletion int       `json:"profileCompletion"`
}

// In-memory user storage for demonstration purposes
var users = make(map[string]string) // map of email to password

func signupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user User
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Initialize user stats to zero
		user.Stats = UserStats{
			TotalSolved:    0,
			EasySolved:     0,
			MediumSolved:   0,
			HardSolved:     0,
			Submissions:    0,
			AcceptanceRate: "0%",
		}
		// Store user credentials in memory (for demonstration)
		users[user.Email] = user.Password
		// You may want to store user data in a more persistent way (e.g., database)
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(user)
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user User
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		// Check if the user exists and the password matches
		storedPassword, exists := users[user.Email]
		if !exists || storedPassword != user.Password {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}
		// Successful login, return user data
		userData := User{
			Email:    user.Email,
			Name:     user.Name,                // Use the actual name from the signup
			Username: user.Username,             // Use the actual username from the signup
			Location: user.Location,             // Use the actual location from the signup
			GitHub:   user.GitHub,               // Use the actual GitHub from the signup
			Twitter:  user.Twitter,              // Use the actual Twitter from the signup
			JoinDate: "January 2024",            // This should be the actual join date
			Stats: UserStats{                     // This should be fetched from a database in a real app
				TotalSolved:    0,
				EasySolved:     0,
				MediumSolved:   0,
				HardSolved:     0,
				Submissions:    0,
				AcceptanceRate: "0%",
			},
			Bio:               user.Bio,         // Use the actual bio from the signup
			ProfileCompletion: 0,                 // This should also be fetched from a database
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(userData) // Send user data back
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func main() {
	http.HandleFunc("/signup", signupHandler)
	http.HandleFunc("/login", loginHandler)

	// CORS configuration
	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:5173"}),  // Allow your frontend origin
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}), // Allow specific methods
		handlers.AllowedHeaders([]string{"Content-Type"}),           // Allow specific headers
	)(http.DefaultServeMux)

	http.ListenAndServe(":8080", corsHandler)
}
