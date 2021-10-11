const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const app = express();
const coockieParser = require('cookie-parser')
const { requireAuth } = require('./middleware/auth')

// middleware
app.use('/public',express.static('public'));
app.use(express.json());
app.use(coockieParser())

// view engine
app.set('view engine', 'ejs');
mongoose.connect('mongodb://127.0.0.1:27017/AuthNode', (err) => {
    if (err)
        throw err
    else
        console.log('Connected to database')
})


app.listen(3000)
console.log('connected to 3000')

// routes
app.get('/', requireAuth, (req, res) => res.render('home'));
app.get('/smoothies',requireAuth, (req, res) => res.render('smoothies'));


app.use(authRoutes)

