const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request body
app.use(express.json());

// Path to the todo.json file
const TODO_FILE_PATH = path.join(__dirname, 'todo.json');

// Initial dummy tasks (if the file doesn't exist)
const initialTasks = [
    { taskId: '1', name: 'Task 1', status: 'incomplete' },
    { taskId: '2', name: 'Task 2', status: 'complete' },
    { taskId: '3', name: 'Task 3', status: 'incomplete' }
];

// Create the todo.json file with initial tasks if it doesn't exist
if (!fs.existsSync(TODO_FILE_PATH)) {
    fs.writeFileSync(TODO_FILE_PATH, JSON.stringify(initialTasks, null, 4), 'utf8');
}

// Endpoint to update task status
app.post('/updateTask', (req, res) => {
    const { taskId, status } = req.body;

    if (!taskId || !status) {
        return res.status(400).json({ success: false, message: 'Task ID and status are required.' });
    }

    // Read the current tasks from the todo.json file
    fs.readFile(TODO_FILE_PATH, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error reading tasks file.' });
        }

        let tasks = JSON.parse(data);
        
        // Find the task by taskId
        const task = tasks.find(t => t.taskId === taskId);

        if (!task) {
            return res.json({ success: false, message: 'Task not found.' });
        }

        // Update the task's status
        task.status = status;

        // Write the updated tasks back to the todo.json file
        fs.writeFile(TODO_FILE_PATH, JSON.stringify(tasks, null, 4), (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error saving updated tasks.' });
            }
            res.json({ success: true, message: 'Task status updated successfully.' });
        });
    });
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'updateTask.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
