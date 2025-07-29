FROM gcc:13 AS builder

WORKDIR /build
COPY . .

# Get JSON library
RUN curl -sSLo json.hpp https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp

# Compile with full static linking
RUN g++ -O3 -march=native -flto -std=c++20 \
    -Wall -Wextra \
    -static \
    test_runner.cpp -o runner \
    -pthread

# Use minimal base image since binary is fully static
FROM scratch
WORKDIR /app
COPY --from=builder /build/runner .
COPY testcases.json .

CMD ["./runner"]