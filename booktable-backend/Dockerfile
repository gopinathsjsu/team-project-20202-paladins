# Step 1: Build the app with Maven
FROM maven:3.9.5-eclipse-temurin-17 AS builder
LABEL authors="ashishbhusal"

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Step 2: Run the app using Eclipse Temurin JDK (Debian-based)
FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
