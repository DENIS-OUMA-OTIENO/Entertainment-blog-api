const Post = require('../models/Post')
const asyncHandler = require('express-async-handler')
const { upload } = require('../middleware/multer') 
const uploadOnCloudinary = require('../services/cloudinary')

const TITLE_MAX_LENGTH = 15;
const DESCRIPTION_MAX_LENGTH = 35;

const createPost = [
upload.single('file'),
asyncHandler(async(req, res) => {
    
    const { title, description, content, category, user, featured } = req.body
    
    if (title.length > TITLE_MAX_LENGTH) {
        return res.status(400).json({ message: `Title must be less than ${TITLE_MAX_LENGTH} characters` });
      }
      if (description.length > DESCRIPTION_MAX_LENGTH) {
        return res.status(400).json({ message: `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters` });
      }

    if(!title || !description || !content || !category || !user) {
        return res.status(400).json({ message: 'All fields are required.' });

    }
    let fileUrl = null
    if (req.file) {
      const localFilePath = req.file.path
      const cloudinaryResponse = await uploadOnCloudinary(localFilePath)
      if (cloudinaryResponse) {
        fileUrl = cloudinaryResponse.secure_url
      }
    }
    if(!title || !description || !content || !category || !user) {
        return res.status(400).json({ message: 'All fields are required.' });

    }

    const existingPost = await Post.findOne({ title }).lean().exec()

    if(existingPost){
        return res.status(403).json({ message: 'post already exist' })
    }

    const slug = req.body.title
        .toLowerCase()
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, '') 
        .replace(/\s+/g, '-'); 

    const newPostObj = { 
        user, 
        title, 
        description,
        content, 
        imageVideoUrl: fileUrl, 
        category, 
        slug, 
        featured: featured || false}

    const newPost = await Post.create(newPostObj)
    if(newPost){
        return res.status(201).json({ message: 'post created successfully'})
    } else{
        return res.status(400).json({ message: 'invalid post data'})
    }

})]

const updatePost = [
    upload.single('file'),
    asyncHandler(async(req, res) => {          

const { title, description, content, category, user, featured } = req.body
if (title.length > TITLE_MAX_LENGTH) {
    return res.status(400).json({ message: `Title must be less than ${TITLE_MAX_LENGTH} characters` });
  }
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    return res.status(400).json({ message: `Description must be less than ${DESCRIPTION_MAX_LENGTH} characters` });
  }

if(!title || !description || !content || !category || !user) {
    return res.status(400).json({ message: 'All fields are required.' });

} 
let fileUrl = null
if (req.file) {
  const localFilePath = req.file.path
  const cloudinaryResponse = await uploadOnCloudinary(localFilePath)
  if (cloudinaryResponse) {
    fileUrl = cloudinaryResponse.secure_url
  }
}
//check on the if later
// if (req.user.id !== req.params.userId) {
//     return res.status(403).json({ message: 'cannot update this post'});
// }

const post = await Post.findById(req.params.id)

const slug = req.body.title
.toLowerCase()
.trim()
.replace(/[^a-zA-Z0-9\s]/g, '') 
.replace(/\s+/g, '-'); 


    //post.user = user,
    post.user = user
    post.title = title
    post.description = description
    post.content = content
    slug
    post.category = category
    if(req.file){
        post.imageVideoUrl = fileUrl
    }

    if (featured) {
        post.featured = featured; // Update featured if provided
    } else {
        post.featured = false
    }


const updatedPost = await post.save()

if(updatedPost){
    return res.status(201).json({ message: 'post updated successfully'})
} else{
    return res.status(400).json({ message: 'invalid post data'})
}

})]


const getAllPosts = asyncHandler(async(req, res) => {
    const posts = await Post.find().exec()

    const sortedPosts = posts.sort((a,b) => b.createdAt - a.createdAt)

    res.send(sortedPosts)
  
})

const getAllCategoryPosts = asyncHandler(async(req, res) => {
    const { category } = req.body

    const posts = Post.find({ category }).select()

    const sortedPosts = posts.sort({ createdAt: -1 })

    res.send(sortedPosts)
  
})




const deletePost = asyncHandler(async(req, res) => {
    const { id } = req.body


   const post = await Post.findById(id).exec()

   const result = await post.deleteOne()

    return res.status(200).json({ message: 'post deleted successfully'})
    
})

module.exports = { createPost, getAllPosts, updatePost,  deletePost }