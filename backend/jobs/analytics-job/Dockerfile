FROM gradle:8-jdk22-alpine AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle jar --no-daemon

FROM amazoncorretto:22-alpine

RUN mkdir /app

COPY --from=build /home/gradle/src/build/libs/*.jar /app/analytics-job.jar

ENTRYPOINT ["java","-jar","/app/analytics-job.jar"]