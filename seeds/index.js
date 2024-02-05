const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const citiesPak = require('./HundredCitiesofPak')
// mongoose.connect('mongodb://localhost:27017/yelp-camp', {})

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//     console.log('Database Connected');
// });

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true }) // this alsp gives a promise
    .then(() => {
        console.log('Mongo connection open')
    })
    .catch(err => {
        console.log('Mongo Connection Error');
        console.log(err)
    });



const sample = array => array[Math.floor(Math.random() * array.length)];
// Pictking a random elelment from an array
// array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const random100 = Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '653d47c362079c442f625723',
            // this is user IDs
            location: `${citiesPak[random100].name}, ${citiesPak[random100].country}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Porro obcaecati blanditiis nisi repellat, autem distinctio officiis dolorem perspiciatis possimus ea aliquid. Voluptates, atque sint at corrupti rerum fugiat architecto aperiam? Soluta temporibus necessitatibus cupiditate, impedit quos natus iusto hic quasi numquam iste mollitia, voluptas obcaecati commodi molestias fugiat architecto illo modi alias explicabo, exercitationem amet molestiae libero tempore quo! Dignissimos!',
            price,
            geometry: { type: 'Point', coordinates: [citiesPak[random100].location.longitude, citiesPak[random100].location.latitude] },
            images: [
                {
                    url: 'https://res.cloudinary.com/dttt9oyqc/image/upload/v1705665786/YelpCamp/gv0x4e65af0bxaeckkti.jpg',
                    filename: 'YelpCamp/ihyyzyrrrcoimuca2agl',
                },
            ],

        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
