const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MongoDB_URI)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB