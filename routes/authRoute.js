const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.route('/register').post(authController.createUser)
router.route('/').post(authController.logIn)
router.route('/refresh').get(authController.refresh)
router.route('/logout').post(authController.logOut)

module.exports = router
