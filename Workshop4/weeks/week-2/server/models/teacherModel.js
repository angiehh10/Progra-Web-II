const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: Number, required: true },  
  subject: { type: String, required: true }
});

module.exports = mongoose.model('Teacher', teacherSchema);
