**Web Application for Health Check**
This repository contains a web application designed to monitor the health of application instances using a RESTful API. The application ensures proper HTTP status code handling, database bootstrapping, and robust error handling.This webapp is developed using Node.js in the Express framework with MySQL as the database. 

**Prerequisites**
Before building and deploying the application locally, ensure the following requirements are met:

**Node.js**: Ensure you have Node.js installed for running the application.
**npm**: A compatible version of npm is required to manage dependencies.
**Database**: A relational database like MySQL or PostgreSQL should be set up and running locally.

**Build and Deploy Instructions**
**Step 1**: Clone the Repository
**Step 2**: Install Dependencies
Run the following command to install all required dependencies: npm install
**Step 3**: Configure the Database
Ensure the database is running locally (e.g., MySQL or PostgreSQL).

Create a .env file in the root directory with the following variables:
**PORT**=The port on which the application will run (default: 8080).
**NODE_ENV**=The environment in which the application is running (development, production, etc.).
**SQL_URI**=mysql://username:password@localhost:3306/ (The connection URI for your MySQL database. Replace root and other details as per your local setup.)
**DATABASE**=The name of the database where health check records will be stored (health_check_db2).

**Step 4**: Run the Application
Start the application using the following command: npm start
The application will start on http://localhost:8080 by default.


**API Documentation**
Health Check Endpoint: GET /healthz
**Purpose**
Monitors the health of the application and records the status in the database.
**Behavior**
Inserts a record into the health check database table.
**The application**:
Returns 200 OK if it successfully connects to the database and inserts the record.
Returns 503 Service Unavailable if the database connection fails or the record cannot be inserted.
Returns 400 Bad Request if the request includes a payload.
Returns 405 Method Not Allowed if any HTTP method other than GET is used for the endpoint.
Returns 404 Not Found if the request is sent to an unrecognized endpoint.


**Troubleshooting**
Ensure the MySQL database is running locally, and the connection URI in the .env file is correct.
Verify the database user credentials and permissions for the specified database.
Check application logs in the terminal for errors during startup or requests.
Ensure all dependencies are installed by running npm install.


