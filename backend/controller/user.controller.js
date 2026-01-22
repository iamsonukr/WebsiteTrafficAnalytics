
import UserModel from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Create User
export const createUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new UserModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', data:user });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        console.log("Login attempt - Email:", req.body.email);
        console.log("Login attempt - Password:", req.body.password);
        
        const { email, password } = req.body;

        // Find user
        const user = await UserModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("User found:", user.email);
        console.log("Stored hashed password:", user.password);
        console.log("Password from request:", password);
        console.log("Hashed password length:", user.password?.length); // Should be 60 for bcrypt

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log("Password comparison result:", isPasswordValid);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};