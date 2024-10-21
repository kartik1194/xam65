const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Path to the users.json file
const USERS_FILE_PATH = './users.json';

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));  // Change 'public' to whatever folder you use
});

// Signup endpoint
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    // Read the users.json file
    fs.readFile(USERS_FILE_PATH, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reading users file.' });
        }

        let users = [];
        if (data) {
            users = JSON.parse(data);  // Parse existing users
        }

        // Check if the user already exists
        const userExists = users.some(user => user.username === username && user.password === password);

        if (userExists) {
            return res.json({ success: false, message: 'User already exists.' });
        }

        // Add new user to the users array
        users.push({ username, password });

        // Write updated users array back to the users.json file
        fs.writeFile(USERS_FILE_PATH, JSON.stringify(users, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error saving user.' });
            }

            res.json({ success: true, message: 'User registered successfully.' });
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
