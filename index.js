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

const response=require('./app/libs/responseLib')


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

//-------------------------------------------------------------------------------------------------------------------//


const Auth=require('./app/models/Auth');
const shortid=require('shortid');
const jwt=require('jsonwebtoken');
const secretKey='kdshnfjwijhhgvgfghhh____someVeryRandomStringThatNobodyCanGuess___akjdhfluirfncd';







app.post(`${appConfig.apiVersion}/refresh-token/:authToken`, function (req, res) {

    Auth.findOne({authToken:req.params.authToken},(err,data)=>{
        if(err){
            console.log("Not Found");
            let apiResponse = response.generate(true, 'Failed To Generate Token', 404, null)
            res.send(apiResponse)
            res.status(404)
        }else{
            console.log("checked");
            generateToken(data,(err,tokenDetails)=>{
                if(err){
                    console.log("checked- error01");
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                    res.send(apiResponse)
                }else if(tokenDetails==null ||tokenDetails==''||tokenDetails==undefined  ){
                    console.log("No record Found");
                    let apiResponse = response.generate(true, 'Failed To Generate Token', 404, null);
                    res.send(apiResponse);

                }
                else{

                    console.log("checked- here");
                    console.log(tokenDetails);
                    tokenDetails.userId=data.userId;
                    saveToken(tokenDetails,(err,data)=>{
                        if(err){
                            console.log("checked- error02");
                            let apiResponse = response.generate(true, 'Failed To Generate Token', 500, null)
                            res.send(apiResponse)
                            res.status(500)
                        }else{
                            let apiResponse = response.generate(false, 'Kapil', 500,data)
                            res.send(apiResponse)
                            // res.send(data.authToken);
                        }
                    })
                    
                }
            })
        }
    })
  });


// function to generate new token
  let generateToken=(data, cb) => {
    console.log("inside generate token");
    console.log(data);

    try {
      let claims = {
        jwtid: shortid.generate(),
        iat: Date.now(),
        exp: Math.floor(Date.now() / 1000) + (60 * 12),// 12 min to sec(60*12)
        sub: 'authToken',
        iss: 'refreshToken',
        data: data
      }
      let tokenDetails = {
        token: jwt.sign(claims, secretKey),
        tokenSecret : secretKey
      }
      cb(null, tokenDetails)
    } catch (err) {
      console.log(err)
      cb(err, null)
    }
  }// end generate token 


  let saveToken = (tokenDetails,cb) => {

    Auth.findOneAndUpdate ({userId:tokenDetails.userId},{authToken:tokenDetails.token},{ tokenSecret: tokenDetails.tokenSecret},(err,data)=>{
        if(err){
            cb(err,null);
        }else{
            cb(null,data)
        }
    })

    
}



module.exports=app;

