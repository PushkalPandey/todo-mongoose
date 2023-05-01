const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  text: {
       type: String,
       unique: true    
 },
  imagePath: String,
  done : {
    type: Boolean,
    default: false
},
  createdBy: String
});

const todoModel = mongoose.model('todo_lists', todoSchema);

module.exports = todoModel;

