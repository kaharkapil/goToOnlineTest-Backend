const bcrypt=require('bcrypt')

const salRounds=10;

let hashPassword=(myPlainTextPassword)=>{
    let salt =bcrypt.genSaltSync(salRounds);
    let hash=bcrypt.hashSync(myPlainTextPassword,salt);
    return hash;
}

let comparePassword=(oldPassword,hashpassword,cb)=>{
    console.log("inside compare password");
    bcrypt.compare(oldPassword,hashpassword,(err,res)=>{
        if(err){
            console.log("Comparision error");
            cb(err,null);
        }else{
            console.log("inside compare password inside else");
            cb(null,res);
            console.log(res);
        }
    })
}




module.exports={
    hashPassword:hashPassword,
    comparePassword:comparePassword,
}