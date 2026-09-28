require("dotenv").config();



const express = require("express");

const app = express();

app.use(express.json());

const studentRoutes = require("./routes/studentroutes");
app.use("/students", studentRoutes);

const authRoutes = require("./routes/authroutes");
app.use("/auth", authRoutes);

const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});