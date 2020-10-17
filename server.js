// =======================================
//              DEPENDENCIES
// =======================================
require('dotenv').config()
const express = require('express');
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const session = require('express-session')
const productsControllers = require('./controllers/productsControllers')
const productRatingControllers = require('./controllers/productsRatingControllers');
const UserControllers = require('./controllers/usersControllers');
const app = express();
const port = 3000;


// =======================================
//              MONGOOSE
// =======================================
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`
mongoose.set('useFindAndModify', false)

// =======================================
//              EXPRESS
// =======================================
app.set('views', './views')
// set template engine to use
app.set('view engine', 'ejs')

// tell Express app where to find our static assets
app.use(express.static('public'))

// tell Express app to make use of the imported library
app.use(methodOverride('_method'))

// tell Express app to parse incoming form requests
// and make it available in req.body 
app.use(express.urlencoded({
  extended: true
}))

// session 
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: "app_session",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 3600000 } // 3600000ms = 3600s = 60mins, cookie expires in an hour
}))

app.use(setUserVarMiddleware)

// =======================================
//              ROUTES
// =======================================

// INDEX Route
app.get('/products', productsControllers.listProducts)

// NEW Route (take note of route order)
app.get('/products/new', productsControllers.newProduct)

// SHOW Route
app.get('/products/:slug', productsControllers.showProduct)

// CREATE Route
app.post('/products', productsControllers.createProduct)

// EDIT Route (different from show route because break pattern)
app.get('/products/:slug/edit', productsControllers.editProduct)

// UPDATE Route
app.patch('/products/:slug', productsControllers.updateProduct)

// DELETE Route
app.delete('/products/:slug', productsControllers.deleteProduct)

// PRODUCT NEW Route
app.get('/products/:slug/ratings/new', productRatingControllers.newRating)

// PRODUCT CREATE Route
app.post('/products/:slug/ratings', productRatingControllers.createRating)

// USER REGISTER FORM Route
app.get('/users/register', guestOnlyMiddleware, UserControllers.newUser)

// USER REGISTER Route
app.post('/users/register', guestOnlyMiddleware, UserControllers.register)

// USER LOGIN FORM Route
app.get('/users/login', guestOnlyMiddleware, UserControllers.loginUser)

// USER LOGIN Route
app.post('/users/login', guestOnlyMiddleware, UserControllers.login)

// DASHBOARD Route
app.get('/users/dashboard', authenticatedOnlyMiddleware, UserControllers.dashboard)

// DASHBBOARD LOGOUT Route
app.post('/users/logout', authenticatedOnlyMiddleware, UserControllers.logout)

// =======================================
//              LISTENER
// =======================================

mongoose.connect( mongoURI, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(response => {
    // DB connected successfully
    console.log('DB connection successful')
    
    app.listen(process.env.PORT || port, () => {
      console.log(`Biscoff Bakery app listening on port: ${port}`)
    })
  })
  .catch(err => {
    console.log(err)
})

function authenticatedOnlyMiddleware(req, res, next) {

  // unauthorised user cannot access dashboard
  if ( ! req.session || ! req.session.user ) {
    res.redirect('/users/login')
    return
  }

  next()

}


function guestOnlyMiddleware(req, res, next) {

  // check if user is logged in. if logged in, redirect back to dashboard
  if ( req.session && req.session.user) {
    res.redirect('/users/dashboard')
    return
  }

  next()

}

function setUserVarMiddleware(req, res, next) {
  // default user template var set to null
  res.locals.user = null

  // check if req.session.user is set. if set, template user var will be set as well
  if (req.session && req.session.user) {
    res.locals.user = req.session.user
  }

  next()
}


