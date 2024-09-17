const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    user: { 
        type: String, 
        required: true
        
    },
    title: {
        type: String, 
        required: true, 
        unique: true 
    },
    description: {
        type: String, 
        required: true, 
        
    },
    slug: { 
        type: String, 
        required: true, 
        unique: true 
    },
    content: { 
        type: String, 
        required: true 
    },
    imageVideoUrl: {
            type: String,
        },
    
    category: { 
        type: String, 
        default: 'uncategorized' 
    },
    featured: {
        type: Boolean,
        default: false
    }
    
    },
    { timestamps: true }
)

module.exports = mongoose.model('Post', postSchema)