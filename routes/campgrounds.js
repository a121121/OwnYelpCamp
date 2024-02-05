const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.makeNew))
// .post(upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send('iT worked')
// })

// Show all the campgrounds
router.get('/new', isLoggedIn, campgrounds.renderNewForm)
router.route('/:id')
    .get(catchAsync(campgrounds.showOne))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))
// Give option to make a new campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.edit))

module.exports = router;