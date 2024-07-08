import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    taskTitle: "",
    description: "",
    dateDue: "",
    status: "",
  });
  const [newTask, setNewTask] = useState({
    taskTitle: "",
    description: "",
    dateDue: "",
    status: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      taskTitle: task.taskTitle,
      description: task.description,
      dateDue: task.dateDue,
      status: task.status,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:3001/tasks/${editingTask.id}`,
        formData
      );
      setEditingTask(null);
      setFormData({
        taskTitle: "",
        description: "",
        dateDue: "",
        status: "",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async () => {
    try {
      await axios.post("http://localhost:3001/tasks", newTask);
      setNewTask({
        taskTitle: "",
        description: "",
        dateDue: "",
        status: "",
      });
      fetchTasks();
    } catch (error) {
      console.error("Error adding task", error);
    }
  };

  return (
    <div className="container">
      <h1>Task Management</h1>

      <div className="add-form">
        <h2>Add New Task</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTask();
          }}
        >
          <label>
            Title:
            <input
              type="text"
              name="taskTitle"
              value={newTask.taskTitle}
              onChange={handleNewTaskInputChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              onChange={handleNewTaskInputChange}
              value={newTask.description}
            />
          </label>
          <button type="submit">Add Task</button>
        </form>
      </div>

      <table className="task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.taskTitle}</td>
              <td>{task.description}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingTask && (
        <div className="edit-form">
          <h2>Edit Task</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <label>
              Task:
              <input
                type="text"
                name="name"
                value={formData.taskTitle}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Description:
              <textarea name="description" onChange={handleInputChange}>
                {formData.description}
              </textarea>
            </label>
            <button type="submit">Update</button>
            <button type="button" onClick={() => setEditingTask(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default App;
