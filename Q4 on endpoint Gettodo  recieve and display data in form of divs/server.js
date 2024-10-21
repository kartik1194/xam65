const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Path to the todo.json file
const TODO_FILE_PATH = path.join(__dirname, 'todo.json');

// Endpoint to get todo tasks
app.get('/GetTodo', (req, res) => {
    fs.readFile(TODO_FILE_PATH, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reading tasks file.' });
        }

        const tasks = JSON.parse(data);
        res.json({ success: true, tasks });
    });
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'getTodo.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
