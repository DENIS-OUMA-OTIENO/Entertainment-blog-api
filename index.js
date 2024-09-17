require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const allowCors = require('./config/allowCors')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500
const cookieParser = require('cookie-parser')



connectDB()

app.use(cors(allowCors))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/', require('./routes/root'))
app.use('/user', require('./routes/userRoute'))
app.use('/post', require('./routes/postRoute'))
app.use('/auth', require('./routes/authRoute'))
app.use('/comment', require('./routes/commentRoute'))


app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', 'notFound.html'))
    } else if(req.accepts('json')) {
        res.json({message: 'Not Found'})
    } else{
        res.type('txt').send('Not found')
    }
})
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', (err) => {
    console.log(err)
})