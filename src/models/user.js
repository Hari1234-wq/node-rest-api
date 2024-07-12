const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')




const userSchema = new mongoose.Schema({
    name: {
        type: String,  //for filt which data type accept
        required: true, //for required fild
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true, //for trime space string
        lowercase: true,//string to conver lowercase
        validate(value) {
            if (!validator.isEmail(value)) {    //isEmail() method return boolian it is access from validator livariry import
                throw new Error('Invalid Email!')
            }
        }

    },
    age: {
        type: Number,
        default: 0,//if we dont provide age default save 0
        validate(value) {   //heare start custome validation and we aluso use validator package for email etc. npm i validate cmd
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }

    },

    password: {
        type: String,
        required: true,
        minlegnth: 5,
        trim: true
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    //the tokens use for track login it is use for if i logout my account then everywhere my accoun logout
    tokens: [{
        token: {
            type: String,
            required: true

        }
    }],

    profileImage: {
        type: String // Store the file path of the profile image
    },





},
    {
        timeseries: true // its create created_at and updated_at fild timestamp
    })


//create vartual proprty for Relationship =>a vertual property is a relationship between 2 intitease in a User in a Task

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})










//middlewhare for bcrypt the passwoed its 2 type pre and post

userSchema.pre('save', async function (next) {


    const user = this

    if (user.isModified('password')) {   //it is only worke when password is modified
        user.password = await bcrypt.hash(user.password, 8)   //in nhash paerameter first argument is plane text and second is number of round hash
    }

    next()

})


//Hiding user private date

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    //remove passwor and tokens from the object
    delete userObject.password
    delete userObject.tokens
    return userObject
}


//genrate auth token

userSchema.methods.genrateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString(), name: user.name }, process.env.JWT_SECRET)  //the first paremeeter id payloade and second is token


    //save token in database

    user.tokens = user.tokens.concat({ token: token })
    await user.save()

    return token
}







const User = mongoose.model('User', userSchema)

module.exports = User