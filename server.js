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

// a GET route for scraping NPR News headlines
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with request
    axios.get("https://www.npr.org/sections/news/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("h2.title").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).text();
        result.link = $(this).children().attr("href");
        result.summary = $(this).next('.teaser').children().text();
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });
  
      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });


// start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});