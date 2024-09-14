# Introduction

This project is a simple Node.js server that uses MongoDB.
A Docker container is used to run the server.
Docker Compose is used to run the server and MongoDB container.

The example API endpoint is `/property` which returns a list of properties.
The properties are stored in a MongoDB database.
The server uses Fastify and Mongoose to interact with the database.

The Postman collection contains the basic API requests to test the server.

# Prerequisites

- Docker
- Docker Compose
- Node

# Run the project

## Install server dependencies

``` shell
cd server
npm i
```

## Run Docker container

``` shell
cd ..
docker-compose up
```
