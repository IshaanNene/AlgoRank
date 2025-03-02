FROM golang:1.20-alpine AS builder

WORKDIR /app

# Copy go mod files first for better caching
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application
COPY . .

# Build the application
RUN go build -o main .

# Final stage
FROM alpine:latest

WORKDIR /app

# Install runtime dependencies
RUN apk --no-cache add ca-certificates

# Copy the binary from the builder stage
COPY --from=builder /app/main .
COPY --from=builder /app/.env .
COPY --from=builder /app/init.sql .

# Create directories for Problem and Solutions
RUN mkdir -p /app/Problem /app/Solutions

# Expose the port
EXPOSE 8080

# Run the application
CMD ["./main"] 