FROM gcc:13

WORKDIR /app
COPY . /app

RUN g++ -o solution solution.cpp

CMD ["./solution"]

