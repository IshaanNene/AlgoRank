.PHONY: build run test clean

build:
	docker-compose build

run:
	docker-compose up

stop:
	docker-compose down

clean:
	docker-compose down -v
	rm -rf dist
	find . -name "*.pyc" -delete

test:
	cd BackEnd && go test ./...
	cd FrontEnd && npm test

dev:
	docker-compose up -d db
	cd BackEnd && go run main.go & 
	cd FrontEnd && npm start

install:
	cd FrontEnd && npm install
	cd BackEnd && go mod download

lint:
	cd FrontEnd && npm run lint
	cd BackEnd && go fmt ./...

migrate:
	docker-compose exec db psql -U algorank -d algorank -f /docker-entrypoint-initdb.d/init.sql

gits_BackEnd:
	git status
	git add .
	git commit -m "BackEnd"
	git push
gits_FrontEnd:
	git status
	git add .
	git commit -m "FrontEnd"
	git push
Problem:
	git status
	git add .
	git commit -m "Problem"
	git push
Executor:
	git status
	git add .
	git commit -m "Executor"
	git push
nene: build-runner
	chmod +x run.sh
	./run.sh

build-runner:
	docker build -t algo_rank .