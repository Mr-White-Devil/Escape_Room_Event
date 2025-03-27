require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (index.html and others)
app.use(express.static(path.join(__dirname)));

// Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'sharafath',
    password: '1412', // Add MySQL password if needed
    database: 'ESCAPE_ROOMS'
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ Connected to MySQL Database!');
});

// ============================= //
//           ROUTES              //
// ============================= //

// Serve index.html for root "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// USER REGISTRATION
app.post('/register', (req, res) => {
    const { username, mail, password } = req.body;

    db.query('SELECT * FROM USER_DATA WHERE MAIL_ID = ?', [mail], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error!' });

        if (result.length > 0) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        const sql = 'INSERT INTO USER_DATA (USER_NAME, MAIL_ID, PASSWORD, SCORE, ESTIMATED_TIME) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [username, mail, password, 0, '00:00'], (err) => {
            if (err) return res.status(500).json({ message: 'Database error while registering!' });

            res.json({ message: 'Registration successful!' });
        });
    });
});

// USER LOGIN
app.post('/login', (req, res) => {
    const { mail, password } = req.body;

    db.query('SELECT * FROM USER_DATA WHERE MAIL_ID = ?', [mail], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error!' });

        if (result.length === 0) {
            return res.status(400).json({ message: 'User not found!' });
        }

        const user = result[0];

        if (password !== user.PASSWORD) {
            return res.status(401).json({ message: 'Incorrect password!' });
        }

        const token = jwt.sign({ mail: user.MAIL_ID, username: user.USER_NAME }, SECRET_KEY, { expiresIn: '2h' });

        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000 // 2 hours
        });

        res.json({ message: 'Login successful!', token, user });
    });
});

// SESSION CHECK
app.get('/session', (req, res) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ loggedIn: false, message: "No token found" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ loggedIn: true, username: decoded.username, mail: decoded.mail });
    } catch (error) {
        // If token is invalid or expired, clear the cookie and return 401
        res.clearCookie("auth_token", { httpOnly: true, secure: true, sameSite: "Strict" });
        res.status(401).json({ loggedIn: false, message: "Invalid or expired token" });
    }
});

// USER LOGOUT
app.post('/logout', (req, res) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logged out successfully!' });
});

// UPDATE SCORE
app.post('/update-score', (req, res) => {
    const { mail, score } = req.body;

    if (!mail || !score) {
        return res.status(400).json({ message: 'Missing required fields!' });
    }

    // First, get the current score from the database
    db.query('SELECT SCORE FROM USER_DATA WHERE MAIL_ID = ?', [mail], (err, results) => {
        if (err) {
            console.error("❌ Error fetching current score:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found!" });
        }

        let currentScore = results[0].SCORE || 0; // Get current score or default to 0
        let newScore = currentScore + parseInt(score); // Add the new score to the current score

        // Now update the score in the database
        db.query('UPDATE USER_DATA SET SCORE = ? WHERE MAIL_ID = ?', [newScore, mail], (updateErr) => {
            if (updateErr) {
                console.error("❌ Error updating score:", updateErr);
                return res.status(500).json({ error: "Failed to update score" });
            }

            res.json({ message: "✅ Score updated successfully!", newScore });
        });
    });
});

// Endpoint to update estimated time
app.post('/update-time', (req, res) => {
    const { mail, time } = req.body;

    if (!mail || !time) {
        return res.status(400).json({ message: 'Missing required fields!' });
    }

    db.query('UPDATE USER_DATA SET ESTIMATED_TIME = ? WHERE MAIL_ID = ?', [time, mail], (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error!' });
        }

        res.json({ message: 'Time updated successfully!', time });
    });
});

// Endpoint to fetch all users
app.get('/admin/view-users', (req, res) => {
    db.query('SELECT * FROM USER_DATA', (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error!' });
        }
        res.json(result); // Send the result as JSON
    });
});

// ============================= //
//        START SERVER           //
// ============================= //
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});