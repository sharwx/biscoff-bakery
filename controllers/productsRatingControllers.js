const ProductModel = require('../models/products')
const ProductRatingModel = require('../models/productsRating')

const ProductRatingControllers = {

    newRating: (req, res) => {

        ProductModel.findOne({
            slug: req.params.slug
        })
            .then(result => {
                if (! result) {
                    res.redirect('/products')
                    return
                }
                res.render('product-ratings/new', {
                    pageTitle: "Rate " + result.name,
                    product: result
                })
            })
            .catch(err => {
                res.redirect('/products')
            })


    },

    createRating: (req, res) => {

        ProductModel.findOne({
            slug: req.params.slug
        })
            .then(result => {
                if (! result) {
                    res.redirect('/products')
                    return
                }
                ProductRatingModel.create({
                    productID: result._id.toString(),
                    productSlug: result.slug,
                    rating: req.body.rating,
                    comment: req.body.comment,
                })
                .then(result => {
                    res.redirect('/products/' + req.params.slug)
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/products')
                })
            })
            .catch(err => {
                console.log(err)
                res.redirect('/products')
            })

    }



}

module.exports = ProductRatingControllers