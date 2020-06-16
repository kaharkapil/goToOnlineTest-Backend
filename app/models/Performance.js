

const mongoose = require('mongoose');

const schema = mongoose.Schema;

let PerformanceSchema = new schema({
    userEmail: {
        type: String,
    },
    testId: {
        type: String,
    },
    score: {
        type: Number,
        default: 0,
    },
    timeTaken: {
        type: Number,
        default: 0
    },
    totalQuestions: {
        type: Number,
        default: 0
    },
    correctAnswers: {
        type: Number,
        default: 0
    },
    skippedQues: {
        type: Number,
        default: 0
    }
})

mongoose.model('Performance', PerformanceSchema);