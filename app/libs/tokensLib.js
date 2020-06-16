const jwt=require('jsonwebtoken');
const shortid=require('shortid');
const secretKey='kdshnfjwijhhgvgfghhh____someVeryRandomStringThatNobodyCanGuess___akjdhfluirfncd';

let generateToken =(data,cb)=>{
    try{
        let claims={
            jwtid:shortid.generate(),
            iat:Date.now(),
            exp:Math.floor(Date.now() / 1000)+(60*60*24),
            sub:'authToken',
            iss:'goToOnlineTest',
            data:data
        }
        let tokenDetails={
            token:jwt.sign(claims,secretKey),
            tokenSecret:secretKey
        }
        cb(null,tokenDetails);
    }catch(err){
        console.log(err)
        cb(err,null)
    }
} // end generate token

let verifyClaim =(token,secretKey,cb)=>{
    // verify a token symmetric
    jwt.verify(token,secretKeyt,function(err,decoded){
        if(err){
            console.log("Error while verifying token");
            console.log(err);
            cb(err,null);
        }else{
            console.log("User Verified");
            console.log(decoded);
            cb(null,decoded);
        }
    });
} // end verify claim


let verifyClaimWithoutSecret=(token,cb)=>{
    // verify token symmetric
    jwt.verify(token,secretKey,function(err,decoded){
        if(err){
            console.log("Error while verifying token");
            console.log(err);
            cb(err,data)
        }
        else{
            console.log("User verified");
            cb(null,decoded)
        }
    });
} // end verify claim

module.exports={
    generateToken:generateToken,
    verifyClaim:verifyClaim,
    verifyClaimWithoutSecret:verifyClaimWithoutSecret,
}

