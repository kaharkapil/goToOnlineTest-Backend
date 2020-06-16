const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const time=require('./../libs/timeLib');

const Auth=new Schema({
    userId:{
        type:String
    },
    authToken:{
        type:String
    },
    tokenSecret:{
        type:String
    },
    tokenGenerationTime:{
        type:Date,
        default:time.now(),
    },
    role:{
        type:String,
        default:'user',
    }
});

module.exports=mongoose.model('Auth',Auth);