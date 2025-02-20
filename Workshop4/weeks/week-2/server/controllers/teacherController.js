const express = require("express");
const Teacher = require("../models/teacherModel");
const router = express.Router();

// Crear un profesor (POST)
const teacherPost = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body); // <-- Para depuración

    const { name, lastName, age, subject } = req.body;

    // Verificar que todos los datos están presentes
    if (!name || !lastName || !age || !subject) {
      return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const teacher = new Teacher({ name, lastName, age, subject });
    const savedTeacher = await teacher.save();

    res.status(201).json(savedTeacher);
  } catch (err) {
    res.status(500).json({ error: "Error al guardar el profesor", details: err.message });
  }
};


// Obtener todos los profesores (GET)
const teacherGet = async (req, res) => {
  try {
    const teachers = await Teacher.find();  
    res.json(teachers);
  } catch (err) {
    res.status(422).json({ error: "Error retrieving teachers", details: err.message });
  }
};

// **Actualizar un profesor (PUT)**
const teacherUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject } = req.body;

    const updatedTeacher = await Teacher.findByIdAndUpdate(
      id, 
      { name, subject }, 
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json(updatedTeacher);
  } catch (err) {
    res.status(422).json({ error: "Error updating the teacher", details: err.message });
  }
};

// **Eliminar un profesor (DELETE)**
const teacherDelete = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(422).json({ error: "Error deleting the teacher", details: err.message });
  }
};

// Definir rutas
router.post("/", teacherPost);
router.get("/", teacherGet);
router.put("/:id", teacherUpdate);  
router.delete("/:id", teacherDelete);  

module.exports = router;
