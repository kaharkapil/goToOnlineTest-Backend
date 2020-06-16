/*Declared at the beginning of a script,
 it has global scope (all code in the script will execute in strict mode):
 */
'use strict' 



const mongoose=require('mongoose');
const Schema=mongoose.Schema;

let testSchema=new Schema({
    testId:{
        type:Number,
        index:true,
        unique:true,
    },

    testName:{
        type:String,
        default:''
    },
    testDescription:{
        type:String,
        default:''
    },
    testDuration:{
        type:Number,
        default:4,
    },
    testInstructions:{
        type:String,
        default:''
    },
    attemptedBy:[],
    createdOn:{
        type:Date,
        default:''
    },
    lastModified:{
        type:Date,
        default:''
    },
    
})

mongoose.model('Test',testSchema);