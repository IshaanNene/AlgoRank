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

1. **Frontend**: React-based web interface with Monaco Editor
2. **Backend**: Go API server for problem management and user interactions
3. **Executor**: Python FastAPI service for secure code execution
4. **Database**: PostgreSQL for data persistence

## Prerequisites

- Docker and Docker Compose (for local development)
- Node.js and npm (for frontend development)
- Go 1.21+ (for backend development)
- Python 3.9+ (for executor development)

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/IshaanNene/AlgoRank.git
   cd AlgoRank
   ```

2. Start the application locally:
   ```bash
   make build
   make run
   ```

3. Access the application:
   - Frontend: http://localhost:80
   - Backend API: http://localhost:8080
   - Executor API: http://localhost:8000

## Deployment

### Frontend (Vercel)

1. Fork the repository
2. Connect your fork to Vercel
3. Set the following environment variables in Vercel:
   - `VITE_API_URL`: Your backend API URL
   - `VITE_EXECUTOR_URL`: Your executor API URL
   - `VITE_ENV`: "production"

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Set the following environment variables:
   - `DB_HOST`: Your PostgreSQL host
   - `DB_USER`: Database username
   - `DB_PASSWORD`: Database password
   - `DB_NAME`: Database name
   - `JWT_SECRET`: Your JWT secret key
   - `ENV`: "production"

### Executor (Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Set the following environment variables:
   - `ENV`: "production"

### Database (Render)

1. Create a new PostgreSQL instance on Render
2. Note down the connection details
3. Use these details in your backend environment variables

## Development

### Frontend Development

```bash
cd FrontEnd
npm install
npm run dev
```

### Backend Development

```bash
cd BackEnd
go mod download
go run main.go
```

### Executor Development

```bash
cd Executor
pip install -r requirements.txt
python main.py
```

## Project Structure

```
AlgoRank/
├── BackEnd/               # Go backend service
├── FrontEnd/             # React frontend
├── Executor/             # Python code execution service
├── Problem/              # Problem definitions
├── Solutions/            # User solutions
└── docker-compose.yml    # Service orchestration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
