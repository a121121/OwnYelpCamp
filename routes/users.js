const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware')
const users = require('../controllers/users')


router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.registerUser));

router.route('/login')
    .get(users.renderLogin)
    .post(
        storeReturnTo,
        passport.authenticate('local', {
            failureFlash: true,
            failureRedirect: '/login'
        }),
        users.login)

router.get('/logout', users.logout);
module.exports = router;


// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', 'Logged Out successfully!')
//     res.redirect('/campgrounds')
// })

// router.post('/register', catchAsync(async (req, res, next) => {
//     try {
//         const { email, username, password } = req.body;
//         const user = new User({ email, username });
//         const registeredUser = await User.register(user, password);
//         req.login(registeredUser, err => {
//             if (err) return next(err);
//         })
//         req.flash('success', 'Welcome to Yelp Camp!')
//         res.redirect('/campgrounds')
//     } catch (e) {
//         req.flash('error', e.message);
//         res.redirect('/register')
//     }
//     // console.log(registeredUser)

// }));