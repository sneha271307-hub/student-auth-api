const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});


const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

     
        const hashedPassword = await bcrypt.hash(password, 10);

       
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user"
        });

       
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        
        const otp = crypto.randomInt(100000, 1000000).toString();


        const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);


        user.otp = await bcrypt.hash(otp, 10);
        user.otpExpiresAt = otpExpiresAt;

        await user.save();

            await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Your Login OTP",
            text: `Your OTP is ${otp}. It is valid for 5 minutes.`
        });

      
        return res.status(200).json({
            message: "OTP sent to your email"
        });
        

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

// VERIFY OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }

        // Check if OTP exists
        if (!user.otp || !user.otpExpiresAt) {
            return res.status(401).json({
                message: "OTP not found or expired"
            });
        }

        // Check OTP expiry
        if (user.otpExpiresAt < new Date()) {
            return res.status(401).json({
                message: "OTP expired"
            });
        }

        // Compare entered OTP with hashed OTP
        const isOTPValid = await bcrypt.compare(otp, user.otp);

        if (!isOTPValid) {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }

        // OTP is correct, so remove it
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        await user.save();

        // Create JWT
        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "OTP verified successfully",
            token
        });

    } catch (error) {
        return res.status(500).json({
            message: "OTP verification failed",
            error: error.message
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    verifyOTP
};