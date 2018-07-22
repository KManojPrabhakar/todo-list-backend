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
const FriendRequestModel = mongoose.model('FriendRequest')



var nodemailer = require("nodemailer");
let receiverUserDetails;
let receiverListId;
let friendEmail;
let friendId;

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "nodemailcheck@gmail.com", //from mail
        pass: "Nodemail@123" //password
    }
});


let createListFunction = (req, res) => {
            console.log(req)

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



let sentFriendRequestFunction = (req, res) => {
        console.log(req)
    friendEmail  = req.body.email;
    receiverListId = req.params.listId
      let findReceiverDetails = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ userId: req.params.userId }, (err, userDetails) => {
                /* handle the error here if the User is not found */
                if (err) {
                    console.log(err)
                    logger.error('Failed To Retrieve User Data', 'todolIstController: findReceiverDetails()', 10)
                    /* generate the error message and the api response message here */
                    let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                    reject(apiResponse)
                    /* if Company Details is not found */
                } else if (check.isEmpty(userDetails)) {
                    /* generate the response and the console error message here */
                    logger.error('No User Found', 'todolIstController: findReceiverDetails()', 7)
                    let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                    reject(apiResponse)
                } else {
                    /* prepare the message and the api response here */
                    let receiverDetails = userDetails.toObject();
                    console.log(receiverDetails);
                    delete receiverDetails.password
                    delete receiverDetails._id
                    delete receiverDetails.__v
                    delete receiverDetails.createdOn
                    delete receiverDetails.modifiedOn
                    logger.info('User Found', 'userController: findFriendDetails()', 10)
                    let apiResponse = response.generate(false, ' User Details Found', 200, receiverDetails)
                    resolve(receiverDetails);

                }
            });
        });
    }

    let findFriendDetails = (receiverDetails) => {
             receiverUserDetails = receiverDetails;
          
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: friendEmail }, (err, userDetails) => {
                /* handle the error here if the User is not found */
                if (err) {
                    console.log(err)
                    logger.error('Failed To Retrieve User Data', 'todolIstController: findEmailFunction()', 10)
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
                    let friendDetails = userDetails.toObject();
                    console.log(friendDetails);
                    delete friendDetails.password
                    delete friendDetails._id
                    delete friendDetails.__v
                    delete friendDetails.createdOn
                    delete friendDetails.modifiedOn
                    logger.info('User Found', 'userController: findFriendDetails()', 10)
                    let apiResponse = response.generate(false, ' User Details Found', 200, friendDetails)
                    resolve(friendDetails);

                }
            });
        });
    }

    let saveFriendDetails  = (friendDetails) => {
        return new Promise((resolve,reject)=> {
                let newFriendDetails = new FriendRequestModel({
                    friendRequestId:shortid.generate(),
                    friendId:friendDetails.userId,
                    friendEmail:friendEmail,
                    userId:receiverUserDetails.userId,
                    listId:receiverListId,
                    userEmail:receiverUserDetails.email,
                    userName:receiverUserDetails.firstName + ' '+receiverUserDetails.lastName,
                    createdOn:time.now()
                })

                delete newFriendDetails._id;
                newFriendDetails.save((err,result)=> {
                    if(err) {
                          console.log(err)
                        logger.error(err.message, 'todolIstController: saveFriendDetails', 10)
                        let apiResponse = response.generate(true, 'Failed to create Friend Request Details', 500, null)
                        reject(apiResponse)
                    } else {
                        let friendDetailsObject = newFriendDetails.toObject();
                        resolve(friendDetailsObject);

                    }
                })
        })

    }
    findReceiverDetails(req,res)
   .then(findFriendDetails)
    .then(saveFriendDetails)
    .then((resolve)=> {
        if(resolve && resolve.friendEmail) {
            sentFriendRequestEmail(resolve);
        }

        let apiResponse=response.generate(false,"FriendRequest Details Saved Successfully",200,resolve);
        res.send(apiResponse);
    })
    .catch((err)=> {
       console.log(err);
        res.send(err);
    })

}

let sentFriendRequestEmail  = (data)  => {

    console.log("Reset Mail  Called",data)
    var mailOptions = {
        from:data.userEmail+'<check@gmail.com>',
        to: data.friendEmail,
        subject:"Accept Invitation",
        text: 'You are receiving this because your friend '+data.userName+' have requested to join  the list of their todolist \n\n' +
          'Please click on the following link, or paste this into your browser to accept the invitation:\n\n' +
          'http://todolist.testmanoj.com/acceptFriend/' + data.friendRequestId + '\n\n' 
        }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function (error, response) {
        console.log("smtpTransport sendMail ")
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.end("sent");
        }
    });

}

