const mongoose=require('mongoose');
const express=require('express');
const shortId=require('shortid');
const time=require('./../libs/timeLib');
const response=require('./../libs/responseLib')
const customId=require('custom-id')
const check=require('./../libs/checkLib')

const TestModel=mongoose.model('Test');

const PerformanceModel=mongoose.model('Performance')




let createTestFunction=(req,res)=>{

    let testId=Math.floor(100000 + Math.random() * 900000);
    let today=Date.now();

    let newTest=new TestModel({
        testId:testId,
        testName:req.body.testName,
        testDescription:req.body.testDescription,
        testDuration:req.body.testDuration,
        testInstructions:req.body.testInstructions,
        createdOn:today,
        lastModified:today,
    })

    newTest.save((err,result)=>{
        if(err){
            console.log(err)
            let apiResponse=response.generate(true,"Failed to create Test",500,null);
            res.send(apiResponse);
        }else{
            let apiResponse=response.generate(false,"Test created successfully",200,result);
            res.send(apiResponse);
        }
    })
}// end create-test function



let getAllTestFunction=(req,res)=>{
    TestModel.find()
        .select('-__v  -_id')
        .lean()
        .exec((err,result)=>{
            if(err){
                let apiResponse=response.generate(true,"Failed to load All Test",500,null);
                res.send(apiResponse);
            }else if(check.isEmpty(result)){
                let apiResponse=response.generate(true,"No test Details Found",404,null);
                res.send(apiResponse);
            }else{
                let apiResponse=response.generate(false,"All test details found",200,result);
                res.send(apiResponse);
            }
        })
}//end  getAllTest Function


let deleteTest=(req,res)=>{
    TestModel.findOneAndRemove({'testId':req.params.testId}).exec((err,result)=>{
        if(err){
            console.log(err);
            let apiResponse=response.generate(true,"Failed to delete test",500,null);
            res.send(apiResponse);
        }else if(check.isEmpty(result)){
            let apiResponse=response.generate(true,"No test Found",404,null);
            res.send(apiResponse);
        }else{
            let apiResponse=response.generate(false,"Test deleted successfully",200,result);
            res.send(apiResponse);
        }
    });

}// end delete test


let editTest=(req,res)=>{
    let options=req.body;
    TestModel.update({'testId':req.params.testId},options,{ multi: true }).exec((err,result)=>{
        if(err){
            let apiResponse=response.generate(true,"Failed to edit test details",500,null);
        }else if(check.isEmpty(result)){
            let apiResponse=response.generate(true,"No test details found",404,null);
        }else{
            let apiResponse=response.generate(false,"Test details edited successfully",200,result);
            res.send(apiResponse);
        }
    })
} // end edit test function;


let getSingleTestInformation=(req,res)=>{
    TestModel.findOne({'testId':req.params.testId})
        .select('-__v  -_id __proto__')
        .lean()
        .exec((err,result)=>{
            if(err){
                let apiResponse=response.generate(true,"Failed to load Test details ",500,null);
                res.send(apiResponse);
            }else if(check.isEmpty(result)){
                let apiResponse=response.generate(true,"No test Details Found",404,null);
                reject(apiResponse);
            }else{
                console.log(result.questions);
                let apiResponse=response.generate(false,"Test details found",200,result);
                res.send(apiResponse);
            }
        })

}// end  getSingleTestInformation

let addAttemptedUsers=(req,res)=>{
    console.log(req.body);
    let data={
        email:req.body.email,
        score:req.body.score,
    }
    TestModel.findOneAndUpdate({'testId':req.params.testId},{$push:{attemptedBy:data}})
    .exec((err,result)=>{
        if(err){
            let apiResponse=response.generate(true,"Failed to  add attempted users",500,null);
            res.send(apiResponse);
        }else if(check.isEmpty(result)){
            let apiResponse=response.generate(true,"No test details found",404,null);
            res.send(apiResponse);
        }else{
            let apiResponse=response.generate(false,"user attempted added successfully",200,result);
            res.send(apiResponse);
        }
    })
} // end edit test function;

let addPerformance=(req,res)=>{
    let newPerformance=new PerformanceModel({
        userEmail:req.body.userEmail,
        testId:req.body.testId,
        score:req.body.score,
        timeTaken:req.body.timeTaken,
        totalQuestions:req.body.totalQuestions,
        correctAnswers:req.body.correctAnswers,
        skippedQues:req.body.skippedQues,
    })

    newPerformance.save((err,result)=>{
        if(err){
            console.log(err)
            let apiResponse=response.generate(true,"Failed to add Performance",500,null);
            res.send(apiResponse);
        }else{
            let apiResponse=response.generate(false,"Performance added successfully",200,result);
            res.send(apiResponse);
        }
    })

}

let getPerformance=(req,res)=>{
    PerformanceModel.findOne({'userEmail':req.params.email ,'testId':req.params.testId})
    .select('-__v  -_id __proto__')
    .lean()
    .exec((err,result)=>{
        if(err){
            let apiResponse=response.generate(true,"Failed to load Performance of User ",500,null);
            res.send(apiResponse);
        }else if(check.isEmpty(result)){
            let apiResponse=response.generate(true,"No Performance Found",404,null);
            res.send(apiResponse);
        }else{
            let apiResponse=response.generate(false,"Performance found",200,result);
            res.send(apiResponse);
        }
    })
}



module.exports={
    createTestFunction:createTestFunction,
    getAllTestFunction:getAllTestFunction,
    deleteTest:deleteTest,
    editTest:editTest,
    getSingleTestInformation:getSingleTestInformation,
    addAttemptedUsers:addAttemptedUsers,
    addPerformance:addPerformance,
    getPerformance:getPerformance,
}