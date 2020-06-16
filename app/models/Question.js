/*Declared at the beginning of a script,
 it has global scope (all code in the script will execute in strict mode):
 */
'use strict' 



const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let questionSchema=new Schema({
    testId:{
        type:String,
    },
    questionId:{
        type:String,
        index:true,
        unique:true,
    },

    question:{
        type:String,
        default:''
    },
    optionA:{
        type:String,
        default:''
    },
    optionB:{
        type:String,
        default:4,
    },
    optionC:{
        type:String,
        default:''
    },
    optionD:{
        type:String,
        default:''
    },
    answer:{
        type:Number,
    },
    createdOn:{
        type:Date,
        default:''
    }

})

mongoose.model('Question',questionSchema);