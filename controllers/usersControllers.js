const uuid = require('uuid')
// const bcrypt = require('bcrypt')
const SHA256 = require('crypto-js/sha256')
const UserModel = require('../models/users')
const session = require('express-session')


const UserControllers = {

    newUser: (req, res) => {

        res.render('users/register', {
            pageTitle: "User Register"
        })
    },

    loginUser: (req, res) => {
        res.render('users/login', {
            pageTitle: "User Login"
        })
    },


    register: (req, res) => {
        //  validate users input

        UserModel.findOne({
            email: req.body.email
        })
            .then(result => {
                // if found in DB, email is taken, redirect to registration
                if (result) {
                    res.redirect('/users/register')
                    return
                }

                // if no, continue registration

                // generate uuid as salt
                const salt = uuid.v4()

                // hash combination using bcrypt
                const combination = salt + req.body.password

                // hash the combination using SHA256
                const hash = SHA256(combination).toString()


                // hash successful, create user in DB
                UserModel.create({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    pwsalt: salt,
                    hash: hash
                })
                    .then(createResult => {
                        res.direct('/products')
                    })
                    .catch(err => {
                        res.redirect('/users/register')
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.direct('/users/register')
                })
    },

    login: (req, res) => {
        // validate input

        // get user with given email
        UserModel.findOne({
            email: req.body.email
        })
            .then(result => {

                // check if result is empty, if no user, login fail, redirect to login
                if (!result) {
                    res.redirect('/users/login')
                    return
                }

                // combine DB user salt with given password and apply hash
                const hash = SHA256(result.pwsalt + req.body.password).toString()

                // check if password is correct by comparing hashes
                if (hash !== result.hash) {
                    res.redirect('/users/login')
                    return
                }

                // login successful

                // set session user
                req.session.user = result

                res.redirect('/users/dashboard')

            })
            .catch(err => {
                console.log(err)
                res.redirect('/users/login')
            })
    },

    dashboard: (req, res) => {

        res.render('users/dashboard', {
            pageTitle: 'User dashboard'
        })
    },

    logout: (req, res) => {
        req.session.destroy()
        res.redirect('/users/login')
    }

}

module.exports = UserControllers