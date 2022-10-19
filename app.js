const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const express = require('express')
const path = require('path')
const ejs = require('ejs')
const app = express()
const Campoground = require('./models/campground')

connectDB()

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campground', async (req, res) => {
    const camp = new Campoground({title: 'My backyard', description: 'Is is my first one'})
    await camp.save()
    res.send(camp)
})

app.listen(3000, () => {
    console.log('Serving on port 3000!')
})