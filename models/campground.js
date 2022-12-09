const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Review'
        }
    ]
})
// Middleware executado durante comunicação assíncrona.
// "post middleware" é executado após pre middleware e hooks.
// O segundo argumento é considerado next(), ou seja,
// chama a próxima função de middleware na pilha.
// Query Middleware.
// Middleware precisa ser escrito antes da compilação do módulo (nível do esquema).
CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

// Compilação do módulo.
module.exports = mongoose.model('Campground', CampgroundSchema)