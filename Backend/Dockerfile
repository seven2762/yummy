FROM openjdk:17-jdk-slim

WORKDIR /app

# 미리 빌드된 JAR 파일 복사
ARG JAR_FILE=./build/libs/Backend-0.0.1-SNAPSHOT.jar

COPY ${JAR_FILE} app.jar

EXPOSE 8080

# 환경 변수 설정이 가능하도록 ENTRYPOINT 설정
ENTRYPOINT ["java", "-jar", "app.jar"]