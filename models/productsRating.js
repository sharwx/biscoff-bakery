const mongoose = require('mongoose')

const productRatingSchema = new mongoose.Schema({
    
    productID: {
        type: String, 
        required: true
    },
    productSlug: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        max: 300
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    }

})

const ProductRatingModel = mongoose.model('Product_Rating', productRatingSchema)

module.exports = ProductRatingModel