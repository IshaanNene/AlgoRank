FROM gcc:13

WORKDIR /app

# Copy everything (test_runner.cpp, starter_code.cpp, testcases.json)
COPY . .

# Install curl & fetch single-header JSON lib
RUN apt-get update && apt-get install -y curl && \
    curl -sSLo json.hpp https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp

# Compile BOTH files: test_runner.cpp depends on starter_code.cpp
RUN g++ test_runner.cpp starter_code.cpp -o runner -std=c++17

# Run the compiled binary
CMD ["./runner"]
