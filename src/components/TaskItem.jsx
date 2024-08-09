import React from "react";
import { ListItem, ListItemText, Checkbox } from "@mui/material";

function TaskItem({ task, onStatusChange }) {
  const handleChange = () => {
    onStatusChange(
      task._id,
      task.status === "pending" ? "completed" : "pending"
    );
  };

  return (
    <ListItem>
      <Checkbox checked={task.status === "completed"} onChange={handleChange} />
      <ListItemText primary={task.title} secondary={task.description} />
    </ListItem>
  );
}

export default TaskItem;
