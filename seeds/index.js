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
      const price = Math.floor(Math.random() + 30) + 10
      const camp = new Campground({
         location: `${cities[random].city}, ${cities[random].state}`,
         title: `${sample(descriptors)} ${sample(places)}`,
         image: 'https://source.unsplash.com/collection/483251',
         description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit, iure officiis! Fugiat quod unde ullam! In quis sit quasi hic perferendis? Reprehenderit voluptas veniam, animi adipisci similique molestias ullam earum.',
         price
      })
      camp.save()
   }
}
seedDB()
// .then(() => {
//    mongoose.connection.close()
// })