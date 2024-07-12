const express = require('express');
const auth = require('../middleware/auth')
const userController = require('../controllers/userController')
const router = express.Router();

router.post('/', userController.createUser)
//router.get('/', auth, userController.getUsers)
router.get('/profile', auth, userController.getUserProfile)
// router.get('/:id', userController.getUser)
router.patch('/profile', auth, userController.updateUser)
router.delete('/profile', auth, userController.deleteUser)
router.post('/login', userController.loginUser)
router.post('/logout', auth, userController.logoutUser)
router.post('/logout-all-device', auth, userController.logoutUserAllDevice)


router.post('/test', userController.test)



module.exports = router;