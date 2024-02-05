document.addEventListener("DOMContentLoaded", function () {
    const urls=[
        'https://images.unsplash.com/photo-1559521783-1d1599583485?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80',
        'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        'https://img.freepik.com/free-photo/tent-outdoor-by-night-ai-generated-image_268835-6640.jpg?t=st=1705925865~exp=1705929465~hmac=fa2ca8a76e895d74b576c641bb049bf76329559cb0b3e2d1d4bc2d07e7a52f18&w=996',
    ];

    let count=0;
    const body=document.body;

    body.style.backgroundImage='url("'+urls[0]+'")';

    setInterval(function () {
        body.style.backgroundImage='url("'+urls[count]+'")';
        count=(count===urls.length-1)? 0:count+1;
    }, 7500);
});
