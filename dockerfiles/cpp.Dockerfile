FROM gcc:13

WORKDIR /app

# Copy everything into /app
COPY . .

# Fetch nlohmann/json single-header
RUN apt-get update && apt-get install -y curl && \
    curl -sSLo json.hpp https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp

# Compile test runner (including starter code)
RUN g++ test_runner.cpp starter_code.cpp -o runner -std=c++17

# Run the compiled binary
RUN echo "==> Files in /app:" && ls -l /app && cat testcases.json

CMD ["./runner"]
