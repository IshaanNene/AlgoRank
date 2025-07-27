FROM openjdk:latest

WORKDIR /app

COPY . .

RUN curl -sSLo json.jar https://repo1.maven.org/maven2/org/json/json/20231013/json-20231013.jar

RUN javac -cp .:json.jar TestRunner.java starter_code.java

CMD ["java", "-cp", ".:json.jar", "TestRunner"]
