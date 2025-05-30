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

// Route to display tasks with sorting and overdue display
app.get('/', (req, res) => {
    let filter = req.query.filter; // "pending", "completed", "overdue"
    let sort = req.query.sort; // Sorting option: "due_date"

    let sql = 'SELECT *, (due_date < DATE("now") AND status = "pending") AS is_overdue FROM tasks';
    let params = [];

    if (filter === 'pending') {
        sql += ' WHERE status = ?';
        params.push('pending');
    } else if (filter === 'completed') {
        sql += ' WHERE status = ?';
        params.push('completed');
    } else if (filter === 'overdue') {
        sql += ' WHERE due_date < DATE("now") AND status = "pending"';
    }

    if (sort === 'due_date') {
        sql += ' ORDER BY due_date ASC';
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error("Error fetching tasks:", err.message);
            res.status(500).json({ error: err.message });
        } else {
            // Add helper flags for Mustache template
            rows.forEach(task => {
                task.pending = task.status === 'pending' && !task.is_overdue;
                task.completed = task.status === 'completed';
                task.overdue = task.is_overdue;
            });

            res.render('index', { tasks: rows, filter, sort });
        }
    });
});


// Route to handle form submission (Add Task)
app.post('/add', (req, res) => {
    const { title, course_name, due_date, priority } = req.body;

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

// Route to delete a task
app.post('/delete/:id', (req, res) => {
    const taskId = req.params.id;

    db.run(`DELETE FROM tasks WHERE id = ?`, [taskId], (err) => {
        if (err) {
            console.error("Error deleting task:", err.message);
        }
        res.redirect('/');
    });
});

// Route to mark a task as completed
app.post('/complete/:id', (req, res) => {
    const taskId = req.params.id;

    db.run(`UPDATE tasks SET status = 'completed' WHERE id = ?`, [taskId], (err) => {
        if (err) {
            console.error("Error marking task as completed:", err.message);
        }
        res.redirect('/');
    });
});

// Route to handle inline task updates
app.post('/edit/:id', (req, res) => {
    const taskId = req.params.id;
    const { title, course_name, due_date, priority } = req.body;

    db.run(
        `UPDATE tasks SET title = ?, course_name = ?, due_date = ?, priority = ? WHERE id = ?`,
        [title, course_name, due_date, priority, taskId],
        (err) => {
            if (err) {
                console.error("Error updating task:", err.message);
            }
            res.redirect('/');
        }
    );
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
