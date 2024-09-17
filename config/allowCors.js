const allowedOrigin = [
    'https://entertainment-blog.onrender.com'
]

const allowCors = {
    origin: (origin, callback) => {
        if (allowedOrigin.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = allowCors