//this is server file

const express = require('express')
const app = express()
const path = require('path')
const connectDB = require('./db/mongoose')

const multer = require('multer');
const upload = multer();//databse file add

connectDB(); //connect database
const port = process.env.PORT

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
//this middlewhere to use when every route we want to block

// app.use((req, res, next) => {

//     res.status(503).json({ message: 'The site is mantinance mode.We are back soon!' })

// })


//app.use(upload.none()); // this middlewhere use when we send data from form-data body without file

app.use(express.json())   // Middleware for JSON body parsing

// Routes
app.use('/users', require('./routes/user'));
app.use('/tasks', require('./routes/task'));

app.listen(port, () => {
    console.log('server is up on port ' + port)
})


//testin code below


const Task = require('./models/task')
const User = require('./models/user')


//this relation is define the task created by which user
//const main = async () => {

//this is task to user

// const task = await Task.findById('6686d59cb7bce4b2ade9a2ee').populate('owner')//populate method allow us puplate the data to the relation table

// console.log(task.owner)


//this is user to task direction relation

// const user = await User.findById('6686d54fb7bce4b2ade9a2e8').populate('tasks')
// console.log(user.tasks)
// }

// main()