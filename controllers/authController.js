const User = require('../models/User')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createUser = asyncHandler(async(req, res) => {
    
    const { fullName, username, email, password } = req.body

    if(!fullName || !username || !email || !password) {
        return res.status(400).json({ message: 'all fields are required' })
    }
    if (username) {
        if (username.length < 7 || username.length > 15) {
            return res.status(400).json({ message: 'username must be at between 7 and 20 characters' })
        }
        if (username.includes(' ')) {
            return res.status(400).json({ message: 'username cannot contain spaces' });
        }
        if (!username.match(/^[a-zA-Z0-9]+$/)) {
            return res.status(400).json({ message: 'username can only contains letter or number'});
        }}
        
    if (email) {
        if (
            !email.match(
                 /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            )
        ) {
            return res.status(400).json({message: 'Not a valid email' });
        }
        if (email.length < 7) {
            return res.status(400).json({message: 'email must be at least 7 characters' });
            
        }}

    if (password) {
        if (password.length < 8) {
            return res.status(400).json({message: 'Password must be at least 8 characters' });         
        }
    }   
    const hashedPwd = await bcrypt.hash(password, 10)
    const newUserObj = { fullName, username, email, 'password': hashedPwd}

    const existingUser  = await User.findOne({ username}).lean().exec()
    const existingUserEmail = await User.findOne({ email }).lean().exec()
    if(existingUser || existingUserEmail ){
        return res.status(400).json({ message: 'user already exist'})
    }

    const newUser = await User.create(newUserObj)
    if(newUser){
        return res.status(201).json({ message: 'user registered successfully'})
    } else{
        return res.status(400).json({ message: 'invalid user data'})
    }

})

const logIn = asyncHandler(async(req, res) => {
    const { username, password } = req.body
    
    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()


    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })
    
    const accessToken = jwt.sign(
        {
        'UserInfo': {
            'username': foundUser.username,
        }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }        
    )

    const refreshToken = jwt.sign({
        'username': foundUser.username
    },
    process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }     
)
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken })

})

const refresh = asyncHandler((req, res) => {
    const cookies = req.cookies
    console.log('refresh cookies', req.cookies)
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized, cookie' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized, User not found' })

            const accessToken = jwt.sign(
                {
                    'UserInfo': {
                        'username': foundUser.username,
                    }
                   
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        })
    )
})


const logOut = asyncHandler((req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
})


module.exports = { createUser, logIn, refresh, logOut }