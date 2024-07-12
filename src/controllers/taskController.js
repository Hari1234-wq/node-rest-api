const Task = require('../models/task')





exports.createTask = async (req, res) => {
    //  const addTask = new Task(req.body)

    const addTask = new Task({
        ...req.body,
        owner: req.user.id
    })
    try {
        await addTask.save()
        res.status(201).json(addTask)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }


}

//get all tasks
exports.getTasks = async (req, res) => {
    try {
        //const tasks = await Task.find({ owner: req.user.id }) //first way withot using relation
        const tasks = await req.user.populate('tasks')//second way using relation
        res.status(200).json(tasks.tasks)
    } catch (err) {
        res.status(500).json({ messgae: err.message })
    }
}

//get sigle task by id

exports.getTask = async (req, res) => {

    const taskId = req.params.id

    try {
        const task = await Task.findOne({ _id: taskId, owner: req.user.id })
        if (!task) {
            return res.status(404).json({ message: 'Task not found!' })
        }

        res.status(200).json(task)

    } catch (err) {
        res.status(500).json({ message: err.message })

    }

}



//task update data

exports.updateTask = async (req, res) => {
    //this cose for validation if other perms send which i dont want to update it's not nessasery 
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOpration = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOpration) {
        res.status(400).json({ message: 'Invalid Updates!' })
    }
    //end

    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, req.body, { new: true, runValidators: true })
        if (!task) {
            res.status(404).json({ message: 'Task not found!' })
        }
        res.status(200).json(task)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
}



//task delete

exports.deleteTask = async (req, res) => {

    try {

        const task = await Task.findByIdAndDelete({ _id: req.params.id, owner: req.user.id })
        if (!task) {
            return res.status(400).json({ message: "Task not found!" })
        }

        res.status(200).json({ message: "Task delete successfully!" })
    } catch (err) {

        res.status(500).json({ message: err.message })

    }
}