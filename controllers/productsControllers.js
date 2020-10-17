const _ = require('lodash')
const ProductModel = require('../models/products')
const ProductRatingModel = require('../models/productsRating')

const productsControllers = {
    listProducts: (req, res) => {
        ProductModel.find()
            .then(results => {
                res.render('products/index', {
                    pageTitle: 'Biscoff Bakery',
                    products: results
                })
            })
    },

    showProduct: (req, res) => {
        let slug = req.params.slug

        ProductModel.findOne({
            slug: slug
        })
            .then(result => {
                if (! result) {
                    res.redirect('/products')
                    return
                }

                ProductRatingModel.find(
                    {
                        productSlug: result.slug
                    },
                    {},
                    {
                        sort: {
                            // -1 (descending) or 1 (ascending) 
                            createdAt: -1 
                        }
                    }
                )
                    .then(ratingResults => {
                        res.render('products/show', {
                            pageTitle: 'Biscoff Bakery',
                            item: result,
                            ratings: ratingResults
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.redirect('/products')
                    })
            })
            .catch(err => {
                res.send(err)
            })
    },

    newProduct: (req, res) => {
        res.render('products/new', {
        pageTitle: 'Add item'
        })
    },

    createProduct: (req, res) => {
        const slug = _.kebabCase(req.body.product_name)

        ProductModel.create({
            name: req.body.product_name,
            slug: slug,
            price: req.body.price,
            image: req.body.img_url
        })
            .then(result => {
                res.redirect('/products/' + slug)
            })
            .catch(err => {
                res.redirect('/products/new')
            })
    },

    editProduct: (req, res) => {

        ProductModel.findOne({
            slug: req.params.slug
        })
            .then(result => {
                res.render('products/edit', {
                    pageTitle: "Edit Form for " + result.name,
                    item: result,
                    itemID: result.slug
                })
            })
            .catch(err => {
                res.redirect('/products')
            })
    },

    updateProduct: (req, res) => {
        const newSlug = _.kebabCase(req.body.product_name)

        ProductModel.findOne({
            slug: req.params.slug
        })
            .then(result => {
                ProductModel.update({
                    slug: req.params.slug
                },{
                    name: req.body.product_name,
                    slug: newSlug,
                    price: req.body.price,
                    image: req.body.img_url
                })
                    .then(updateResult => {
                        res.redirect('/products/' + req.params.newSlug)
                    })
                    .catch(err => {
                        console.log(err)
                        res.redirect('/products')
                    })
            })
    },

    deleteProduct: (req, res) => {

        ProductModel.findOne({
            slug: req.params.slug
        })
            .then(result => {

                ProductModel.deleteOne({
                    slug: req.params.slug
                })
                    .then(deleteResult => {
                        res.redirect('/products')
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


module.exports = productsControllers