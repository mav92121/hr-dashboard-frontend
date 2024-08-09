import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [newHires, setNewHires] = useState([]);

  useEffect(() => {
    const fetchNewHires = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewHires(res.data.filter((user) => user.role === "hire"));
    };

    fetchNewHires();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/tasks",
        { title, description, assignedTo },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setDescription("");
      setAssignedTo("");
      alert("Task created successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Add Task
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Assign To</InputLabel>
          <Select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            required
          >
            {newHires.map((hire) => (
              <MenuItem key={hire._id} value={hire._id}>
                {hire.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Add Task
        </Button>
      </form>
    </Container>
  );
}

export default AddTask;
