const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Middleware to serve static files (for the HTML page)
app.use(express.static(path.join(__dirname)));

// Path to the users.json file
const USERS_FILE_PATH = path.join(__dirname, 'users.json');

// Endpoint to get users by region
app.post('/GetUsers', (req, res) => {
    const { region } = req.body;

    fs.readFile(USERS_FILE_PATH, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reading users file.' });
        }

        const users = JSON.parse(data);
        const filteredUsers = users.filter(user => user.region === region);

        res.json({ success: true, users: filteredUsers });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
