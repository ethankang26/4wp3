const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
const port = 3000;
const dbPath = './db/tasks.db';

// Ensure the 'db' folder exists
if (!fs.existsSync('./db')) {
    fs.mkdirSync('./db');
}

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("SQLite Connection Error:", err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tasks table (if it doesn’t exist)
db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    course_name TEXT NOT NULL,
    due_date TEXT NOT NULL,
    priority INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
)`, (err) => {
    if (err) {
        console.error("Error creating table:", err.message);
    }
});

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Route to fetch all tasks
app.get('/', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            console.error("Error fetching tasks:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
