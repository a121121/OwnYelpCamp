const Campground=require('../models/campground');
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary }=require("../cloudinary")

module.exports.index=async (req, res) => {
    const campgrounds=await Campground.find({});
    // we had to mannually add the virtual to every object before sending it to the client. Coz when we fetch an object for sending;
    // the virtual in general only stays at the server side
    // const campgroundsWithVirtuals=campgrounds.map(campground => {
    //     const campgroundObject=campground.toObject();
    //     campgroundObject.properties={
    //         popUpMarkup: campground.properties.popUpMarkup
    //     };
    //     return campgroundObject;
    // });
    // console.log(campgroundsWithVirtuals[0])

    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm=async (req, res) => {
    // const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/new');
}

module.exports.makeNew=async (req, res, next) => {
    // const campground = await Campground.findById(req.params.id);
    // if (!req.body.campground) throw new ExpressError('Invalid Data', 400)
    const geoData=await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()



    const campground=new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;  // this actually returns a geoJson
    campground.images=req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author=req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
    // we will redirect here
    // res.render('campgrounds/new');
}

module.exports.edit=async (req, res) => {
    const { id }=req.params;
    const campground=await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }

    res.render('campgrounds/edit', { campground });
}

module.exports.showOne=async (req, res) => {
    const campground=await Campground.findById(req.params.id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.updateCampground=async (req, res) => {
    const { id }=req.params;
    // console.log(req.body)
    const campground=await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs=req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
            // delete from the server (cloudinary)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        // delete from mongo database
        console.log(campground)
    }

    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground=async (req, res) => {
    const { id }=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds')
}