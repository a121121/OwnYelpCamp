mapboxgl.accessToken=mapToken;
// console.log(campground.geometry.coordinates);
// Parse the JSON string into a JavaScript object
const campgroundObj=campground;
// Access the coordinates property
console.log(campgroundObj.geometry.coordinates);

const map=new mapboxgl.Map({
    container: 'map', // container ID
    center: campgroundObj.geometry.coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(campgroundObj.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4> ${campgroundObj.title}</h4><p>${campgroundObj.location}</p>`
            )
    )
    .addTo(map);
