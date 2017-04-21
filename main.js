var express = require('express')
var subdomain = require('express-subdomain');
var app = express()

app.use(express.static('public'));

app.get("/", function(req, res, next) {
    res.render("index.ejs");
})
app.get("/person/:name", function(req, res, next) {
    console.log("Person=" + req.params.name)
    res.render('Person.ejs', {person_name: req.params.name});
})
app.get("/party/:country/:name", function(req, res, next) {
    console.log("Country=" + req.params.country)
    console.log("Party=" + req.params.name)
    res.render("PoliticalParty.ejs");
})
app.get("/country/:name", function(req, res, next) {
    console.log("Country=" + req.params.name)
    res.render("CountryPage.ejs");
})

//404 page
app.use(function (req, res, next) {
  res.status(404).sendFile("public/html/404.html", { root : __dirname})
})

//Run server
app.listen((process.env.PORT || 80)), function () {
  console.log('ActEuropa listening on port 80!')
}