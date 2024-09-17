const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')


router.route('/').post(commentController.createComment)
router.route('/').get(commentController.getAllComments)
router.route('/').delete(commentController.deleteComment)

module.exports = router