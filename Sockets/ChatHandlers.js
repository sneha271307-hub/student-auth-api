// ============================================
// ONLINE USERS
// ============================================

const onlineUsers = {};


// ============================================
// JOIN ROOM
// ============================================

const handleChatJoin = (io, socket, room) => {

    const roomName = room || "general";

    // Join Socket.io room
    socket.join(roomName);

    // Store current room
    socket.currentRoom = roomName;

    // Create room if it doesn't exist
    if (!onlineUsers[roomName]) {
        onlineUsers[roomName] = [];
    }

    // Add user
    onlineUsers[roomName].push({
        id: socket.id,
        name: socket.user.name
    });

    console.log(
        `${socket.user.name} joined room: ${roomName}`
    );

    // Tell other users that someone joined
    socket.to(roomName).emit(
        "chat:user-joined",
        {
            user: socket.user.name,
            room: roomName
        }
    );

    // Send updated online users to everyone
    io.to(roomName).emit(
        "chat:online-users",
        onlineUsers[roomName]
    );
};


// ============================================
// CHAT MESSAGE
// ============================================

const handleChatMessage = (io, socket, text) => {

    if (typeof text !== "string") {
        return;
    }

    const messageText = text.trim();

    if (!messageText) {
        return;
    }

    if (!socket.currentRoom) {
        return;
    }

    const message = {
        text: messageText,
        sender: socket.user.name,
        timestamp: new Date().toISOString()
    };

    io.to(socket.currentRoom).emit(
        "chat:message",
        message
    );
};


// ============================================
// TYPING
// ============================================

const handleTyping = (io, socket, isTyping) => {

    if (!socket.currentRoom) {
        return;
    }

    socket.to(socket.currentRoom).emit(
        "chat:typing",
        {
            user: socket.user.name,
            isTyping: Boolean(isTyping)
        }
    );
};


// ============================================
// DISCONNECT
// ============================================

const handleDisconnect = (io, socket) => {

    const roomName = socket.currentRoom;

    if (!roomName) {
        return;
    }

    if (onlineUsers[roomName]) {

        onlineUsers[roomName] =
            onlineUsers[roomName].filter(
                (user) => user.id !== socket.id
            );

        // Tell remaining users someone left
        socket.to(roomName).emit(
            "chat:user-left",
            {
                user: socket.user.name,
                room: roomName
            }
        );

        // Update online users
        io.to(roomName).emit(
            "chat:online-users",
            onlineUsers[roomName]
        );

        // Remove empty room
        if (onlineUsers[roomName].length === 0) {
            delete onlineUsers[roomName];
        }
    }

};


module.exports = {
    handleChatJoin,
    handleChatMessage,
    handleTyping,
    handleDisconnect
};