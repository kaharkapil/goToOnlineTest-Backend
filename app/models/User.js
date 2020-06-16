
/*Declared at the beginning of a script,
 it has global scope (all code in the script will execute in strict mode):
 */
'use strict' 


const mongoose=require('mongoose');

const schema=mongoose.Schema;

let userSchema=new schema({
    userId:{
        type:String,
        default:'',
        index:true,
        unique:true,
    },
    firstName:{
        type:String,
        default:''
    },
    lastName:{
        type:String,
        default:'',
    },
    email:{
        type:String,
        default:''
    },
    mobileNumber:{
        type:Number,
        default:0
    },
    password:{
        type:String,
        default:12345,
    },
    createdOn:{
        type:Date,
        default:''
    }
})

mongoose.model('User',userSchema);