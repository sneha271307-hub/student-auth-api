require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const socketAuth = require("./middleware/SocketAuth");

const {
    handleChatJoin,
    handleChatMessage,
    handleTyping,
    handleDisconnect
} = require("./Sockets/ChatHandlers");

const app = express();


// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json());

app.use(express.static("public"));


// ============================================
// ROUTES
// ============================================

const studentRoutes = require("./routes/studentroutes");

app.use("/students", studentRoutes);


const authRoutes = require("./routes/authroutes");

app.use("/auth", authRoutes);


// ============================================
// DATABASE
// ============================================

const connectDB = require("./config/db");


// ============================================
// SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);


// ============================================
// SOCKET.IO
// ============================================

const io = new Server(server);


// ============================================
// SOCKET AUTHENTICATION
// ============================================

io.use(socketAuth);


// ============================================
// SOCKET CONNECTION
// ============================================

io.on("connection", (socket) => {

    console.log(
        "User connected:",
        socket.id
    );

    console.log(
        "User:",
        socket.user.name
    );


    // ========================================
    // JOIN ROOM
    // ========================================

    socket.on("chat:join", (room) => {

        handleChatJoin(
            io,
            socket,
            room
        );

    });


    // ========================================
    // CHAT MESSAGE
    // ========================================

    socket.on("chat:message", (text) => {

        handleChatMessage(
            io,
            socket,
            text
        );

    });


    // ========================================
    // TYPING
    // ========================================

    socket.on("chat:typing", (isTyping) => {

        handleTyping(
            io,
            socket,
            isTyping
        );

    });


    // ========================================
    // DISCONNECT
    // ========================================

    socket.on("disconnect", () => {

        handleDisconnect(
            io,
            socket
        );

        console.log(
            "User disconnected:",
            socket.id
        );

    });

});


// ============================================
// START SERVER
// ============================================

connectDB().then(() => {

    server.listen(PORT, () => {

        console.log(
            `Server running on port ${PORT}`
        );

    });

});