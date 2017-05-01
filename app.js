///////////////////////////
//     Configuration     //
///////////////////////////
var express = require('express')
var subdomain = require('express-subdomain');
var cookieParser = require('cookie-parser');
var i18n = require('i18n');
var Poet = require('poet');
var app = express()

app.use(cookieParser());
app.use(express.static('public'));
i18n.configure({ locales:["en","cr","cs","da","nl","en","et","fi","fr","bg","de","el","hu","ga","it","lv","lt","mt","pl","pt","ro","sk","sl","es","sv"], 
directory: __dirname + '/locales', 
defaultLocale: 'en', 
cookie: 'lang',
updateFiles: false });
app.use(i18n.init);

///////////////////////////
//  Rendering functions  //
///////////////////////////

//Initialize blog
require("./app_blog.js");
blogInit(app, Poet, i18n);

//Initialize database
require("./app_database.js");
databaseInit(app, i18n);

//404 page
app.use(function (req, res, next) {
  res.status(404).render("errors/404.ejs", { root : __dirname, lang: i18n.getLocale(req)})
})

///////////////////////////
//       Run server      //
///////////////////////////
app.listen((process.env.PORT || 80)), function () {
  console.log('ActEuropa database listening on port 80!')
}