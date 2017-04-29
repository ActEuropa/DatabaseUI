///////////////////////////
//     Configuration     //
///////////////////////////
var express = require('express')
var subdomain = require('express-subdomain');
var cookieParser = require('cookie-parser');
var i18n = require('i18n');
var app = express()

app.use(cookieParser());
app.use(express.static('public'));
i18n.configure({ locales:["en","cr","cs","da","nl","en","et","fi","fr","bg","de","el","hu","ga","it","lv","lt","mt","pl","pt","ro","sk","sl","es","sv"], 
directory: __dirname + '/locales', 
defaultLocale: 'en', 
cookie: 'lang',
updateFiles: false });

app.use(i18n.init);

var getPersonData = function(name){
    this.name = "test";
};

///////////////////////////
//  Rendering functions  //
///////////////////////////
//Home page
app.get("/", function(req, res, next) {
    res.render("Pages/index.ejs", {lang: i18n.getLocale(req)});
})
//Person page
app.get("/person/:name", function(req, res, next) {
    res.render('Pages/Person.ejs', {person_name: req.params.name});
})
//Country page
app.get("/country/:name", function(req, res, next) {
    res.render("Pages/CountryPage.ejs");
})
//Political party page
app.get("/party/:country/:name", function(req, res, next) {
    res.render("Pages/PoliticalParty.ejs");
})
//404 page
app.use(function (req, res, next) {
  res.status(404).sendFile("public/html/404.html", { root : __dirname})
})

///////////////////////////
//       Run server      //
///////////////////////////
app.listen((process.env.PORT || 80)), function () {
  console.log('ActEuropa database listening on port 80!')
}