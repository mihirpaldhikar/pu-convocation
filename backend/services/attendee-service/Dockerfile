FROM gradle:8-jdk11 AS build
COPY --chown=gradle:gradle . /home/gradle/src
WORKDIR /home/gradle/src
RUN gradle buildFatJar --no-daemon

FROM amazoncorretto:11

ARG DEVELOPMENT_MODE
ARG MONGO_DB_CONNECTION_URL
ARG MONGO_DB_NAME
ARG AUTHORIZATION_TOKEN_PRIVATE_KEY
ARG REFRESH_TOKEN_PRIVATE_KEY
ARG AUTHORIZATION_TOKEN_KEY_ID
ARG REFRESH_TOKEN_KEY_ID
ARG API_AUDIENCE
ARG CREDENTIALS_AUTHORITY
ARG CREDENTIALS_REALM

ENV DEVELOPMENT_MODE $DEVELOPMENT_MODE
ENV MONGO_DB_CONNECTION_URL $MONGO_DB_CONNECTION_URL
ENV MONGO_DB_NAME $MONGO_DB_NAME
ENV AUTHORIZATION_TOKEN_PRIVATE_KEY $AUTHORIZATION_TOKEN_PRIVATE_KEY
ENV REFRESH_TOKEN_PRIVATE_KEY $REFRESH_TOKEN_PRIVATE_KEY
ENV AUTHORIZATION_TOKEN_KEY_ID $AUTHORIZATION_TOKEN_KEY_ID
ENV REFRESH_TOKEN_KEY_ID $REFRESH_TOKEN_KEY_ID
ENV API_AUDIENCE $API_AUDIENCE
ENV CREDENTIALS_AUTHORITY $CREDENTIALS_AUTHORITY
ENV CREDENTIALS_REALM $CREDENTIALS_REALM

EXPOSE 8082

RUN mkdir /app

COPY --from=build /home/gradle/src/build/libs/*.jar /app/attendee-service.jar

ENTRYPOINT ["java","-jar","/app/attendee-service.jar"]