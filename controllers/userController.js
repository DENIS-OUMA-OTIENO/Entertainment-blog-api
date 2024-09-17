const User = require('../models/User')
const asyncHandler = require('express-async-handler')


const getUsers = asyncHandler(async(req, res) => {
    const users = await User.find().select('-password').lean()   
    
    if(!users?.length){
        return res.status(400).json({ message: 'No users found' })
    }      
    res.send(users)
})



module.exports = { getUsers }