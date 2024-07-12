
//prommice chaning exapmle

require('../src/db/mongoose')
const User = require('../src/models/user')


User.findByIdAndUpdate('667c6936a39b633d6330d8ed', { age: 21 }).then((user) => {
    console.log(user)

    return User.countDocuments({ age: 21 })
}).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)

})