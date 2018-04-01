var express = require("express");
var mongojs = require("mongojs");
var mongoose = require("mongoose");
var logger = require("morgan");
var bodyParser = require("body-parser");

// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongoHeadlines");

// Routes
require("")(app);
require("")(app);

var PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});