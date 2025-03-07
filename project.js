// Version 2: Bug - Forgot to check for empty input fields
const express = require('express');
const mustacheExpress = require('mustache-express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = new sqlite3.Database('./db/tasks.db', (err) => {
    if (err) console.error(err.message);
    console.log('Connected to SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    course_name TEXT,
    due_date TEXT,
    priority INTEGER,
    status TEXT DEFAULT 'pending'
)`);

// Home route to display tasks
app.get('/', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, tasks) => {
        if (err) console.error(err.message);
        res.render('index', { tasks });
    });
});

// Adding a task but forgot to check if inputs are empty
app.post('/add', (req, res) => {
    const { title, course_name, due_date, priority } = req.body;
    db.run('INSERT INTO tasks (title, course_name, due_date, priority, status) VALUES (?, ?, ?, ?, ?)',
        [title, course_name, due_date, priority, 'pending'],
        () => res.redirect('/')
    );
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
