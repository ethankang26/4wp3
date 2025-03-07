const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const mustacheExpress = require('mustache-express');

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

// Set up Mustache as the template engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));

// Route to display tasks and form
app.get('/', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            console.error("Error fetching tasks:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.render('index', { tasks: rows });
        }
    });
});

// Route to handle form submission (Add Task)
app.post('/add', (req, res) => {
    const { title, course_name, due_date, priority } = req.body;

    // Validate inputs
    if (!title || !course_name || !due_date || isNaN(priority) || priority < 1 || priority > 5) {
        return res.status(400).send("Invalid input. Please ensure all fields are filled correctly.");
    }

    db.run(`INSERT INTO tasks (title, course_name, due_date, priority, status) 
            VALUES (?, ?, ?, ?, 'pending')`,
        [title, course_name, due_date, priority], (err) => {
            if (err) {
                console.error("Error adding task:", err.message);
            }
            res.redirect('/');
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
