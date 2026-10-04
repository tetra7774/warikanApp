# build stage
FROM gradle:8-jdk21 AS builder

WORKDIR /app

COPY warikan .

RUN ./gradlew bootJar

# runtime stage
FROM bellsoft/liberica-openjdk-debian:21

WORKDIR /home

COPY --from=builder /app/build/libs/*.jar warikan.jar

ENTRYPOINT ["java", "-jar", "warikan.jar"]