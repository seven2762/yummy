FROM openjdk:17-jdk-slim AS builder

WORKDIR /app

# 의존성 캐싱을 위한 레이어 분리
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle
RUN ./gradlew dependencies --no-daemon

# 소스 코드 복사 및 빌드 (테스트 제외)
COPY src ./src
RUN ./gradlew build -x test --no-daemon

# 실행 이미지 생성
FROM openjdk:17-jdk-slim

WORKDIR /app

# 빌더 스테이지에서 생성된 JAR 파일 복사
COPY --from=builder /app/build/libs/Backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

# 환경 변수 설정이 가능하도록 ENTRYPOINT 설정
ENTRYPOINT ["java", "-jar", "app.jar"]