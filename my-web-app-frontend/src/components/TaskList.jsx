import React from "react";

const TaskList = ({ tasks, onEdit, onDelete }) => (
  <table className="tasks-table">
    <thead>
      <tr>
        <th>Task</th>
        <th>Description</th>
        <th>Due</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {tasks.map((task) => (
        <tr key={task.id}>
          <td>{task.taskTitle}</td>
          <td>{task.description}</td>
          <td>{task.dateDue}</td>
          <td>{task.status}</td>
          <td>
            <button className="edit-button" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button className="delete-button" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default TaskList;
