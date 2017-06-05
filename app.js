///////////////////////////
//     Configuration     //
///////////////////////////
var express = require('express')
var subdomain = require('express-subdomain');
var cookieParser = require('cookie-parser');
var i18n = require('i18n');
var Poet = require('poet');
var multer = require('multer');
var fs = require('fs')
var im = require('gm');
var cloudinary = require('cloudinary');
var app = express()

//set up enviroment variables for local debugging (otherwise, heroku deals with that):
require('dotenv').config()

//This function serves to choose which language should be displayed for variables:
app.locals.pick = function(input){
  if(input[i18n.getLocale()] != null){
    return input[i18n.getLocale()]}
  else if(input[i18n.defaultLocale] != null){
    return input[i18n.defaultLocale]}
  else if(input[0] != null){
    return input[0];}
}
//Add new function to date to convert to european format
Date.toCivilizedString = function (input) {
  var d = new Date(input);
  return  d.getDate() + "/" + d.getMonth()+ "/" + d.getFullYear();
};
Date.getAge = function (birth) {
    var t = new Date();
    var d = new Date(birth);
    var age = t.getFullYear() - d.getFullYear();
    var m = t.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < d.getDate())) {
        age--;
    }
    return age;
};

//Set up cloudinary:
cloudinary.config({ 
  cloud_name: 'acteuropa', 
  api_key: '344884393851828', 
  api_secret: process.env.CLOUDINARY_SECRET
});

app.use(cookieParser());
app.use(express.static('public'));
i18n.configure({ locales:["en","cr","cs","da","nl","et","fi","fr","bg","de","el","hu","ga","it","lv","lt","mt","pl","pt","ro","sk","sl","es","sv"], 
directory: __dirname + '/locales', 
defaultLocale: 'en', 
cookie: 'lang',
updateFiles: false });
app.use(i18n.init);
var upload = multer({ dest: 'public/media/tmp/' })


///////////////////////////
//  Rendering functions  //
///////////////////////////

//Initialize blog
require("./app_blog.js");
blogInit(app, Poet, i18n);

//Initialize database
require("./app_database.js");
databaseInit(app, i18n, upload, im, fs, cloudinary);

///////////////////////////
//       Error pages     //
///////////////////////////
app.use(function (req, res, next) {
  res.status(404).render("Pages/Common/404.ejs", { root : __dirname, lang: i18n.getLocale(req), headerIndex: -1});
});
app.use(function (req, res, next) {
  res.status(500).render("Pages/Common/500.ejs", { root : __dirname, lang: i18n.getLocale(req), headerIndex: -1});
})

///////////////////////////
//       Run server      //
///////////////////////////
app.listen((process.env.PORT || 80)), function () {
  console.log('ActEuropa database listening on port 80!');
}