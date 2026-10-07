
# Backend Task 6 - Real-Time Chat

## Overview

This project implements a real-time chat application using
Node.js, Express.js, Socket.io, and JWT authentication.

Users authenticate using JWT before establishing a Socket.io
connection.

## Technologies Used

- Node.js
- Express.js
- Socket.io
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- HTML
- JavaScript

## Features

- JWT socket authentication
- Real-time Socket.io connection
- Chat rooms
- Join notifications
- Real-time chat messages
- Typing indicator
- Online users
- Disconnect cleanup
- Input validation
- Socket authentication error handling

## Project Structure

```text
student-auth-api/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── authcontroller.js
│
├── middleware/
│   └── socketAuth.js
│
├── models/
│
├── routes/
│   ├── authroutes.js
│   └── studentroutes.js
│
├── sockets/
│   └── chatHandlers.js
│
├── public/
│   └── index.html
│
├── .env
├── package.json
├── server.js
└── README.md