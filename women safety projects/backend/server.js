// server.js - Simple working version
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
app.get('/', (req, res) => {
    res.json({ message: 'Sakhi Backend API is running!' });
});

app.get('/health', (req, res) => {
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
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({
            success: true,
            data: { user: { id: user.id, name, email, phone }, token },
            message: 'Registration successful'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check password
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '30d' });

        res.json({
            success: true,
            data: { user: { id: user.id, name: user.name, email: user.email }, token },
            message: 'Login successful'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// SOS endpoint
app.post('/api/emergency/sos', (req, res) => {
    try {
        const { type, latitude, longitude } = req.body;

        const emergency = {
            id: emergencies.length + 1,
            type: type || 'sos',
            location: { latitude, longitude },
            status: 'active',
            timestamp: new Date()
        };

        emergencies.push(emergency);

        res.status(201).json({
            success: true,
            data: { emergencyId: emergency.id, status: 'active' },
            message: 'SOS triggered successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Sakhi Backend Server is running!`);
    console.log(`📡 Server URL: http://localhost:${PORT}`);
    console.log(`💚 Health Check: http://localhost:${PORT}/health`);
    console.log(`📝 API Base: http://localhost:${PORT}/api`);
});