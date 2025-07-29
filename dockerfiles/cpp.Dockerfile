FROM gcc:13 AS builder

WORKDIR /build
COPY . .

# Get JSON library
RUN curl -sSLo json.hpp https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp

# Compile with static C++ libs but keep glibc dynamic for better compatibility
RUN g++ -O3 -std=c++20 \
    -Wall -Wextra \
    -static-libgcc -static-libstdc++ \
    test_runner.cpp -o runner \
    -pthread

# Use debian:bookworm-slim for better glibc compatibility with gcc:13
FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /build/runner .
COPY testcases.json .

CMD ["./runner"]