
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(path.join(__dirname)));

// Database connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Pass-white28',
    database: 'database'
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected!');
});

// Middleware
app.use(express.json());

// Route to serve the login page (no longer needed if using static files)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT password FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });

        if (results.length === 0) {
            return res.json({ success: false, message: 'Invalid username or password' });
        }

        const hashedPassword = results[0].password;
        bcrypt.compare(password, hashedPassword, (err, isMatch) => {
            if (isMatch) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Invalid username or password' });
            }
        });
    });
});

// Create account route
app.post('/createAccount', (req, res) => {
    const { email, username, password } = req.body;

    const query = 'SELECT id FROM users WHERE username = ? OR email = ?';
    db.query(query, [username, email], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });

        if (results.length > 0) {
            return res.json({ success: false, message: 'Username or email already exists' });
        }

        // Hash the password
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ success: false, message: 'Error hashing password' });

            const insertQuery = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [email, username, hashedPassword], (err, results) => {
                if (err) return res.status(500).json({ success: false, message: 'Database error' });

                res.json({ success: true });
            });
        });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
