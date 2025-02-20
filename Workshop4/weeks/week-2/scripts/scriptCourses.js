document.addEventListener("DOMContentLoaded", async function () {
    const teacherSelect = document.getElementById("teacherSelect");
    const courseList = document.getElementById("courseList");
    const courseForm = document.getElementById("courseForm");
  
    async function fetchTeachers() {
      const response = await fetch("http://localhost:3000/api/teachers");
      const teachers = await response.json();
      teacherSelect.innerHTML = "";
      teachers.forEach(teacher => {
        const option = document.createElement("option");
        option.value = teacher._id;
        option.textContent = `${teacher.name} ${teacher.lastName}`;
        teacherSelect.appendChild(option);
      });
    }
  
    async function fetchCourses() {
        try {
          const response = await fetch("http://localhost:3000/api/courses");
          const data = await response.json();
      
          console.log("Server answer:", data); // Verifica la estructura
      
          if (!Array.isArray(data)) {
            throw new Error("The server answer isn't an array.");
          }
      
          courseList.innerHTML = "";
          data.forEach(course => {
            const li = document.createElement("li");
            li.innerHTML = `${course.name} (${course.code}) - ${course.teacher?.name || "There isn't teacher"} 
              <button onclick="editCourse('${course._id}')">Edit</button> 
              <button onclick="deleteCourse('${course._id}')">Delete</button>`;
            courseList.appendChild(li);
          });
        } catch (error) {
          console.error("Error obtaining the courses:", error);
        }
      }
  
    document.getElementById("saveCourseBtn").addEventListener("click", async function () {
      const id = document.getElementById("courseId").value;
      const name = document.getElementById("courseName").value;
      const code = document.getElementById("courseCode").value;
      const description = document.getElementById("courseDesc").value;
      const teacherId = teacherSelect.value;
  
      const method = id ? "PUT" : "POST";
      const url = id ? `http://localhost:3000/api/courses/${id}` : "http://localhost:3000/api/courses";
  
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, code, description, teacherId }),
      });
  
      courseForm.reset();
      fetchCourses();
    });
  
    window.editCourse = async function (id) {
      const response = await fetch(`http://localhost:3000/api/courses/${id}`);
      const course = await response.json();
      document.getElementById("courseId").value = course._id;
      document.getElementById("courseName").value = course.name;
      document.getElementById("courseCode").value = course.code;
      document.getElementById("courseDesc").value = course.description;
    };
  
    window.deleteCourse = async function (id) {
      await fetch(`http://localhost:3000/api/courses/${id}`, { method: "DELETE" });
      fetchCourses();
    };
  
    fetchTeachers();
    fetchCourses();
  });
  