package main

import (
    "encoding/json"
    "net/http"
)

type UserStats struct {
    TotalSolved      int    `json:"totalSolved"`
    EasySolved       int    `json:"easySolved"`
    MediumSolved     int    `json:"mediumSolved"`
    HardSolved       int    `json:"hardSolved"`
    Submissions      int    `json:"submissions"`
    AcceptanceRate   string `json:"acceptanceRate"`
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

func signupHandler(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodPost {
        var user User
        err := json.NewDecoder(r.Body).Decode(&user)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }
        // Here you would typically save the user to a database
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
        // Here you would typically check the user's credentials
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(user)
    } else {
        http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
    }
}

func main() {
    http.HandleFunc("/signup", signupHandler)
    http.HandleFunc("/login", loginHandler)
    http.ListenAndServe(":8080", nil)
}