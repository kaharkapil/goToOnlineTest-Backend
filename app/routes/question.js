const express=require('express');
const mongoose=require('mongoose');

const router=express.Router();
const appConfig=require('./../../config/appConfig');


const questionsController=require('./../controllers/questionsController');

module.exports.setRouter=(app)=>{
    console.log("Inside testRouter")

    let baseUrl=`${appConfig.apiVersion}/test`;
    

    app.post(`${baseUrl}/:testId/question/add`,questionsController.addQuestionFunction);

    app.get(`${baseUrl}/:testId/question/all`,questionsController.getAllQuestionOfTest);

    app.get(`${baseUrl}/question/:questionId`,questionsController.getSingleQuestionInformation);

    app.post(`${baseUrl}/question/:questionId/delete`,questionsController.deleteQuestion);



}