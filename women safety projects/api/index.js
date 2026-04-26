import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage (no database needed)
const users = [];
const emergencies = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'sakhi-secret-key-2024';

// Routes
app.get('/api', (req, res) => {
    res.json({ message: 'Sakhi Backend API is running!' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date(), uptime: process.uptime() });
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user exists
        const userExists = users.find(u => u.email === email || u.phone === phone);
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = {
            id: users.length + 1,
            name,
            email,
            phone,
            password: hashedPassword,
            createdAt: new Date()
        };

        users.push(user);

        // Generate token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: { id: user.id, name, email, phone }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Emergency SOS endpoint
app.post('/api/emergency/sos', (req, res) => {
    try {
        const { userId, location, description, contactedPeople } = req.body;

        const emergency = {
            id: emergencies.length + 1,
            userId,
            location,
            description,
            contactedPeople,
            timestamp: new Date(),
            status: 'active'
        };

        emergencies.push(emergency);

        res.status(201).json({
            success: true,
            message: 'Emergency alert sent',
            emergency
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get emergency history
app.get('/api/emergency/history/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const userEmergencies = emergencies.filter(e => e.userId === parseInt(userId));
        res.json({ success: true, emergencies: userEmergencies });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default app;
