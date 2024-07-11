import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import TaskList from "./TaskList"; // This is your presentational component

const TaskListContainer = forwardRef(({ onEdit, onDelete }, ref) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3001/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchTasks,
  }));

  return <TaskList tasks={tasks} onEdit={onEdit} onDelete={onDelete} />;
});

export default TaskListContainer;
