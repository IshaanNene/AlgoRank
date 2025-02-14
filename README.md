# AlgoRank

A modern platform for practicing algorithmic problems and improving coding skills.

## Features

- Interactive code editor with syntax highlighting
- Real-time code execution
- Multiple language support (C, C++, Go, Python, etc.)
- User authentication and progress tracking
- Problem difficulty ratings and categories
- Performance metrics and leaderboards

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
   make run
   ```

   Or without Make:
   ```bash
   docker-compose up
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database: localhost:5432

## Development

- Start development environment:
  ```bash
  make dev
  ```

- Run tests:
  ```bash
  make test
  ```

- Clean up:
  ```bash
  make clean
  ```

## Project Structure
