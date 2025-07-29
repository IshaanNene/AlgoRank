FROM golang:1.21-alpine AS builder

WORKDIR /build
COPY . .

# Build with all optimizations
RUN go build -o runner \
    -ldflags="-s -w" \
    -trimpath \
    -tags=netgo \
    test_runner.go starter_code.go

# Create minimal runtime image
FROM alpine:3.18
WORKDIR /app
COPY --from=builder /build/runner .
COPY testcases.json .

CMD ["./runner"]