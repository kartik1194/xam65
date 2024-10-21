const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Middleware to serve static files (for the login page)
app.use(express.static(path.join(__dirname)));

// Path to the users.json file
const USERS_FILE_PATH = path.join(__dirname, 'users.json');

// Endpoint to serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Endpoint to handle login
app.post('/Login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    fs.readFile(USERS_FILE_PATH, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reading users file.' });
        }

        const users = JSON.parse(data);
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
