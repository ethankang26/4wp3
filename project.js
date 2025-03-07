const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./db/tasks.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tasks table (missing status column)
db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    course_name TEXT NOT NULL,
    due_date TEXT NOT NULL,
    priority INTEGER NOT NULL
)`);

app.use(express.urlencoded({ extended: true }));

// Route to display tasks
app.get('/', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            console.error(err.message);
        }
        res.json(rows);
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
