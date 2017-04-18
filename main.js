var express = require('express')
var subdomain = require('express-subdomain');
var app = express()

app.use(express.static('public'));
var hRouter = express.Router();
var dbRouter = express.Router();

//DATABASE ROUTING

//!!! IGNORING SUBDOMAIN RELATED STUFF FOR TESTING PURPOSES ON HEROKU. !!!
//!!! REPLACE "hRouter" IN THIS SECTION BY "dbRouter" FOR PRODUCTION   !!!
//app.use(subdomain('database', dbRouter));

hRouter.get("/", function(req, res, next) {
    res.render("index.ejs");
})
hRouter.get("/person/:name", function(req, res, next) {
    console.log("Person=" + req.params.name)
    res.render('PoliticianPage.ejs', {person_name: req.params.name});
})
hRouter.get("/party/:country/:name", function(req, res, next) {
    console.log("Country=" + req.params.country)
    console.log("Party=" + req.params.name)
    res.render("PoliticalParty.ejs");
})
hRouter.get("/country/:name", function(req, res, next) {
    console.log("Country=" + req.params.name)
    res.render("CountryPage.ejs");
})

//MAIN PAGE ROUTING
//!!! UNCOMMENT THIS SECTION FOR PRODUCTION !!!
//hRouter.get("/", function(req, res, next) {
//    res.send("website root");
//})
app.use(hRouter);

//404 page
app.use(function (req, res, next) {
  res.status(404).sendFile("public/html/404.html", { root : __dirname})
})

//Run server
app.listen((process.env.PORT || 80)), function () {
  console.log('ActEuropa listening on port 80!')
}
