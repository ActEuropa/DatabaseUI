///////////////////////////
//   Core declarations   //
///////////////////////////
var express = require('express')
var subdomain = require('express-subdomain');
var cookieParser = require('cookie-parser');
var app = express()

var getPersonData = function(name){
    this.name = "test";
};
app.use(cookieParser());
app.use(express.static('public'));

///////////////////////////
//  Rendering functions  //
///////////////////////////
app.get("/", function(req, res, next) {
    console.log("lanugage:" + req.cookies.language);
    res.render("Pages/index.ejs");
})
app.get("/person/:name", function(req, res, next) {
    res.render('Pages/Person.ejs', {person_name: req.params.name});
})
app.get("/party/:country/:name", function(req, res, next) {
    res.render("Pages/PoliticalParty.ejs");
})
app.get("/country/:name", function(req, res, next) {
    res.render("Pages/CountryPage.ejs");
})
//404 page
app.use(function (req, res, next) {
  res.status(404).sendFile("public/html/404.html", { root : __dirname})
})

///////////////////////////
//       Run server      //
///////////////////////////
app.listen((process.env.PORT || 80)), function () {
  console.log('ActEuropa listening on port 80!')
}