package main

import (
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	_ "github.com/mattn/go-sqlite3"
	"google.golang.org/api/gmail/v1"
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

var db *sql.DB

func init() {
	var err error
	db, err = sql.Open("sqlite3", "./users.db")
	if err != nil {
		panic(err)
	}
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS users (
		email TEXT PRIMARY KEY,
		password TEXT,
		name TEXT,
		username TEXT,
		location TEXT,
		github TEXT,
		twitter TEXT,
		joinDate TEXT,
		bio TEXT,
		profileCompletion INTEGER,
		totalSolved INTEGER,
		easySolved INTEGER,
		mediumSolved INTEGER,
		hardSolved INTEGER,
		submissions INTEGER,
		acceptanceRate TEXT
	)`)
	if err != nil {
		panic(err)
	}
}

func signupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var user struct {
			Username string `json:"username"`
			Password string `json:"password"`
			Name     string `json:"name"`
			Email    string `json:"email"`
			// ... other fields ...
		}

		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Check if username already exists
		var exists bool
		err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM users WHERE username = ?)`, user.Username).Scan(&exists)
		if err != nil || exists {
			http.Error(w, "Username already exists", http.StatusConflict)
			return
		}

		// Insert new user
		_, err = db.Exec(`INSERT INTO users (username, password, name, email) VALUES (?, ?, ?, ?)`,
			user.Username, user.Password, user.Name, user.Email)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(user)
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var credentials struct {
			Username string `json:"username"`
			Password string `json:"password"`
		}
		err := json.NewDecoder(r.Body).Decode(&credentials)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var user User
		err = db.QueryRow(`SELECT email, password FROM users WHERE username = ?`, credentials.Username).Scan(&user.Email, &user.Password)
		if err != nil || user.Password != credentials.Password {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(user)
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func getUserData(email string) User {
	var user User
	row := db.QueryRow(`SELECT email, name, username, location, github, twitter, joinDate, bio, profileCompletion, totalSolved, easySolved, mediumSolved, hardSolved, submissions, acceptanceRate 
		FROM users WHERE email = ?`, email)
	err := row.Scan(&user.Email, &user.Name, &user.Username, &user.Location, &user.GitHub, &user.Twitter, &user.JoinDate, &user.Bio, &user.ProfileCompletion,
		&user.Stats.TotalSolved, &user.Stats.EasySolved, &user.Stats.MediumSolved, &user.Stats.HardSolved, &user.Stats.Submissions, &user.Stats.AcceptanceRate)
	if err != nil {
		return User{}
	}
	return user
}

func forgotPasswordHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var request struct {
			Email string `json:"email"`
		}
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var storedPassword string
		err = db.QueryRow(`SELECT password FROM users WHERE email = ?`, request.Email).Scan(&storedPassword)
		if err != nil {
			http.Error(w, "Email not found", http.StatusNotFound)
			tempPassword := "temporaryPassword123"
			err = sendEmail(request.Email, tempPassword)
			if err != nil {
				http.Error(w, "Failed to send email", http.StatusInternalServerError)
				return
			}
			fmt.Fprintf(w, "Temporary password sent to: %s", request.Email)
			json.NewEncoder(w).Encode("Password sent to your email")
			return
		}
		http.Error(w, "Email not found", http.StatusNotFound)
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func sendEmail(email, tempPassword string) error {
	srv, err := gmail.NewService(context.Background())
	if err != nil {
		return fmt.Errorf("unable to create Gmail service: %v", err)
	}
	subject := "AlgoRank Password Reset"
	body := fmt.Sprintf("Your temporary password is: %s\n\nPlease login and change it immediately.", tempPassword)

	message := &gmail.Message{
		Raw: base64.URLEncoding.EncodeToString([]byte(
			"To: " + email + "\r\n" +
				"Subject: " + subject + "\r\n" +
				"Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
				body)),
	}

	_, err = srv.Users.Messages.Send("me", message).Do()
	if err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}
	return nil
}

func runHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var request struct {
			Code string `json:"code"`
		}
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Save the code to a temporary file and run it
		// Implement the logic to compile and run the code
		// Return the output as a response
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func submitHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		var request struct {
			Code string `json:"code"`
		}
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Similar logic to runHandler, but handle all test cases
		// Return the results of all test cases as a response
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
	}
}

func authCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request method"})
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	sessionToken := r.Header.Get("Authorization")
	if sessionToken == "" {
		json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// TODO: Implement proper session verification
	// For now, we'll just get the first user as an example
	var userEmail string
	err := db.QueryRow("SELECT email FROM users LIMIT 1").Scan(&userEmail)
	if err != nil {
		json.NewEncoder(w).Encode(map[string]string{"error": "No users found"})
		w.WriteHeader(http.StatusNotFound)
		return
	}

	user := getUserData(userEmail)
	if user.Email == "" {
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		w.WriteHeader(http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func main() {
	http.HandleFunc("/api/auth/login", loginHandler)
	http.HandleFunc("/api/auth/signup", signupHandler)
	http.HandleFunc("/forgot-password", forgotPasswordHandler)
	http.HandleFunc("/run", runHandler)
	http.HandleFunc("/submit", submitHandler)
	http.HandleFunc("/api/auth/check", authCheckHandler)

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:5173"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
		handlers.ExposedHeaders([]string{"Content-Type"}),
		handlers.AllowCredentials(),
	)(http.DefaultServeMux)

	log.Println("Server starting on :8080")
	http.ListenAndServe(":8080", corsHandler)
}
