document.addEventListener("DOMContentLoaded", async function () {
  const teacherSelect = document.getElementById("teacherSelect");
  const courseList = document.getElementById("courseList");
  const courseForm = document.getElementById("courseForm");

  async function fetchTeachers() {
    try {
      const response = await fetch("http://localhost:3000/api/teachers");
      if (!response.ok) throw new Error("Failed to fetch teachers");

      const teachers = await response.json();
      teacherSelect.innerHTML = "<option value=''>Select a teacher</option>";

      teachers.forEach(teacher => {
        const option = document.createElement("option");
        option.value = teacher._id;
        option.textContent = `${teacher.name} ${teacher.lastName}`;
        teacherSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  }

  async function fetchCourses() {
    try {
      const response = await fetch("http://localhost:3000/api/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");

      const courses = await response.json();
      console.log("Server answer:", courses); // Verifica la estructura

      if (!Array.isArray(courses)) {
        throw new Error("The server answer isn't an array.");
      }

      courseList.innerHTML = "";
      courses.forEach(course => {
        const li = document.createElement("li");
        li.innerHTML = `
          ${course.name} (${course.code}) - ${course.teacher?.name || "No teacher assigned"} 
          <button onclick="editCourse('${course._id}')">✏️ Edit</button> 
          <button onclick="deleteCourse('${course._id}')">🗑️ Delete</button>
        `;
        courseList.appendChild(li);
      });
    } catch (error) {
      console.error("Error obtaining courses:", error);
    }
  }

  document.getElementById("saveCourseBtn").addEventListener("click", async function () {
    const id = document.getElementById("courseId").value;
    const name = document.getElementById("courseName").value;
    const code = document.getElementById("courseCode").value;
    const description = document.getElementById("courseDesc").value;
    const teacherId = teacherSelect.value;

    if (!name || !code || !description || !teacherId) {
      alert("Please fill in all fields!");
      return;
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `http://localhost:3000/api/courses/${id}` : "http://localhost:3000/api/courses";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code, description, teacherId }),
      });

      if (!response.ok) {
        throw new Error("Error saving the course");
      }

      alert(id ? "Course updated successfully!" : "Course created successfully!");
      courseForm.reset();
      fetchCourses();
    } catch (error) {
      console.error("Error saving the course:", error);
    }
  });

  window.editCourse = async function (id) {
    try {
      const response = await fetch(`http://localhost:3000/api/courses/${id}`);
      if (!response.ok) throw new Error("Failed to fetch course");

      const course = await response.json();

      document.getElementById("courseId").value = course._id;
      document.getElementById("courseName").value = course.name;
      document.getElementById("courseCode").value = course.code;
      document.getElementById("courseDesc").value = course.description;

      // Si el curso tiene profesor, seleccionarlo en el dropdown
      if (course.teacher && course.teacher._id) {
        teacherSelect.value = course.teacher._id;
      } else {
        teacherSelect.value = "";
      }

      alert("Course loaded for editing!");
    } catch (error) {
      console.error("Error loading the course for editing:", error);
    }
  };

  window.deleteCourse = async function (id) {
    if (!confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/courses/${id}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Error deleting the course");
      }

      alert("Course deleted successfully!");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting the course:", error);
    }
  };

  fetchTeachers();
  fetchCourses();
});
