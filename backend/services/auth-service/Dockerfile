FROM gradle:8-jdk11 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle buildFatJar --no-daemon

FROM amazoncorretto:11

EXPOSE 8081

RUN mkdir /app

COPY --from=build /home/gradle/src/build/libs/*.jar /app/auth-service.jar

ENTRYPOINT ["java","-jar","/app/auth-service.jar"]