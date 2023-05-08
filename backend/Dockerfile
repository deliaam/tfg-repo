FROM openjdk:19-alpine AS build
ADD target/backend.jar backend.jar
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait
EXPOSE 8080
