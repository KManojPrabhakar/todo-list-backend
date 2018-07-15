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



var nodemailer = require("nodemailer");


let mailMessages;
let saveUserId;
let resetToken;

let forgotEmail;

let updatePasswordValue;

var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "nodemailcheck@gmail.com", //from mail
        pass: "Nodemail@123" //password
    }
});

// start user signup function 


let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, 'Email Does not met the requirement', 400, null)
                    reject(apiResponse)
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, '"password" parameter is missing"', 400, null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field Missing During User Creation', 'userController: createUser()', 5)
                let apiResponse = response.generate(true, 'One or More Parameter(s) is missing', 400, null)
                reject(apiResponse)
            }
        })
    }// end validate user input
    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email.toLowerCase() })
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        logger.error(err.message, 'userController: createUser', 10)
                        let apiResponse = response.generate(true, 'Failed To Create User', 500, null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            countryCode: req.body.countryCode,
                            createdOn: time.now(),
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: createUser', 10)
                                let apiResponse = response.generate(true, 'Failed to create new User', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User Cannot Be Created.User Already Present', 'userController: createUser', 4)
                        let apiResponse = response.generate(true, 'User Already Present With this Email', 403, null)
                        reject(apiResponse)
                    }
                })
        })
    }// end create user function


    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password
            let apiResponse = response.generate(false, 'User created', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}// end user signup function 



