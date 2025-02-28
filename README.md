# Survey API

## Purpose of the API
This API was built for training purposes using:
- **Node.js**
- **MongoDB**
- **GraphQL**
- **JWT Authentication & Security**
- **Clean Architecture Principles**
- **Clean Code, Design Patterns, TDD**

The API allows an **admin** to create surveys and **registered users** to respond to them. Survey results can be retrieved and displayed as shown in the example below:
```json
{
    "surveyId": "67ba24ecde276dbe05d142ad",
    "question": "Qual sua linguagem favorita de programação?",
    "date": "2025-02-22T19:26:36.968Z",
    "answers": [
        { "answer": "Javascript", "count": 2, "percent": 66.67 },
        { "answer": "Java", "count": 1, "percent": 33.33 },
        { "answer": "Python", "count": 0, "percent": 0 },
        { "answer": "C#", "count": 0, "percent": 0 }
    ]
}
```

## Running Locally with Docker

### Services
To run this project, you need to install dependencies, build TypeScript, and start the MongoDB and Node.js containers using Docker Compose.

```sh
# Install dependencies
npm install

# Run the backend
npm run up
```

## Backend
The backend is built with **Node.js**, and **MongoDB** is used for data persistence.

### Collections
#### Surveys
The main collection is `Surveys`, structured as follows:
```json
{
  "_id": { "$oid": "67ba24ecde276dbe05d142ad" },
  "question": "Qual sua linguagem favorita de programação?",
  "answers": [
    { "answer": "Javascript", "image": "http://image-js.com" },
    { "answer": "Python", "image": "http://image-py.com" },
    { "answer": "Java", "image": "http://image-java.com" },
    { "answer": "C#", "image": "http://image-c#.com" }
  ],
  "date": { "$date": "2025-02-22T19:26:36.968Z" }
}
```

#### Log-Error
```json
{
  "_id": { "$oid": "67ab874591b9bb7d8ec252e7" },
  "error": "Error: Error in generating auth token\n    at SignUpController.handle (/usr/src/enquetes-node-api/dist/presentation/controllers/signup/signup.js:35:23)\n    at async LogControllerDecorator.handle (/usr/src/enquetes-node-api/dist/main/decorators/log-controller-decorator.js:10:30)\n    at async /usr/src/enquetes-node-api/dist/main/adapters/express-route-adapter.js:9:30",
  "date": { "$date": "2025-02-11T17:22:13.735Z" }
}
```

#### Survey-Results
```json
{
  "_id": { "$oid": "67ba252c59f9153f604d8c00" },
  "surveyId": { "$oid": "67ba24ecde276dbe05d142ad" },
  "userId": { "$oid": "67ba2413de276dbe05d142ac" },
  "answer": "Javascript",
  "date": { "$date": "2025-02-22T19:27:46.472Z" }
}
```

#### Account
```json
{
  "_id": { "$oid": "67ba2413de276dbe05d142ac" },
  "name": "Cham",
  "email": "champ@gmail.com",
  "password": "$2b$12$Y2YXvD2M/LgP6FxsM/Rq1u/SqzW4Zax5T5oYPbydcs1nq.RhSbRNy",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmEyNDEzZGUyNzZkYmUwNWQxNDJhYyIsImlhdCI6MTc0MDY3Njg5Nn0.9FQUzAK8ryudZPtd38zy0EFCWvZwmlyypv8k8wXVQA8",
  "role": "admin"
}
```

## Authentication
Authentication is implemented using **bcrypt**. Passwords are hashed with a salt of `12` before being stored in the database. After account creation, users are automatically authenticated, and an `accessToken` is generated and saved in the database.

## Middlewares
Two middlewares were implemented:
- **Authentication Middleware**
- **Logging Middleware**

## API Documentation
API routes, payloads, and responses are documented with **Swagger**, accessible at `/api/docs` after starting the application locally.

## GraphQL
GraphQL is also configured in this project and can be used as an alternative to REST API requests.

## Automated Tests
The project includes **unit tests** and **end-to-end (E2E) tests**, covering the system's core functionalities. There are **142 test cases**, validating both individual functions (unit tests), API requests (E2E tests) and also DB interactions tests.

To run the tests:
```sh
npm run test:ci
```
![image](https://github.com/user-attachments/assets/699cb1f9-887c-40e3-8d81-ac23731b0169)


## Continuous Integration (CI)
This project integrates **GitHub Actions** for automated testing and code validation. Test coverage reports are uploaded to **Coveralls** for tracking and analysis.

![image](https://github.com/user-attachments/assets/4dcab261-1f38-4249-93f2-d7e0ee564b12)
