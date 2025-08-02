# Force rebuild - Single-stage build to avoid architecture issues
FROM gcc:13

WORKDIR /app

# Copy all files
COPY . .

# Get JSON library
RUN curl -sSLo json.hpp https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp

# Compile directly in the final environment - NO STATIC LINKING
RUN g++ -O2 -std=c++20 \
    -Wall -Wextra \
    test_runner.cpp -o runner \
    -pthread

RUN echo "=== BUILD INFO ===" && \
    uname -a && \
    file runner && \
    ls -la runner && \
    ldd runner && \
    echo "=== END BUILD INFO ==="

CMD ["./runner"]