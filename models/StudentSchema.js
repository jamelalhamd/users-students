const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const studentSchema = new Schema({
  fname: String,
  lname: String,
  age:String,
  address: String,
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;



