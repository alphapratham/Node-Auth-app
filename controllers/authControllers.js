const AUser = require('../model/loginModel')
const jwt = require('jsonwebtoken')

// Error handler

const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { email: "", pass: "" };

    // Incorrect email
    if (err.message === 'Incorrect Email') {
        errors.email = 'That email is not registered'
    }

    // Incorrect Password
    if (err.message === 'Incorrect Password') {
        errors.pass = 'That password is incorrect'
    }

    //duplicate Errors
    if (err.code === 11000) {
        errors.email = 'already have account'
        return errors
    }

    // Validation Errors
    if (err.message.includes('logins validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message
        });
    }
    return errors;
}
// Create Token
const creatToken = (id) => {
    return jwt.sign({ id }, 'hello alpha', {
        expiresIn: 3 * 24 * 60 * 60,
    })
}

// Sign In and Log In Get Method

module.exports.signup_get = (req, res) => {
    res.render('signup')
}
module.exports.login_get = (req, res) => {
    res.render('login')
}

// Sign Up Post

module.exports.signup_post = async (req, res) => {
    const { email, pass } = req.body
    try {
        const user = await AUser.create({ email, pass })
        const token = creatToken(user._id)
        res.cookie('jwt', token, { httpOnly: true })
        res.status(201).json({ user: user._id })
    }
    catch (err) {
        const error = handleErrors(err);
        res.status(400).json({ error })

    }
}

// login Post

module.exports.login_post = async (req, res) => {
    const { email, pass } = req.body

    try {
        const user = await AUser.login(email, pass);
        const token = creatToken(user._id)
        res.cookie('jwt', token, { httpOnly: true })
        res.status(200).json({ user: user._id })
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors })
    }
}
