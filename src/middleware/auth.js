const jwt = require('jsonwebtoken')
const User = require('../models/user')



const auth = async (req, res, next) => {
    try {


        const token = req.header('Authorization').replace('Bearer ', '')   //replace('Bearer ', '')use for remove Bearer

        const decode = jwt.verify(token, process.env.JWT_SECRET)   //first is token and secon is secreate whech is use the genrate token time

        const user = await User.findOne({ _id: decode._id, name: decode.name, 'tokens.token': token })

        req.token = token   //send token in request
        req.user = user     //send user in request

        if (!user) {
            throw new Error()
        }

        next()
    } catch (err) {


        res.status(401).json({ Error: 'UnAuthorised User!' })

    }

}

module.exports = auth