// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display article info
      $("#articles").append("Title: " + data[i].title + "<br />"+ "Link: " + data[i].link + "</p>");
    }
});