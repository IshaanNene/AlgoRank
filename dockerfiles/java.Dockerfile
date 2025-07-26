FROM openjdk:21

WORKDIR /app
COPY . /app

RUN javac Solution.java

CMD ["java", "Solution"]

