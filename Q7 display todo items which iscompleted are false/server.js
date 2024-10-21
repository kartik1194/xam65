const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Path to the todo.json file
const TODO_FILE_PATH = path.join(__dirname, 'todo.json');

// Endpoint to get pending tasks
app.get('/GetTodo', (req, res) => {
    fs.readFile(TODO_FILE_PATH, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reading tasks file.' });
        }

        const tasks = JSON.parse(data);
        const pendingTasks = tasks.filter(task => !task.isCompleted); // Filter for tasks that are not completed

        res.json({ success: true, tasks: pendingTasks });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
