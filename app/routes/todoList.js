const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const todoListController = require("./../../app/controllers/todoListItemController");

const appConfig = require("./../../config/appConfig")

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/todolist`;

    // defining routes.


 /**
     * @apiGroup todolist
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/createList to createList .
     *
     * @apiParam {string} userId userId of the user. (auth headers) (required)
     * @apiParam {string} listName listName of the user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
            {
                "error": false,
                "message": "List created",
                "status": 200,
                "data": {
                    "__v": 0,
                    "userId": "ryaV5mkQX",
                    "listName": "name",
                    "listId": "SyuEFgGEX",
                    "_id": "5b54792fbe010b20e0dd8ce1",
                    "modifiedOn": "2018-07-22T12:31:31.277Z",
                    "createdOn": "2018-07-22T12:31:43.000Z"
                }
            }
    */

    app.post(`${baseUrl}/createList`, todoListController.createList);

    /**
     * @apiGroup todolist
     * @apiVersion  1.0.0
     * @api {get} /api/v1/todolist/getAllLists/:userId to getAllLists .
     *
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
                        {
                    "error": false,
                    "message": "All List Details Found",
                    "status": 200,
                    "data": [
                        {
                            "_id": "5b53e9224a15531eccd2141a",
                            "userId": "ryaV5mkQX",
                            "listName": "manoj",
                            "listId": "SkcQYw-Em",
                            "__v": 0,
                            "modifiedOn": "2018-07-22T02:11:36.442Z",
                            "createdOn": "2018-07-22T02:17:06.000Z"
                        },
                        {
                            "_id": "5b54652bfc6c4f1b78329590",
                            "userId": "ryaV5mkQX",
                            "listName": "mouni",
                            "listId": "ryc1B1f47",
                            "__v": 0,
                            "modifiedOn": "2018-07-22T11:04:12.941Z",
                            "createdOn": "2018-07-22T11:06:19.000Z"
                        },
                        
                        
                        
                    ]
                }
    */

    app.get(`${baseUrl}/getAllLists/:userId`, todoListController.getAllLists);

        /**
     * @apiGroup todolist
     * @apiVersion  1.0.0
     * @api {post} /api/v1/:userId/:listId/deleteList to deleteList .
     *
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
             {
                "error": false,
                "message": "List Deleted Successfully",
                "status": 200,
                "data": {
                    "n": 1,
                    "nModified": 1,
                    "ok": 1
                }
            }
    */


    app.post(`${baseUrl}/:userId/:listId/deleteList`, todoListController.deleteList);
    app.post(`${baseUrl}/:userId/:listId/editList`, todoListController.editListName);

/**
     * @apiGroup todolist
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/:userId/:listId/acceptFriend to acceptFriend .
     *
     * @apiParam {friendRequestId} friendRequestId friendRequestId of the friend user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
                    {
                    "error": false,
                    "message": "FriendRequest Details Saved Successfully",
                    "status": 200,
                    "data": {
                        "__v": 0,
                        "friendRequestId": "Hy3E5xMVm",
                        "friendId": "ryaV5mkQX",
                        "friendEmail": "manojprabhakar675@gmail.com",
                        "userId": "S128st-Nm",
                        "listId": "Bk1vE6ZVm",
                        "userEmail": "prabhakar.manoj@divum.in",
                        "userName": "Manoj  K",
                        "_id": "5b547a33be010b20e0dd8ce2",
                        "modifiedOn": "2018-07-22T12:31:31.239Z",
                        "createdOn": "2018-07-22T12:36:03.000Z"
                    }
                }
    */

    app.post(`${baseUrl}/:userId/:listId/sentFriendRequest`, todoListController.sentFriendRequest);

    /**
     * @apiGroup todolist
     * @apiVersion  1.0.0
     * @api {post} /api/v1/todolist/:userId/:listId/sentFriendRequest to sentFriendRequest .
     *
     * @apiParam {email} email email of the friend user. (auth headers) (required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
                                    {
                    "error": false,
                    "message": "FriendRequest Accepted Successfully",
                    "status": 200,
                    "data": {
                        "__v": 0,
                        "userId": "ryaV5mkQX",
                        "listName": "mouni",
                        "listId": "ryc1B1f47",
                        "_id": "5b547b30be010b20e0dd8ce3",
                        "modifiedOn": "2018-07-22T12:31:31.277Z",
                        "createdOn": "2018-07-22T12:40:16.000Z"
                    }
                }
    */

    app.post(`${baseUrl}/acceptFriend`, todoListController.acceptFriendRequest);










}
