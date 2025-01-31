# Task Management Application (Full-Stack)

A full-stack task management application built with React (frontend), Node.js/Express (backend), MongoDB (database), and JWT for authentication. Includes role-based access control (Admin and Agent).

## Features

### Frontend
- User authentication (login/logout) with JWT.
- Dashboard for task management.
- Admin can create, assign, and delete tasks.
- Agents can view and update assigned tasks.
- Responsive UI with React and Bootstrap.

### Backend
- RESTful API with Express.js.
- JWT-based authentication/authorization.
- MongoDB for storing users, tasks, and roles.
- Protected routes for Admin and Agent roles.
- Error handling and validation.

## Prerequisites

- Node.js (v14+)
- MongoDB (local instance or Atlas)
- npm or yarn

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/bitakshat/cstechinfosolutionsassessment.git
cd cstechinfosolutionsassessment
npm install
```

### 2. Start the Backend Server
```
npx nodemon server.js
```
### 3. Start the Frontend
```
cd ./client
npm install 
npm start
```

> Open Browser and search localhost:3000/ in the URL Search bar

### Login Instructions
Select between Admin login and Agent Login from the navbar. For test I have manually created entries in the mongoDB database.
- Login Credentials for Admin - Email: admin@example.com    Password: password123
- Login Credentials for Agent - Email: agent1@example.com   Passowrd: 123password


