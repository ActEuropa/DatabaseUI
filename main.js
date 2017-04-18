var express = require('express')
var subdomain = require('express-subdomain');
var app = express()

app.use(express.static('public'));



//DATABASE ROUTER

var dbRouter = express.Router(); 
app.use(subdomain('database', dbRouter));

dbRouter.get("/", function(req, res, next) {
    res.sendFile("views/index.ejs", { root : __dirname})
})
dbRouter.get("/person/:name", function(req, res, next) {
    console.log("Person=" + req.params.name)
    res.render('PoliticianPage.ejs', {person_name: req.params.name});
})
dbRouter.get("/party/:country/:name", function(req, res, next) {
    console.log("Country=" + req.params.country)
    console.log("Party=" + req.params.name)
    res.sendFile("views/PoliticalParty.ejs", { root : __dirname})
})
dbRouter.get("/country/:name", function(req, res, next) {
    console.log("Country=" + req.params.name)
    res.sendFile("public/html/CountryPage.html", { root : __dirname})
})

//MAIN PAGE ROUTER
var hRouter = express.Router();
app.use(hRouter);
//TODO add website root
hRouter.get("/", function(req, res, next) {
    res.send("website root");
})

//404 page
app.use(function (req, res, next) {
  res.status(404).sendFile("public/html/404.html", { root : __dirname})
})

//Run server
app.listen((process.env.PORT || 80)), function () {
  console.log('ActEuropa listening on port 80!')
}
