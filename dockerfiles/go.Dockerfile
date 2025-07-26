FROM golang:1.22

WORKDIR /app
COPY . /app

RUN go build -o solution solution.go

CMD ["./solution"]

