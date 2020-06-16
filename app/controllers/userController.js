const express = require('express');
const mongoose = require("mongoose");
const validateInput = require('./../libs/paramsValidationLib');
const response = require('./../libs/responseLib');
const check = require('./../libs/checkLib');
const shortId = require('shortid');
const passwordLib = require('./../libs/generatePasswordLib');
const time = require('./../libs/timeLib');
const token=require('./../libs/tokensLib')

// Models
const UserModel = mongoose.model('User');
const AuthModel=mongoose.model('Auth');


let helloWorldFunction = (req, res) => {
    res.send("Hello Sumit...!!!");

}

// signup function
let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                if (!validateInput.Email(req.body.email)) {
                    let apiResponse = response.generate(true, "Email does not meet the requirement", 400, null);
                    reject(apiResponse);
                } else if (check.isEmpty(req.body.password)) {
                    let apiResponse = response.generate(true, "Password paramater is missing", 400, null);
                    reject(apiResponse);
                } else {
                    
                    resolve(req);

                }

            } else {
                let apiResponse = response.generate(true, "One or more parameter(s) is missing", null);
                reject(apiResponse);
            }
        });
    } // end validateUserInput


    let createUser = () => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email.toLowerCase()})
                .exec((err, retrievedUserDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, "Failed to create User", 500, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(retrievedUserDetails)) {
                        console.log(req.body);
                        let newUser = new UserModel({
                            userId: shortId.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashPassword(req.body.password),
                            createdOn: time.now(),
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                console.log(err);
                                let apiResponse = response.generate(true, "Failed to create newUser", 500, null);
                                reject(apiResponse);
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj);
                            }
                        })


                    } else {
                        let apiResponse = response.generate(true, "User already present with this email", 403, null);
                        reject(apiResponse);
                    }
                })
        })
    }// end createUser Function

    validateUserInput(req, res)
        .then(createUser)
        .then((resolve) => {
            delete resolve.password;
            let apiResponse = response.generate(false, "User created", 200, resolve)
            res.send(apiResponse);
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })

}//end signUpFunction

let loginFunction = (req, res) => {

    let findUser = () => {
        console.log("find user..");
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                    if (err) {
                        let apiResponse = response.generate(true, "failed to find user details", 500, null);
                        reject(apiResponse);
                    } else if (check.isEmpty(userDetails)) {
                        let apiResponse = response.generate(true, "No user details found", 404, null);
                        reject(apiResponse);
                    } else {

                        resolve(userDetails);
                    }
                })
            } else {
                let apiResponse = response.generate(true, "Email parameter is missing", 400, null);
                reject(apiResponse);
            }

        })
    } // end findUser


    let validatePassword=(retrievedUserDetails)=>{
        console.log("Inside Validate password");
        return new Promise((resolve,reject)=>{
            passwordLib.comparePassword(req.body.password,retrievedUserDetails.password,(err,isMatch)=>{
                if(err){
                    let apiResponse=response.generate(true,"Login failed...",500,null);
                    reject(apiResponse);
                }else if(isMatch){
                    let retrievedUserDetailsObj=retrievedUserDetails.toObject();
                    delete retrievedUserDetailsObj.password;
                    delete retrievedUserDetailsObj._id;
                    delete retrievedUserDetailsObj.__v;
                    delete retrievedUserDetailsObj.createdOn;
                    delete retrievedUserDetailsObj.modifiedOn;
                    resolve(retrievedUserDetailsObj);
                }else{
                    let apiResponse=response.generate(true,"Wrong password Login Failed",400,null);
                    reject(apiResponse);
                }
            })

        })
    }  //end  Validate password function 

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
    }  // end generate token

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
                        tokenGenerationTime: time.now(),
                        role:'user'
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
                                userDetails: tokenDetails.userDetails,
                                role:newTokenDetails.role
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
                                userDetails: tokenDetails.userDetails,
                                role:'user'
                            }
                            resolve(responseBody)
                            //console.log(responseBody);
                        }
                    })
                }
            })
        })
    }   // end save token
       

    findUser(req,res)
    .then(validatePassword)
    .then(generateToken)
    .then(saveToken)
    .then((resolve)=>{
        if(check.isAdmin(resolve.userDetails.email)){
            resolve.role='admin';
            let apiResponse=response.generate(false,"Login Successfull",869,resolve);
        res.send(apiResponse)
        }else{
        let apiResponse=response.generate(false,"Login Successfull",200,resolve);
        res.send(apiResponse)
        console.log(resolve);
        }
    })
    .catch((err)=>{
        console.log("Error Handler");
        console.log(err);
        res.status(err.status);
        res.send(err);
    })

}  //end login Function

let getAllUser=(req,res)=>{
        UserModel.find()
        .select('-__v  -_id')
        .lean()
        .exec((err,result)=>{
            if(err){
                let apiResponse=response.generate(true,"Failed to load All Users",500,null);
                res.send(apiResponse);
            }else if(check.isEmpty(result)){
                let apiResponse=response.generate(true,"No User Details Found",404,null);
                res.send(apiResponse);
            }else{
                let apiResponse=response.generate(false,"All users details found",200,result);
                res.send(apiResponse);
            }
        })
   
} // End getAllUser

let getsingleUser=(req,res)=>{
    UserModel.findOne({'userId':req.params.userId})
    .exec((err,result)=>{
        if(err){
            let apiResponse=response.generate(true,"Failed to load User",500,null);
            res.send(apiResponse);
        }else if(check.isEmpty(result)){
            let apiResponse=response.generate(true,"No User Details Found",404,null);
            res.send(apiResponse);
        }else{
            let apiResponse=response.generate(false,"User details found",200,result);
            res.send(apiResponse);
        }
    })

} // End getSingleUserInformation

let deleteUser=(req,res)=>{
    UserModel.findOneAndRemove({'userId':req.params.userId}).exec((err,result)=>{
        if(err){
            let apiResponse=response.generate(true,"Failed to delete user",500,null);
            res.send(apiResponse);
        }else if(check.isEmpty(result)){
            let apiResponse=response.generate(true,"No user Found",404,null);
            res.send(apiResponse);
        }else{
            let apiResponse=response.generate(false,"User deleted successfully",200,result);
            res.send(apiResponse);
        }
    });
}  // end delete User


let logout=(req,res)=>{
    console.log(req);
    AuthModel.findOneAndRemove({userId:req.body.userId},(err,result)=>{
        if(err){
            let apiResponse=response.generate(true,`error occured:${err.message}`,500,null);
            res.send(apiResponse);
        }else if(check.isEmpty(result)){
            let apiResponse=response.generate(true,"Already SignOut or Invalid userId",404,null);
            res.send(apiResponse)
        }else{
            let apiResponse=response.generate(false,"Logout SuccessFull",200,null)
            res.send(apiResponse);
        }
    })
}  // end of logout function




module.exports = {
    helloWorldFunction: helloWorldFunction,
    signUpFunction: signUpFunction,
    loginFunction:loginFunction,
    getAllUser:getAllUser,
    getsingleUser:getsingleUser,
    deleteUser:deleteUser,
    logout:logout,
    
}
