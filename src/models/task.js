const mongoose = require('mongoose')
const validator = require('validator')

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false,
    },
    //owner for user lelationship this task
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },


},
    {
        timeseries: true  // its create created_at and updated_at fild timestamp
    })



const Task = mongoose.model('Task', taskSchema)

module.exports = Task