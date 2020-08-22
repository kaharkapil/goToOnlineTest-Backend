
const express=require('express');
const mongoose=require('mongoose');

const router=express.Router();
const appConfig=require('./../../config/appConfig');
const testController=require('./../controllers/testController');

module.exports.setRouter=(app)=>{
    console.log("Inside testRouter")

    let baseUrl=`${appConfig.apiVersion}/test`;

    app.post(`${baseUrl}/create-test`,testController.createTestFunction);

    app.get(`${baseUrl}/view/all`,testController.getAllTestFunction);

    app.post(`${baseUrl}/:testId/delete`,testController.deleteTest);

    app.put(`${baseUrl}/edit/:testId`,testController.editTest);

    app.get(`${baseUrl}/view/:testId`,testController.getSingleTestInformation);

    app.post(`${baseUrl}/:testId/addUser`,testController.addAttemptedUsers)

    app.post(`${baseUrl}/addPerformance`,testController.addPerformance)

    app.get(`${baseUrl}/result/:email/:testId`,testController.getPerformance)
}