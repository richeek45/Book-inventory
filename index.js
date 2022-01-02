const express = require("express");
const api = require('./controller/api');
const dotenv = require('dotenv').config();
const cookieParser = require("cookie-parser");
const expressLayouts = require('express-ejs-layouts');
const redis = require('redis');
const session = require('express-session');


const app = express();
app.use(express.json()); // for parsing json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'))

// serving public file
app.use(express.static(__dirname));



// Initialize the user session
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false,
}));


// API endpoints of the Google Books API
app.use('/api/v1/books', api);
// https://www.googleapis.com/books/v1
app.get('/', (req, res) => {
  res.render('index');
})

// Start the port
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
})
