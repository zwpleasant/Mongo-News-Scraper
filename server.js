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
  axios.get("https://www.npr.org/sections/news/").then(function(response) {
    var $ = cheerio.load(response.data);
    $("h2.title").each(function(i, element) {
      var result = {};
      result.title = $(this).text();
      result.link = $(this).children().attr("href");
      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });
    res.send("Scrape Complete");
  });
});

// GET route for getting all articles from the db
app.get("/articles", function (req, res) {
  db.Article.find({})
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// GET route for grabbing a specific article by id, populate it with note
app.get("/articles/:id", function (req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// POST route for saving/updating an article's associated note
app.post("/articles/:id", function (req, res) {
  db.Note.create(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// PUT route for saving/updating an article's associated note
app.put("/articles/:id", function (req, res) {
  db.Note.update(req.body)
    .then(function (dbNote) {
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id });
    })
    .then(function (dbArticle) {
      res.json(dbArticle);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});