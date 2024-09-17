const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true

    },
    password: {
        type: String,
        required: true,
        trim: true
    
    },
    
})

module.exports = mongoose.model('User', userSchema)