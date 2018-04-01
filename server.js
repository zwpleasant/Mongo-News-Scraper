var express = require('express');
var bodyParser = require('body-parser');
var logger = require("morgan");
var mongoose = require('mongoose');

// scraping specific tools
var axios = require('axios');
var cheerio = require('cheerio');

// require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// initialize express
var app = express();

// configure middleware
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost/mongoHeadlines");

// a GET route for scraping the a website
app.get('/scrape', function (req, res) {
    // eventual code for scrape
});

// start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});