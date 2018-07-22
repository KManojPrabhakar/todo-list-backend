'use strict'
/**
 * Module Dependencies
 */
const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

let FriendRequestSchema = new Schema({

  friendRequestId: {
    type: String
  },
  friendId: {
    type: String
  },
  friendEmail :{
    type:String
  },
  userId: {
    type: String
  },
  listId: {
    type: String
  },
  userEmail : {
    type: String
  },
  userName : {
    type:String
  },
  createdOn: {
    type: Date,
    default: ""
  },
  modifiedOn: {
    type: Date,
    default: Date.now()
  }



})


mongoose.model('FriendRequest', FriendRequestSchema);