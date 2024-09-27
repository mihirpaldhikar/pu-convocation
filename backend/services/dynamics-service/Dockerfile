FROM gradle:8-jdk11 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle buildFatJar --no-daemon

FROM amazoncorretto:11

EXPOSE 8083

RUN mkdir /app

COPY --from=build /home/gradle/src/build/libs/*.jar /app/dynamics-service.jar

ENTRYPOINT ["java","-jar","/app/dynamics-service.jar"]