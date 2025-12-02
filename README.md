# DEDALUS-EM

This is a small application for dedalus interview managing departments and employees.
It consists of a Spring Boot backend (Java 25) and an Angular (v20+) frontend.
Below are the steps to get everything running locally.

## BACKEND

Step 1 - Docker 

Before running the backend, make sure Docker is up and the containers are running.
From the root of the project:
    docker compose up -d
This starts all required services (database, pgAdmin)

Step 2 - Spring

No need for .env default values are already set if using docker compose

Build project with maven
    ./mvnw clean install (for using wrapper)
Run the application
    ./mvnw spring-boot:run

## FRONTEND

Step 1 - Install dependencies
    npm install
Step 2 - Run dev server
    ng serve

Note: if you changed localhost:8080 on backend, change environment file for api url.