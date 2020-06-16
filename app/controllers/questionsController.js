const express = require('express');
const mongoose = require('mongoose');
const QuestionModel = mongoose.model('Question');
const shortId = require('shortid');
const time = require('./../libs/timeLib');
const response = require('./../libs/responseLib')
const check = require('./../libs/checkLib')

const TestModel = mongoose.model('Test');



let addQuestionFunction = (req, res) => {

    console.log("Inside add Question function");



    TestModel.find({ testId: req.params.testId })
        .select('-__v  -_id __proto__')
        .lean()
        .exec((err, retrievedTestDetails) => {
            if (err) {
                let apiResponse = response.generate(true, "Failed TO load particular test",500, null);
                res.send(apiResponse);
            }else if (check.isEmpty(retrievedTestDetails)) {
                let apiResponse = response.generate(true, "No test Details Found", 404, null);
                res.send(apiResponse);
            }  else {
                let newQuestion = new QuestionModel({
                    testId: req.params.testId,
                    questionId: shortId.generate(),
                    question: req.body.question,
                    optionA: req.body.optionA,
                    optionB: req.body.optionB,
                    optionC: req.body.optionC,
                    optionD: req.body.optionD,
                    answer: req.body.answer,
                    createdOn: time.now(),
                })

                newQuestion.save((err, newQuestion) => {
                    if (err) {
                        console.log(err);
                        let apiResponse = response.generate(true, "Failed to add new Question", 500, null);
                        res.send(apiResponse);
                    } else {
                        let apiResponse = response.generate(false, "Question added successfully", 200, newQuestion);
                        res.send(apiResponse);
                    }
                })
            }
        })
}// end addQuestion function



let getAllQuestionOfTest = (req, res) => {
    TestModel.findOne({ 'testId': req.params.testId })
        .select('-__v  -_id -__proto__')
        .lean()
        .exec((err, result) => {
            if (err) {
                let apiResponse = response.generate(true, "Failed to load paricular Test details with testId ", 500, null);
                res.send(apiResponse);
            } else if (check.isEmpty(result)) {
                let apiResponse = response.generate(true, "No Test  Found with given testId", 404, null);
                res.send(apiResponse);
            } else {
                QuestionModel.find({ 'testId': req.params.testId })
                    .select('-__v  -_id -__proto__')
                    .lean()
                    .exec((err, result) => {
                        if (err) {
                            let apiResponse = response.generate(true, "Failed to question", 500, null);
                            res.send(apiResponse);
                        } else if (check.isEmpty(result)) {
                            let apiResponse = response.generate(true, "No question Found", 404, null);
                            res.send(apiResponse);
                        } else {
                            let apiResponse = response.generate(false, "question found", 200, result);
                            res.send(apiResponse);
                        }
                    })
            }
        })

}


let deleteQuestion = (req, res) => {
    QuestionModel.findOneAndRemove({ 'questionId': req.params.questionId }).exec((err, result) => {
        if (err) {
            console.log(err);
            let apiResponse = response.generate(true, "Failed to delete question", 500, null);
            res.send(apiResponse);
        } else if (check.isEmpty(result)) {
            let apiResponse = response.generate(true, "No question Found", 404, null);
            res.send(apiResponse);
        } else {
            let apiResponse = response.generate(false, "question deleted successfully", 200, result);
            res.send(apiResponse);
        }
    });

}// end delete question


let getSingleQuestionInformation=(req,res)=>{
    QuestionModel.findOne({'questionId':req.params.questionId})
        .select('-__v  -_id __proto__')
        .lean()
        .exec((err,result)=>{
            if(err){
                let apiResponse=response.generate(true,"Failed to load question details ",500,null);
                res.send(apiResponse);
            }else if(check.isEmpty(result)){
                let apiResponse=response.generate(true,"No question Details Found",404,null);
                reject(apiResponse);
            }else{
                console.log(result.questions);
                let apiResponse=response.generate(false,"question details found",200,result);
                res.send(apiResponse);
            }
        })

}



module.exports = {
    addQuestionFunction: addQuestionFunction,
    getAllQuestionOfTest: getAllQuestionOfTest,
    deleteQuestion: deleteQuestion,
    getSingleQuestionInformation:getSingleQuestionInformation,
}