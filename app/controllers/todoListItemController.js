const mongoose = require('mongoose');
const shortid = require('shortid');
const crypto = require("crypto");

const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib');
const validateInput = require('../libs/paramsValidationLib')
const check = require('../libs/checkLib')
const passwordLib = require('../libs/password-lib');
const token = require('../libs/token-lib')





/* Models */
const UserModel = mongoose.model('User')
const AuthModel = mongoose.model('Auth')
const ResetPasswordModel = mongoose.model('ResetPassword')
const ToDoListModel = mongoose.model('ToDoList')


var nodemailer = require("nodemailer");


let createListFunction = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userId: req.body.userId }, (err, userDetails) => {
                /* handle the error here if the User is not found */
                if (err) {
                    console.log(err)
                    logger.error('Failed To Retrieve User Data', 'todolIstController: createListFunction()', 10)
                    /* generate the error message and the api response message here */
                    let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                    reject(apiResponse)
                    /* if Company Details is not found */
                } else if (check.isEmpty(userDetails)) {
                    /* generate the response and the console error message here */
                    logger.error('No User Found', 'todolIstController: createListFunction()', 7)
                    let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                    reject(apiResponse)
                } else {
                    /* prepare the message and the api response here */

                    logger.info('User Found', 'userController: findUser()', 10)
                    resolve(userDetails);

                }
            });

        })
    }

    let saveListDetails = (userDetails) => {
        return new Promise((resolve, reject) => {
            console.log("user details in saveListDetails\n", userDetails)
            if (userDetails) {
                let newList = new ToDoListModel({
                    userId: userDetails.userId,
                    createdOn: time.now(),
                    listName: req.body.listName,
                    listId: shortid.generate(),
                })
                if (!req.body.listName) {
                    let apiResponse = response.generate(true, 'Provide List Name', 500, null)
                    reject(apiResponse)
                }
                delete newList._id;

                console.log("newList \n", newList)
                newList.save((err, newListDetails) => {
                    if (err) {
                        console.log(err)
                        logger.error(err.message, 'todolIstController: createList', 10)
                        let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                        reject(apiResponse)
                    } else {

                        let responseBody = newListDetails.toObject();
                        resolve(newListDetails)
                    }
                })
            }
        });
    }


    findUser(req, res)
        .then(saveListDetails)
        .then((resolve) => {
            // delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })


}

let getAllListFunction = (req, res) => {

    if (check.isEmpty(req.params.userId)) {

        console.log('productID should be passed')
        let apiResponse = response.generate(true, 'userId is missing', 403, null)
        res.send(apiResponse)
    } else {
        ToDoListModel.find({ 'userId': req.params.userId }, (err, result) => {
            if (err) {

                console.log(err)
                logger.error(err.message, 'List Controller: getAllLists', 10)
                let apiResponse = response.generate(true, 'Failed To Find List Details', 500, null)
                res.send(apiResponse)

            } else if (check.isEmpty(result)) {
                logger.info('No List Found', 'List Controller: getAllListFunction')
                let apiResponse = response.generate(true, 'No List Found', 404, null)
                res.send(apiResponse)
            } else {
                let apiResponse = response.generate(false, 'All List Details Found', 200, result)
                res.send(apiResponse)
            }
        });

    }


}




module.exports = {
    createList: createListFunction,
    getAllLists: getAllListFunction
}