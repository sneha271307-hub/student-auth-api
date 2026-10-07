const jwt = require("jsonwebtoken");

const socketAuth = (socket, next) => {
    try {
        const token = socket.handshake.auth.token;

        
        if (!token) {
            return next(new Error("Authentication required"));
        }

      
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

       
        socket.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role
        };

        next();

    } catch (error) {
        return next(new Error("Invalid or expired token"));
    }
};

module.exports = socketAuth;