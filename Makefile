.PHONY: build run test clean dev install lint migrate logs restart frontend backend executor db rebuild-db rebuild-backend reset-db rebuild-executor

build:
	docker-compose build

run:
	docker-compose up

run-detached:
	docker-compose up -d

stop:
	docker-compose down

restart:
	docker-compose restart

clean:
	docker-compose down -v
	rm -rf dist
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete

test:
	cd BackEnd && go test ./...
	cd FrontEnd && npm test

dev:
	docker-compose up -d db
	cd BackEnd && go run main.go & 
	cd FrontEnd && npm start

install:
	cd FrontEnd && npm install --legacy-peer-deps
	cd BackEnd && go mod download

lint:
	cd FrontEnd && npm run lint
	cd BackEnd && go fmt ./...

migrate:
	docker-compose exec db psql -U algorank -d algorank -f /docker-entrypoint-initdb.d/init.sql

rebuild-db:
	docker-compose down -v db
	docker-compose up -d db
	sleep 5
	docker-compose exec db psql -U algorank -d algorank -f /docker-entrypoint-initdb.d/init.sql

reset-db:
	docker-compose down -v db
	docker volume rm algorank_postgres_data || true
	docker-compose up -d db
	sleep 5
	docker-compose exec db psql -U algorank -d algorank -f /docker-entrypoint-initdb.d/init.sql

rebuild-backend:
	docker-compose stop backend
	docker-compose build backend
	docker-compose up -d backend
	docker-compose logs -f backend

rebuild-executor:
	docker-compose stop executor
	docker-compose build executor
	docker-compose up -d executor
	docker-compose logs -f executor

logs:
	docker-compose logs -f

frontend:
	docker-compose up -d frontend
	docker-compose logs -f frontend

backend:
	docker-compose up -d backend
	docker-compose logs -f backend

executor:
	docker-compose up -d executor
	docker-compose logs -f executor

db:
	docker-compose up -d db
	docker-compose logs -f db

gits_BackEnd:
	git status
	git add BackEnd/
	git commit -m "BackEnd updates"
	git push

gits_FrontEnd:
	git status
	git add FrontEnd/
	git commit -m "FrontEnd updates"
	git push

gits_Problem:
	git status
	git add Problem/
	git commit -m "Problem updates"
	git push

gits_Executor:
	git status
	git add main.py Dockerfile requirements.txt
	git commit -m "Executor updates"
	git push

run-executor:
	chmod +x run.sh
	./run.sh

build-executor:
	docker build -t algo_rank .