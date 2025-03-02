# AlgoRank

A modern platform for practicing algorithmic problems and improving coding skills with support for multiple programming languages.

## Features

- Interactive code editor with Monaco Editor and syntax highlighting
- Real-time code execution and testing
- Multiple language support (C, C++, Java, Go, Rust)
- Problem difficulty ratings and categories
- Performance metrics (execution time, memory usage, CPU usage)
- Containerized architecture for easy deployment

## Architecture

AlgoRank consists of four main components:

1. **Frontend**: Angular-based web interface with Monaco Editor
2. **Backend**: Go API server for problem management and user interactions
3. **Executor**: Python FastAPI service for secure code execution
4. **Database**: PostgreSQL for data persistence

## Prerequisites

- Docker and Docker Compose
- Make (optional, for using Makefile commands)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/IshaanNene/AlgoRank.git
   cd AlgoRank
   ```

2. Start the application:
   ```bash
   make build
   make run
   ```

   Or without Make:
   ```bash
   docker-compose build
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080
   - Executor API: http://localhost:8000
   - Database: localhost:5432

## Development

### Useful Commands

- Start all services:
  ```bash
  make run
  ```

- Start services in detached mode:
  ```bash
  make run-detached
  ```

- Rebuild and restart specific services:
  ```bash
  make rebuild-backend
  make rebuild-executor
  ```

- Reset the database:
  ```bash
  make reset-db
  ```

- View logs:
  ```bash
  make logs
  ```

- Clean up:
  ```bash
  make clean
  ```

## Project Structure

```
AlgoRank/
├── BackEnd/               # Go backend service
│   ├── Dockerfile
│   ├── go.mod
│   ├── go.sum
│   ├── main.go
│   ├── models.go
│   ├── problem_handlers.go
│   ├── code_handlers.go
│   ├── auth_handlers.go
│   └── init.sql           # Database initialization
├── FrontEnd/              # Angular frontend
│   ├── Dockerfile
│   ├── package.json
│   ├── angular.json
│   └── src/               # Frontend source code
├── Problem/               # Problem definitions
│   ├── problem1.json
│   ├── problem2.json
│   └── ...
├── Solutions/             # User solutions
│   ├── C_Solutions/
│   ├── Cpp_Solutions/
│   ├── Go_Solutions/
│   ├── Java_Solutions/
│   └── Rust_Solutions/
├── Dockerfile             # Executor service Dockerfile
├── main.py                # Executor service code
├── requirements.txt       # Python dependencies
├── docker-compose.yml     # Service orchestration
└── Makefile               # Convenience commands
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
