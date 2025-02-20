const express = require('express');
require('dotenv').config();
const app = express();
// database connection
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

const {
  taskPatch,
  taskPost,
  taskGet,
  taskPut,
  taskDelete,
} = require("./controllers/taskController.js");

const teacherRoutes = require("./controllers/teacherController.js");
const courseRoutes = require("./controllers/courseController.js");


// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  domains: '*',
  methods: "*"
}));


// listen to the task request
app.get("/api/tasks", taskGet);
app.post("/api/tasks", taskPost);
app.patch("/api/tasks", taskPatch);
app.put("/api/tasks", taskPatch);
app.put("/api/tasks", taskPut);
app.delete("/api/tasks", taskDelete);
app.use("/api/teachers", teacherRoutes); 
app.use("/api/courses", courseRoutes);

app.listen(3000, () => console.log(`Example app listening on port 3000!`))
