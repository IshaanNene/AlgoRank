FROM gcc:13

WORKDIR /app

# Copy all problem files (starter_code.cpp, test_runner.cpp, testcases.json, etc.)
COPY . .

# Install curl and fetch JSON header
RUN apt-get update && apt-get install -y curl && \
    curl -sSLo json.hpp https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp

# Build test runner (assumes test_runner.cpp includes json.hpp as "json.hpp")
RUN g++ test_runner.cpp -o runner -std=c++17

# Run it
CMD ["./runner"]
