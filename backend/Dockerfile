FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY --chown=gradle:gradle . .
RUN ./gradlew bootJar --no-daemon

FROM openjdk:17-jdk-slim

RUN apt-get update && apt-get install -y curl tar && rm -rf /var/lib/apt/lists/*

RUN curl -L https://download.arangodb.com/arangodb312/Community/Linux/arangodb3-client-linux-3.12.4_x86_64.tar.gz -o /tmp/arangodb.tar.gz \
 && mkdir -p /opt/arangodb-client \
 && tar -xzf /tmp/arangodb.tar.gz -C /opt/arangodb-client --strip-components=1 \
 && rm /tmp/arangodb.tar.gz \
 && ln -s /opt/arangodb-client/usr/bin/arangodump /usr/local/bin/arangodump \
 && ln -s /opt/arangodb-client/usr/bin/arangorestore /usr/local/bin/arangorestore

WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
