FROM golang:latest

WORKDIR /app

COPY . .

RUN go build -o runner test_runner.go starter_code.go

CMD ["./runner"]
