
const User=require('../models/user');
const passport=require('passport');

module.exports.renderRegister=(req, res) => {
    res.render('users/register')
}

module.exports.registerUser=async (req, res, next) => {
    try {
        const { email, username, password }=req.body;
        const user=new User({ email, username });

        // Use the User.register method to create and register the user.
        await User.register(user, password);

        // After registration, authenticate the user to sign them in.
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin=(req, res) => {
    res.render('users/login')
}

module.exports.login=(req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl=res.locals.returnTo||'/campgrounds'; // update this line to use res.locals.returnTo now
    res.redirect(redirectUrl);
    // res.redirect('/campgrounds')
}

module.exports.logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}