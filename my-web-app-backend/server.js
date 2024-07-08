const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const setupSwagger = require("./swagger");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

setupSwagger(app);

// Initialize SQLite database and specify a file-based database
const dbPath = path.resolve(__dirname, "tasks.db");
const db = new sqlite3.Database(dbPath);

// Create users table if it doesn't exist
db.serialize(() => {
  // Create tasks table
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    taskTitle TEXT NOT NULL,
    description TEXT,
    dateDue TEXT,
    status TEXT,
    createdDate TEXT NOT NULL
  )`);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - taskTitle
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the task
 *         taskTitle:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: The description of the task
 *         dateDue:
 *           type: string
 *           format: date
 *           description: The due date of the task
 *         status:
 *           type: string
 *           description: The status of the task (e.g., new, in progress, completed)
 *         createdDate:
 *           type: string
 *           format: date-time
 *           description: The date and time when the task was created
 *       example:
 *         id: d5fE_asz
 *         taskTitle: Sample Task
 *         description: This is a sample task
 *         dateDue: 2023-12-31
 *         status: new
 *         createdDate: 2023-01-01T12:00:00Z
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Returns the list of all the tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: The list of the tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: The task was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       500:
 *         description: Some server error
 */
app.post("/tasks", (req, res) => {
  const newTask = {
    id: uuidv4(),
    ...req.body,
    createdDate: new Date().toISOString(),
  };
  console.log(newTask);
  const { id, taskTitle, description, dateDue, status, createdDate } = newTask;
  db.run(
    "INSERT INTO tasks (id, taskTitle, description, dateDue, status, createdDate) VALUES (?, ?, ?, ?, ?, ?)",
    [id, taskTitle, description, dateDue, status, createdDate],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(newTask);
    }
  );
});

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: The task was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: The task was not found
 *       500:
 *         description: Some error happened
 */
app.put("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const { taskTitle, description, dateDue, status } = req.body;
  db.run(
    "UPDATE tasks SET taskTitle = ?, description = ?, dateDue = ?, status = ? WHERE id = ?",
    [taskTitle, description, dateDue, status, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ id, taskTitle, description, dateDue, status });
    }
  );
});

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Remove the task by id
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The task id
 *     responses:
 *       204:
 *         description: The task was deleted
 *       404:
 *         description: The task was not found
 */
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(204).send();
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
