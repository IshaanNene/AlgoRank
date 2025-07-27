FROM gcc:13

WORKDIR /app

COPY . .

RUN apt-get update && apt-get install -y curl && \
    curl -sSLo json.hpp https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp

RUN g++ test_runner.cpp starter_code.cpp -o runner -std=c++17

CMD ["./runner"]