let deleteListFunction = (req, res) => {

    if (check.isEmpty(req.params.userId)) {

        console.log('userId should be passed')
        let apiResponse = response.generate(true, 'userId is missing', 403, null)
        res.send(apiResponse)
    } else if (check.isEmpty(req.params.listId)) {
        console.log('listId should be passed')
        let apiResponse = response.generate(true, 'listId is missing', 403, null)
        res.send(apiResponse)
    }
    else {


        ToDoListModel.remove({ 'userId': req.params.userId, 'listId': req.params.listId }, (err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('List  Not Found.')
                let apiResponse = response.generate(true, 'List  Not Found', 404, null)
                res.send(apiResponse)
            } else {
                console.log('List Name Deleted Successfully')
                let apiResponse = response.generate(false, 'List Name Deleted Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }

}

let editListName = (req, res) => {

    if (check.isEmpty(req.params.userId)) {

        console.log('userId should be passed')
        let apiResponse = response.generate(true, 'userId is missing', 403, null)
        res.send(apiResponse)
    } else if (check.isEmpty(req.params.listId)) {
        console.log('listId should be passed')
        let apiResponse = response.generate(true, 'listId is missing', 403, null)
        res.send(apiResponse)
    } else {

        let options = req.body;
        console.log(options);
        ToDoListModel.update({ 'userId': req.params.userId, 'listId': req.params.listId }, options, { multi: true }).exec((err, result) => {

            if (err) {

                console.log('Error Occured.')
                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = response.generate(true, 'Error Occured.', 500, null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)) {

                console.log('List Not Found.')
                let apiResponse = response.generate(true, 'List  Not Found', 404, null)
                res.send(apiResponse)
            } else {
                console.log('List Name Edited Successfully')
                let apiResponse = response.generate(false, 'List Name Edited Successfully.', 200, result)
                res.send(apiResponse)
            }
        })
    }

}



let acceptFriendRequestFunction = (req, res) => {
         let findFriendRequestValues = () => {
                          console.log("friendRequestId",req.body)
             console.log("friendRequestId",req.body.friendRequestId)
        return new Promise((resolve, reject) => {
            FriendRequestModel.findOne({ friendRequestId: req.body.friendRequestId }, (err, friendRequestDetails) => {
                /* handle the error here if the User is not found */
                if (err) {
                    console.log(err)
                    logger.error('Failed To Retrieve Friend Request Details', 'todolIstController: findFriendRequestValues()', 10)
                    /* generate the error message and the api response message here */
                    let apiResponse = response.generate(true, 'Failed To Find Friend Request Details', 500, null)
                    reject(apiResponse)
                    /* if Company Details is not found */
                } else if (check.isEmpty(friendRequestDetails)) {
                    /* generate the response and the console error message here */
                    logger.error('No User Found', 'todolIstController: findFriendRequestValues()', 7)
                    let apiResponse = response.generate(true, 'No Friend Request Details Found', 404, null)
                    reject(apiResponse)
                } else {
                    /* prepare the message and the api response here */

                    logger.info('User Found', 'todolIstController: findFriendRequestValues()', 10)
                    resolve(friendRequestDetails);

                }
            });

        })
    }

    let findListDetails = (friendRequestDetails) => {
        friendId = friendRequestDetails.friendId;
        console.log("listdetails",friendRequestDetails)
         return new Promise((resolve, reject) => {
            ToDoListModel.findOne({ listId: friendRequestDetails.listId }, (err, listDetails) => {
                /* handle the error here if the User is not found */
                if (err) {
                    console.log(err)
                    logger.error('Failed To listDetails ', 'todolIstController: findListDetails()', 10)
                    /* generate the error message and the api response message here */
                    let apiResponse = response.generate(true, 'Failed To Find Friend Request Details', 500, null)
                    reject(apiResponse)
                    /* if Company Details is not found */
                } else if (check.isEmpty(listDetails)) {
                    /* generate the response and the console error message here */
                    logger.error('No listDetails', 'todolIstController: findListDetails()', 7)
                    let apiResponse = response.generate(true, 'No Friend Request Details Found', 404, null)
                    reject(apiResponse)
                } else {
                    /* prepare the message and the api response here */

                    logger.info('listDetails', 'todolIstController: findListDetails()', 10)
                    resolve(listDetails);

                }
            });

        })
    }

     let saveListDetails = (listDetails) => {
        return new Promise((resolve, reject) => {
            console.log("user details in saveListDetails\n", listDetails)
          
            if (listDetails) {
                let newList = new ToDoListModel({
                    userId: friendId,
                    createdOn: time.now(),
                    listName: listDetails.listName,
                    listId: listDetails.listId,

                })
                
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

    findFriendRequestValues(req,res)
    .then(findListDetails)
    .then(saveListDetails)
    .then((resolve)=> {
        

        let apiResponse=response.generate(false,"FriendRequest Accepted Successfully",200,resolve);
        res.send(apiResponse);
    })
    .catch((err)=> {
       console.log(err);
        res.send(err);
    })
}



module.exports = {
    createList: createListFunction,
    getAllLists: getAllListFunction,
    sentFriendRequest: sentFriendRequestFunction,
    deleteList: deleteListFunction,
    editListName: editListName,
    acceptFriendRequest: acceptFriendRequestFunction
}