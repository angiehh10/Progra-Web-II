document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("createTeacherBtn").addEventListener("click", async function () {
    // Obtén los valores de los campos del formulario
    const name = document.getElementById("teacherName").value.trim();
    const lastName = document.getElementById("teacherLastName").value.trim();
    const age = parseInt(document.getElementById("age").value.trim(), 10); // Convertir a número
    const subject = document.getElementById("teacherSubject").value.trim();

    // Verifica que todos los campos estén completos
    if (!name || !lastName || isNaN(age) || !subject) {
      alert("Por favor, completa todos los campos con valores válidos.");
      return;
    }

    // Crea el objeto con los datos del profesor
    const teacherData = { name, lastName, age, subject };

    try {
      // Envía los datos al servidor
      const response = await fetch("http://localhost:3000/api/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(teacherData),
      });

      const result = await response.json();
      console.log(result);

      // Muestra un mensaje según la respuesta del servidor
      if (response.ok) {
        alert("Profesor creado con éxito!");
        document.getElementById("teacherForm").reset(); // Limpia el formulario después de guardar
      } else {
        alert("Error al crear profesor.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema con la solicitud.");
    }
  });
});
