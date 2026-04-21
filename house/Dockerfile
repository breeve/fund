# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache gcc musl-dev

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o house-server ./cmd/server

# Runtime stage
FROM alpine:3.19

WORKDIR /app

# Install runtime dependencies (PostgreSQL client for healthcheck)
RUN apk add --no-cache ca-certificates tzdata

COPY --from=builder /app/house-server .

EXPOSE 8080

CMD ["./house-server"]
