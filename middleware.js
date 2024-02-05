
const Campground = require('./models/campground');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
// const { } = require('./schemas.js')
const Review = require('./models/review')


module.exports.isLoggedIn = (req, res, next) => {
    console.log('Req.USER....', req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this lin
        req.flash('error', 'You must be signed in to perform this request');
        return res.redirect('/login')
    };
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { rating, error } = reviewSchema.validate(req.body);
    console.log(rating);
    if (error) {
        console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}


module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    // console.log(result);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
    // console.log(result)
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Unauthorized request');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Unauthorized request');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}