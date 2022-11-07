const Campoground = require('./models/campground')
const methodOverride = require('method-override')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const ejsMate = require('ejs-mate')
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const Joi = require('joi')
const ejs = require('ejs')
const app = express()

connectDB()

app.engine('ejs', ejsMate)
app.use(express.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use(methodOverride('_method'))
app.use('/', require('./routes/campgroundRoutes'))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.listen(3000, () => {
    console.log('Serving on port 3000!')
})