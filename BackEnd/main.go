package main

import (
	"context"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
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
		var user User
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		user.Stats = UserStats{
			TotalSolved:    0,
			EasySolved:     0,
			MediumSolved:   0,
			HardSolved:     0,
			Submissions:    0,
			AcceptanceRate: "0%",
		}
		_, err = db.Exec(`INSERT INTO users (email, password, name, username, location, github, twitter, joinDate, bio, profileCompletion, totalSolved, easySolved, mediumSolved, hardSolved, submissions, acceptanceRate) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			user.Email, user.Password, user.Name, user.Username, user.Location, user.GitHub, user.Twitter, user.JoinDate, user.Bio, user.ProfileCompletion,
			user.Stats.TotalSolved, user.Stats.EasySolved, user.Stats.MediumSolved, user.Stats.HardSolved, user.Stats.Submissions, user.Stats.AcceptanceRate)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		fmt.Fprintf(w, "User signed up successfully: %s", user.Email)
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
		var storedPassword string
		err = db.QueryRow(`SELECT password FROM users WHERE email = ?`, user.Email).Scan(&storedPassword)
		if err != nil || storedPassword != user.Password {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}
		userData := getUserData(user.Email)
		fmt.Fprintf(w, "User logged in successfully: %s", user.Email)
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(userData)
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

func main() {
	http.HandleFunc("/signup", signupHandler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/forgot-password", forgotPasswordHandler)
	http.HandleFunc("/run", runHandler)
	http.HandleFunc("/submit", submitHandler)

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:5173"}),  
		handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}), 
		handlers.AllowedHeaders([]string{"Content-Type"}),           
	)(http.DefaultServeMux)

	http.ListenAndServe(":8080", corsHandler)
}
