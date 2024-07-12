const User = require('../models/user')  //import models file
const bcrypt = require('bcryptjs');
const upload = require('../middleware/upload');
const { validationResult } = require('express-validator');



exports.test = async (req, res) => {

    console.log(req.body)

}







//////////////////////////////////////


// Register User
exports.registerUser = async (req, res) => {
    // Handle file upload
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ errors: [{ msg: err }] });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, role } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'User already exists' });
            }

            user = new User({
                username,
                email,
                password,
                role,
                profileImage: req.file ? req.file.path : null // Save the profile image path
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();

            const payload = {
                user: {
                    id: user.id,
                    role: user.role
                }
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET, // Use the secret from environment variables
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });
};








//////////////////////////////////////////////////////////////






exports.createUser = async (req, res) => {



    upload(req, res, async (err) => {

        if (err) {
            return res.status(400).json({ errors: [{ msg: err }] });
        }


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        const { name, age, email, password } = req.body

        try {
            const checkUser = await User.findOne({ email })

            if (checkUser) {
                return res.status(400).json({ message: "User already exist!" })
            }
            const user = new User({
                name,
                age,
                email,
                password,
                profileImage: req.file ? req.file.path : null // Save the profile image path
            })
            
            await user.save()
            const token = await user.genrateAuthToken()
            res.status(201).json({ user, token })

        } catch (e) {
            res.status(400).json({ message: e.message })
        }

    });

}


// exports.getUsers = async (req, res) => {

//     try {

//         const users = await User.find({})

//         res.status(200).json(users)

//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }

// }




exports.getUserProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)//.select('-password'); // Exclude the password
        res.json(user);
    } catch (err) {

        res.status(500).json({ message: err.message });
    }

}





// exports.getUser = async (req, res) => {

//     //const userId = req.query.id; if route {{base_url}}/users?id=258 like this
//     const userId = req.params.id
//     try {

//         const user = await User.findById(userId)
//         if (!user) {
//             return res.status(404).json({ message: 'User Not Found!' })
//         }
//         res.status(200).json(user)
//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }

// }



exports.updateUser = async (req, res) => {
    //this cose for validation if other perms send which i dont want to update
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOpration = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOpration) {
        res.status(400).json({ message: 'Invalid Updates!' })
    }
    //end
    try {

        // const user = await User.findById(req.user.id)
        // console.log(user)
        updates.forEach((update) => req.user[update] = req.body[update] //its single line arrow function
        )
        await req.user.save()

        //  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // if (!user) {
        //     res.status(404).json({ message: 'User not found!' })
        // }
        res.status(200).json(req.user)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
}


exports.deleteUser = async (req, res) => {

    try {

        const user = await User.findByIdAndDelete(req.user.id)
        res.status(200).json({ message: "User delete successfully!" })
    } catch (err) {

        res.status(500).json({ message: err.message })

    }
}


exports.loginUser = async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email })
    if (!user) {
        return res.status(400).json({ message: "Invalid Credentials!" })
    }



    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const token = await user.genrateAuthToken()


    res.status(200).json({ user, token })


}


exports.logoutUser = async (req, res) => {

    try {

        req.user.tokens = req.user.tokens.filter((token) => {

            return token.token !== req.token     //token.token mins in tokens index has object tocken inside tocken object has id and token thats why i use token.token
        })

        await req.user.save()
        res.json({ message: "User logout successfully!" })
    } catch (err) {

        res.status(500).json({ message: err.message })
    }
}


exports.logoutUserAllDevice = async (req, res) => {

    try {
        req.user.tokens = []
        await req.user.save()
        res.json({ message: "User logout All device" })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}