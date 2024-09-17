const asyncHandler = require('express-async-handler')
const Comment = require('../models/Comment')

const createComment = asyncHandler(async(req, res) => {
    const { content, postId, username } = req.body

    if(!username){
        return res.status(403).json({ message: 'you need to sign in to create comment'})
    }

    const newCommentObj = { content, username, postId }

    const newComment = await Comment.create(newCommentObj)
    if(newComment){
        return res.status(201).json({ message: 'comment created successfully'})
    } else{
        return res.status(400).json({ message: 'invalid comment data'})

    }

})


const getAllComments = asyncHandler(async(req, res) => {
    
    const comments = await Comment.find()
    const sortedComments = comments.sort((a,b) => b.createdAt - a.createdAt)
    

    res.send(sortedComments)
})



const deleteComment = asyncHandler(async (req, res) => {
    const { id } = req.body
    const comment = await Comment.findById(id);
    if (!comment) {
        return res.status(400).json({ message: 'Comment not found' })
    }


    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: 'comment has been deleted' });
});
module.exports = { createComment, getAllComments, deleteComment }
