const connectDB = require('../config/db')
const mongoose = require('mongoose')
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')
const dotenv = require('dotenv').config()

connectDB()

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
   await Campground.deleteMany({})
   for(let i = 0; i < 50; i++) {
      const random = Math.floor(Math.random() * 1000) 
      const camp = new Campground({
         location: `${cities[random].city}, ${cities[random].state}`,
         title: `${sample(descriptors)} ${sample(places)}`
      })
      camp.save()
   }
}
seedDB().then(() => {
   mongoose.connection.close()
})