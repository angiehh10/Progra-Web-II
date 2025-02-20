const Task = require("../models/taskModel");

/**
 * Creates a task
 */
const taskPost = async (req, res) => {
  try {
    const { title, detail } = req.body;

    if (!title || !detail) {
      return res.status(422).json({ error: "No valid data provided for task" });
    }

    const task = new Task({ title, detail });
    const savedTask = await task.save();

    res.status(201).header({ 'location': `http://localhost:3000/api/tasks/?id=${savedTask.id}` }).json(savedTask);
  } catch (err) {
    console.error("Error while saving the task:", err);
    res.status(422).json({ error: "There was an error saving the task", details: err.message });
  }
};

/**
 * Get all tasks or a specific task by ID
 */
const taskGet = async (req, res) => {
  try {
    if (req.query.id) {
      const task = await Task.findById(req.query.id);
      if (!task) {
        return res.status(404).json({ error: "Task doesn't exist" });
      }
      return res.json(task);
    } else {
      const tasks = await Task.find();
      res.json(tasks);
    }
  } catch (err) {
    console.error("Error while querying tasks:", err);
    res.status(422).json({ error: "Error retrieving tasks", details: err.message });
  }
};

/**
 * Updates a task (PATCH)
 */
const taskPatch = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(404).json({ error: "Task ID is required" });
    }

    const task = await Task.findById(req.query.id);
    if (!task) {
      return res.status(404).json({ error: "Task doesn't exist" });
    }

    task.title = req.body.title || task.title;
    task.detail = req.body.detail || task.detail;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error while updating the task:", err);
    res.status(422).json({ error: "There was an error saving the task", details: err.message });
  }
};

/**
 * Updates a task (PUT)
 */
const taskPut = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(404).json({ error: "Task ID is required" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.query.id,
      { title: req.body.title, detail: req.body.detail },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (err) {
    console.error("Error while updating the task:", err);
    res.status(422).json({ error: "There was an error updating the task", details: err.message });
  }
};

/**
 * Deletes a task
 */
const taskDelete = async (req, res) => {
  try {
    if (!req.query.id) {
      return res.status(404).json({ error: "Task ID is required" });
    }

    const deletedTask = await Task.findByIdAndDelete(req.query.id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send(); // No Content
  } catch (err) {
    console.error("Error while deleting the task:", err);
    res.status(422).json({ error: "There was an error deleting the task", details: err.message });
  }
};

module.exports = {
  taskGet,
  taskPost,
  taskPatch,
  taskPut,
  taskDelete
};
