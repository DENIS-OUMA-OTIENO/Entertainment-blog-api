const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.route('/create').post(postController.createPost)
router.route('/').get(postController.getAllPosts)
router.route('/').delete(postController.deletePost)
router.route('/:id').put(postController.updatePost)


module.exports = router