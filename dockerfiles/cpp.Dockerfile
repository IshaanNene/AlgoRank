FROM gcc:13 as builder

WORKDIR /build
COPY . .

# Get JSON library
RUN curl -sSLo json.hpp https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp

# Compile with maximum optimization
RUN g++ -O3 -march=native -flto -std=c++20 \
    -Wall -Wextra \
    test_runner.cpp -o runner \
    -pthread

# Create minimal runtime image
FROM debian:bullseye-slim
WORKDIR /app
COPY --from=builder /build/runner .
COPY testcases.json .

CMD ["./runner"]