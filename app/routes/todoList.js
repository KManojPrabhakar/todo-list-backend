const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const todoListController = require("./../../app/controllers/todoListItemController");

const appConfig = require("./../../config/appConfig")

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/todolist`;

    // defining routes.


  

    app.post(`${baseUrl}/createList`, todoListController.createList);

     app.get(`${baseUrl}/getAllLists/:userId`, todoListController.getAllLists);





}
