# DEDALUS-EM

This is a small application for dedalus interview managing departments and employees.
It consists of a Spring Boot backend (Java 25) and an Angular (v20+) frontend.
Below are the steps to get everything running locally.

## BACKEND

Step 1 - Docker 

Before running the backend, make sure Docker is up and the containers are running.
From the root of the project:
<br>
    `docker compose up -d`
<br>
This starts all required services (database, pgAdmin)

Step 2 - Spring

No need for `.env` default values are already set if using docker compose

Build project with maven
<br>
    `./mvnw clean install` (for using wrapper)
<br>
Run the application
<br>
    `./mvnw spring-boot:run`
<br>

## FRONTEND

Step 1 - Install dependencies
<br>
    `npm install`
<br>
Step 2 - Run dev server
<br>
    `ng serve`
<br>

Note: if you changed localhost:8080 on backend, change environment file for api url.