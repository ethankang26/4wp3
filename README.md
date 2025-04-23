README - Study Planner & Deadline Tracker

Study Planner & Deadline Tracker
================================

A full-stack web application designed to help students manage their academic workload with clarity and ease. This tool enables users to track assignments, quizzes, and exams in a simple, intuitive interface. Tasks can be added, edited, sorted, filtered, and marked as complete — all from one centralized dashboard.

Key Features
------------
- Add tasks with a title, course name, due date, and priority level
- Inline editing directly within the task list
- Sort tasks by due date and filter by status (Pending, Completed, Overdue)
- Mark tasks as completed or delete them entirely
- Dynamic rendering with Mustache.js templating engine
- Responsive interface styled using Bootstrap 5

Tech Stack
----------
**Frontend**: HTML, CSS, JavaScript, Bootstrap 5, Mustache.js  
**Backend**: Node.js, Express.js  
**Database**: SQLite (using sqlite3)

Project Structure
-----------------
study-planner/
├── public/               → Static assets  
├── views/                → Mustache templates  
├── routes/               → Express routes  
├── db/                   → SQLite database and config  
├── server.js             → Main Express app  
└── README.md

How to Run the Application
--------------------------

1. 📦 Install Node.js  
   Make sure you have Node.js installed from https://nodejs.org

2. 🧰 Clone the repository and navigate into the folder:
```bash
git clone https://github.com/your-username/study-planner.git
cd study-planner
```

3. 📥 Install dependencies and start the app:
```bash
npm install
node server.js
```

4. 🚀 Open your browser and visit:  
   `http://localhost:3000`

Ideas for Future Enhancements
-----------------------------
- User authentication for personal task lists
- Calendar view or Gantt-style timeline
- Task reminders with optional push/email notifications
- Dark mode UI toggle

Author
------
Ethan Kang  
Automation Engineering Student at McMaster University  
[linkedin.com/in/ethankang26](https://www.linkedin.com/in/ethankang26)

License
-------
MIT License — free to modify and distribute.

