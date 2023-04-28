var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

const bcryptjs = require('bcryptjs')
const saltRounds = 10

const User = require('../models/User.model')

router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
})

router.post('/signup', (req, res, next) => {


    const { fullName, email, password } = req.body;

    // if (!username || !email || !password) {
    //     res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
    //     return;
    // }

    // //check the password strength
    // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    // if (!regex.test(password)) {
    //     res
    //         .status(500)
    //         .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    //     return;
    // }



    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                fullName,
                email,
                password: hashedPassword
            });
        })
        .then(createdUser => {
            console.log('Newly created user is: ', createdUser);
            res.redirect('/users/profile')
        })
        .catch(error => {
            // if (error instanceof mongoose.Error.ValidationError) {
            //     res.status(500).render('auth/signup', { errorMessage: error.message });
            // } else if (error.code === 11000) {
            //     res.status(500).render('auth/signup', {
            //         errorMessage: 'Username and email need to be unique. Either username or email is already used.'
            //     });
            // } else {
            //     next(error);
            // }
            console.log(err)
        });
});


router.get('/login', (req, res, next) => {
    res.render('auth/login.hbs')
})

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Incorrect email or password.' });
                return;
            } else if (bcryptjs.compareSync(password, user.password)) {
                req.session.user = user
                console.log('User:', user)
                res.redirect(`/users/profile`);
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect email or password.' });
            }
        })
        .catch(error => next(error));
});

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    });
});

module.exports = router;