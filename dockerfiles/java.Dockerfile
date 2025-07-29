FROM eclipse-temurin:17-jdk-alpine as builder

WORKDIR /build
COPY . .

# Download dependencies
RUN wget https://repo1.maven.org/maven2/org/json/json/20231013/json-20231013.jar

# Compile with optimization flags
RUN javac -O -cp .:json.jar TestRunner.java starter_code.java

# Create minimal runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/TestRunner.class /app/
COPY --from=builder /build/starter_code.class /app/
COPY --from=builder /build/json.jar /app/
COPY testcases.json /app/

# Set JVM optimization flags
ENV JAVA_OPTS="-XX:+UseG1GC -XX:+UseStringDeduplication -XX:+OptimizeStringConcat"

CMD ["sh", "-c", "java $JAVA_OPTS -cp .:json.jar TestRunner"]