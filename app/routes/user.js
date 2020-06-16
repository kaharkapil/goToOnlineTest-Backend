const express=require('express');

const router=express.Router();
const appConfig=require('./../../config/appConfig');
const userController=require('./../controllers/userController');



module.exports.setRouter=(app)=>{
    console.log("inside userRouter");
    let baseUrl=`${appConfig.apiVersion}/users`;

    app.get('/',userController.helloWorldFunction);
    app.post(`${baseUrl}/signup`,userController.signUpFunction);
    app.post(`${baseUrl}/login`,userController.loginFunction);
    app.get(`${baseUrl}/all`,userController.getAllUser);
    app.post(`${baseUrl}/:userId/delete`,userController.deleteUser);
    app.post(`${baseUrl}/logout`,userController.logout);
    app.get(`${baseUrl}/:userId`,userController.getsingleUser);
}