const express = require("express");
const Course = require("../models/courseModel");
const Teacher = require("../models/teacherModel");
const router = express.Router();

// GET - Listar todos los cursos
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name lastName");
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: "Error obtaining the courses", details: err.message });
  }
});

// POST - Crear un nuevo curso
router.post("/", async (req, res) => {
  try {
    const { name, code, description, teacherId } = req.body;

    const teacher = await Teacher.findById(teacherId);
    if (!teacher) return res.status(404).json({ error: "Not found teacher" });

    const course = new Course({ name, code, description, teacher: teacherId });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: "Error creating the course", details: err.message });
  }
});

// GET - Obtener un curso por ID
router.get("/:id", async (req, res) => {
    try {
      const course = await Course.findById(req.params.id).populate("teacher", "name lastName");
      if (!course) return res.status(404).json({ error: "Not found course" });
  
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: "Error obtaining the course", details: err.message });
    }
  });
  
// PUT - Actualizar un curso por ID
router.put("/:id", async (req, res) => {
  try {
    const { name, code, description, teacherId } = req.body;
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { name, code, description, teacher: teacherId },
      { new: true }
    );

    if (!updatedCourse) return res.status(404).json({ error: "Not found course" });

    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json({ error: "Error updating the course", details: err.message });
  }
});

// DELETE - Eliminar un curso por ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ error: "Not found course" });

    res.json({ message: "Correctly delete course" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting course", details: err.message });
  }
});

module.exports = router;
