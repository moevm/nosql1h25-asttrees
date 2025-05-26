FROM gradle:8.5-jdk17 AS build
WORKDIR /app
COPY --chown=gradle:gradle . .
RUN ./gradlew bootJar --no-daemon

FROM openjdk:17-jdk-slim

RUN apt-get update && apt-get install -y curl tar libcurl4 && rm -rf /var/lib/apt/lists/*

ENV ARANGO_DUMP=/usr/bin/arangodump
ENV ARANGO_CLIENT_DIR=/opt/arangodb-client
ENV ARANGO_RESTORE=/usr/bin/arangorestore
ENV ARANGO_USER=root

RUN curl -L https://download.arangodb.com/arangodb312/Community/Linux/arangodb3-client-linux-3.12.4_x86_64.tar.gz -o /tmp/arangodb.tar.gz \
 && mkdir -p /opt/arangodb-client \
 && tar -xzf /tmp/arangodb.tar.gz -C /opt/arangodb-client --strip-components=1 \
 && rm /tmp/arangodb.tar.gz \
 && ln -s /opt/arangodb-client/usr/bin/arangodump /usr/bin/arangodump \
 && ln -s /opt/arangodb-client/usr/bin/arangorestore /usr/bin/arangorestore \
 && mkdir -p /etc/arangodb3 \
 && touch /etc/arangodb3/arangodump.conf \
 && touch /etc/arangodb3/arangorestore.conf

WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