// start of login function 
let loginFunction = (req, res) => {
    let that = this;
    let findUser = () => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ email: req.body.email.toLowerCase()}, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser()', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                         mailMessages = {
                            email:req.body.email.toLowerCase(),
                            text:'Hey, you successfully login from "To Do List"'
                        }

                        logger.info('User Found', 'userController: findUser()', 10)
                        resolve(userDetails);
                        
                    }
                });
               
            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }
    let validatePassword = (retrievedUserDetails) => {
        console.log("validatePassword");
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrievedUserDetails.password, (err, isMatch) => {
                saveUserId = retrievedUserDetails.userId;
                console.log("userDetails",retrievedUserDetails);
                mailMessages.subject=(retrievedUserDetails.firstName)+', welcome  to your "To Do List" '; //for sending  subject in mail 
                if (err) {
                    console.log(err)
                    logger.error(err.message, 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Login Failed', 500, null)
                    reject(apiResponse)
                } else if (isMatch) {
                    let retrievedUserDetailsObj = retrievedUserDetails.toObject()
                    delete retrievedUserDetailsObj.password
                    delete retrievedUserDetailsObj._id
                    delete retrievedUserDetailsObj.__v
                    delete retrievedUserDetailsObj.createdOn
                    delete retrievedUserDetailsObj.modifiedOn
                    resolve(retrievedUserDetailsObj)
                } else {
                    logger.info('Login Failed Due To Invalid Password', 'userController: validatePassword()', 10)
                    let apiResponse = response.generate(true, 'Wrong Password.Login Failed', 400, null)
                    reject(apiResponse)
                }
            })
        })
    }

    let generateToken = (userDetails) => {
        console.log("generate token");
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    console.log(err)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else {
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    }
    let saveToken = (tokenDetails) => {
        console.log("save token");
        return new Promise((resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId }, (err, retrievedTokenDetails) => {
                if (err) {
                    console.log(err.message, 'userController: saveToken', 10)
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrievedTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrievedTokenDetails.authToken = tokenDetails.token
                    retrievedTokenDetails.tokenSecret = tokenDetails.tokenSecret
                    retrievedTokenDetails.tokenGenerationTime = time.now()
                    retrievedTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken', 10)
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req,res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            sendSuccessEmail(mailMessages);
            if(resolve && resolve.userDetails && resolve.userDetails.userId) {
                            logger.info("userid After login",resolve.userDetails.userId);
                            global.userId = resolve.userDetails.userId;
            }
            let apiResponse = response.generate(false, 'Login Successful', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })
}


// end of the login function 


let sendSuccessEmail = (mailObject) => {
    console.log("Successful Mail Called")
    var mailOptions = {
        to: mailObject.email,
        subject: mailObject.subject,
        text: mailObject.text
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


let logout = (req, res) => {
  
} // end of the logout function.


let forgotFunction = (req,res) => {
    


    let that = this;
    let findUser = () => {
        console.log("findUser");
         crypto.randomBytes(20, function(err, buf) {
         resetToken = buf.toString('hex');
        forgotEmail = req.body.forgotEmail.toLowerCase();


     });
        return new Promise((resolve, reject) => {
            if (req.body.forgotEmail) {
                console.log("req body email is there");
                console.log(req.body);
                UserModel.findOne({ email: req.body.forgotEmail.toLowerCase()}, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser() in forgotFunction', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {


                         let restPassword = new ResetPasswordModel({
                            resetPasswordToken:resetToken,
                            resetPasswordExpires:Date.now() + 360000 ,
                            email:forgotEmail
                        })
                        console.log("userDetails",userDetails)
                        restPassword.save((err, newUser) => {
                            if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: Forgot ', 10)
                                let apiResponse = response.generate(true, 'Failed to Create Token in Forgot', 500, null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })


                        
                    }
                });
               
            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    findUser(req, res)
        .then((resolve) => {
            console.log("find user",resolve)
            if(resolve && resolve.email) {
                        checkResetMail(resolve)
            }
            let apiResponse = response.generate(false, 'Reset Link Sent to your mail', 200, resolve)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
  
}

let checkResetMail  = (data)  => {

    console.log("Reset Mail  Called",data)
    var mailOptions = {
        to: data.email,
        subject:"Password Reset",
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://localhost:4200/reset/' + data.resetPasswordToken + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
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


let resetFunction = (req,res) => {
    console.log("resetFunction")
    let findToken = () => {
            console.log("findToken")

            return new Promise((resolve, reject) => {
                console.log("token",req.body)
                console.log("token",req.body.resetPasswordToken)
                updatePasswordValue = req.body.resetPassword;
                ResetPasswordModel.findOne({ resetPasswordToken: req.body.resetPasswordToken }, (err, resetPasswordDetails) => {

                    if (err) {
                                console.log(err)
                                logger.error(err.message, 'userController: resetFunction()', 10)
                                let apiResponse = response.generate(true, 'Password Not Updated', 500, null)
                                reject(apiResponse)
                    }else if (check.isEmpty(resetPasswordDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findToken() in resetFunction', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    }
                            else  {

                                console.log(resetPasswordDetails)
                                // logger.error('Failed To Retrieve User Data', 'userController: findUser()', 10)
                                /* generate the error message and the api response message here */
                                // let apiResponse = response.generate(true, 'Password reset token is invalid or has expired.', 401, null)
                                resolve(resetPasswordDetails);
                            }
                });
        })

    }

    let findUser = (resetPasswordDetails) => {
        console.log("findUser");
        return new Promise((resolve, reject) => {
            if (resetPasswordDetails.email) {
                console.log(" resetPasswordDetails email is there");
                UserModel.findOne({ email: resetPasswordDetails.email}, (err, userDetails) => {
                    /* handle the error here if the User is not found */
                    if (err) {
                        console.log(err)
                        logger.error('Failed To Retrieve User Data', 'userController: findUser() in reset Function', 10)
                        /* generate the error message and the api response message here */
                        let apiResponse = response.generate(true, 'Failed To Find User Details', 500, null)
                        reject(apiResponse)
                        /* if Company Details is not found */
                    } else if (check.isEmpty(userDetails)) {
                        /* generate the response and the console error message here */
                        logger.error('No User Found', 'userController: findUser() in reset Function', 7)
                        let apiResponse = response.generate(true, 'No User Details Found', 404, null)
                        reject(apiResponse)
                    } else {
                        /* prepare the message and the api response here */
                        resolve(userDetails);
                        
                    }
                });
               
            } else {
                let apiResponse = response.generate(true, '"email" parameter is missing', 400, null)
                reject(apiResponse)
            }
        })
    }

    let updatePassword = (retriewUserDetails) => {
        return new Promise((resolve, reject) => {

        console.log("updatedpassword",updatePasswordValue)
        console.log("retriewUserDetails",retriewUserDetails)
        
        let updatedPassword =  passwordLib.hashpassword(updatePasswordValue)
        let options = {
            password:updatedPassword
        };
        console.log(options);
        UserModel.update({ 'email': retriewUserDetails.email }, options, { multi: true }).exec((err, result) => {

            if (err) {

                logger.error(`Error Occured : ${err}`, 'Database', 10)
                let apiResponse = responseGenerate.generate(true, 'Error Occured.', 500, null)
                reject(apiResponse)
            } else if (check.isEmpty(result)) {

                let apiResponse = responseGenerate.generate(true, 'User Details Not Found', 404, null)
                reject(apiResponse)
            } else {
                console.log('User Details  Updated Successfully')
                // let apiResponse = responseGenerate.generate(false, 'User Details  updated Successfully.', 200, result)
                // res.send(apiResponse)
                resolve(result)

            }
        })
        console.log("userDetails",retriewUserDetails)
        });
    }

     findToken(req,res)
        .then(findUser)
        .then(updatePassword)
        .then((resolve) => {
            // console.log("in update",global.userId)
            let apiResponse = response.generate(false, 'Password Updated Successfully', 200, resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            console.log("errorhandler");
            console.log(err);
            res.status(err.status)
            res.send(err)
        })


       
}

module.exports = {

    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logout: logout,
    forgot:forgotFunction,
    reset:resetFunction

}// end exports