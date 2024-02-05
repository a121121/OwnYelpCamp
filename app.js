if (process.env.NODE_ENV!=='production') {
    require('dotenv').config()
}

const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const ejsMate=require('ejs-mate')
const methodOverrride=require('method-override');
const ExpressError=require('./utils/ExpressError');
// const Joi = require('joi');
const { stat }=require('fs');
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport');
const LocalStrategy=require('passport-local')
const User=require('./models/user')
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet')
const MongoStore=require('connect-mongo');
const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users')
const dbUrl=process.env.DB_URL;
// const dbUrl='mongodb://127.0.0.1:27017/yelp-camp';
// 

// 'mongodb://127.0.0.1:27017/yelp-camp'
mongoose.connect(dbUrl, { useNewUrlParser: true }) // this alsp gives a promise
    .then(() => {
        console.log('Mongo connection open')
    })
    .catch(err => {
        console.log('Mongo Connection Error');
        console.log(err)
    })


const store=MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24*60*60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error", function (e) {
    console.log('Session Store Error', e)
})

const sessionConfig={
    store: store,
    name: 'Sess', // its easy to catch the default ones
    secret: 'thisshouldbesecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, // cookies are not accessible by JS
        // secure: true, // in development it will not work
        expires: Date.now()+1000*60*60*24*7, // one week in miliseconds
        maxAge: 1000*60*60*24*7
    }
}


const app=express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverrride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());
app.use(
    helmet({
        contentSecurityPolicy: false,
    }),
);// 11 middlewares for protection


app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // this should be after normal session
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())
// this referes to how do we store a user in a session
// and unstore it
// these get added automatically by passport

app.use((req, res, next) => {
    // console.log(req.query);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user=new User({ email: 'abc@gmail.com', username: 'abc' })
    const newUser=await User.register(user, 'chicken')
    res.send(newUser);
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
    // next will hit the next middleware
})

app.use((err, req, res, next) => {
    const { statusCode=500 }=err;
    if (!err.message) err.message('Oh No, Something went wrong')
    res.status(statusCode).render('error', { err });
    // res.send('Something Went Wrong!');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
