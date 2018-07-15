'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let todoListItemSchema = new Schema({
    userId: {
    type: String
  },
  listId: {
    type:String
  },
   listName: {
    type:String
  },
  createdOn :{
    type:Date,
    default:""
  },
  modifiedOn :{
    type:Date,
    default:Date.now()
  }
  


})


mongoose.model('ToDoList', todoListItemSchema);