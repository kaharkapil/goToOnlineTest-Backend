const express=require("express");

const appConfig=require('./config/appConfig');

const app=express();

const fs=require('fs');
const routesPath='./app/routes';

const mongoose=require('mongoose');
const modelsPath='./app/models/';
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const routLoggerMiddleware=require('./app/middlwares/routeLogger');


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(routLoggerMiddleware.logIp);


app.listen(appConfig.port, () => {
    console.log(`Example app listening at http://localhost:${appConfig.port}`)
});

// Bootstrap models
fs.readdirSync(modelsPath).forEach(function(file){
    if(~file.indexOf('.js')){
      require(modelsPath+'/'+file)
      console.log("inside bootstrap model");
    }
})


// including routes to the file
fs.readdirSync(routesPath).forEach(function(file){
    console.log("Inside bootStrap Routes")
    if(~file.indexOf('.js')){
        let route=require(routesPath+'/'+file);
        route.setRouter(app);
    }
})// end routes 


let db=mongoose.connect(appConfig.db.uri);


// databse connection error handling on error
mongoose.connection.on('error',function(err){
    console.log("Database connection Error");
    console.log(err);
})// end connectionError handling

// databse connection handling on open
mongoose.connection.on('open',function(err){
    if(err){
        console.log("database error");
        console.log(err);
    } else {
        console.log("Database connection open success");
    }
})


module.exports=app;

