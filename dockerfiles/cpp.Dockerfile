FROM gcc:13

WORKDIR /app
COPY . .

# Get single-header JSON library
RUN apt-get update && apt-get install -y curl && \
    curl -sSLo json.hpp https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp

# Compile test runner + starter code
RUN g++ test_runner.cpp starter_code.cpp -o runner -std=c++17

# Run on container start
CMD ["./runner"]
