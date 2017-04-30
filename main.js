///////////////////////////
//     Configuration     //
///////////////////////////
var express = require('express')
var subdomain = require('express-subdomain');
var cookieParser = require('cookie-parser');
var i18n = require('i18n');
var Poet = Poet = require('poet');
var app = express()

app.use(cookieParser());
app.use(express.static('public'));
i18n.configure({ locales:["en","cr","cs","da","nl","en","et","fi","fr","bg","de","el","hu","ga","it","lv","lt","mt","pl","pt","ro","sk","sl","es","sv"], 
directory: __dirname + '/locales', 
defaultLocale: 'en', 
cookie: 'lang',
updateFiles: false });
app.use(i18n.init);

var poet = Poet(app, {
  posts: __dirname + "/_posts",
  postsPerPage: 5,
  metaFormat: 'json'
});
poet.watch(function () {
    console.log("Reloaded poet")
}).init();
app.set('view engine', 'markdown');
poet.addRoute('/blog/:post', function (req, res, next) {
  var post = poet.helpers.getPost(req.params.post);
  if (post) {
    // Do some fancy logging here
    res.render("Pages/BlogPost.ejs", { lang: i18n.getLocale(req), headerIndex: 0, post: post });
  } else {
    res.send(404);
  }
}).init();


var getPersonData = function(name){
    this.name = "test";
};

///////////////////////////
//  Rendering functions  //
///////////////////////////
//Home page
app.get("/", function(req, res, next) {
    var posts = poet.helpers.getPosts(0,5);
    res.render("Pages/Home.ejs", {lang: i18n.getLocale(req), headerIndex: 0, posts: posts});
})
//Manifesto page
app.get("/manifesto", function(req, res, next) {
    res.render("Pages/Manifesto.ejs", {lang: i18n.getLocale(req), headerIndex: 1});
})

//Database page
app.get("/data", function(req, res, next) {
    res.render("Pages/Data.ejs", {lang: i18n.getLocale(req), headerIndex: 2});
})
//Person page
app.get("/person/:name", function(req, res, next) {
    res.render('Pages/Person.ejs', {lang: i18n.getLocale(req), person_name: req.params.name,  headerIndex: 2});
})
//Country page
app.get("/country/:name", function(req, res, next) {
    res.render("Pages/CountryPage.ejs", {lang: i18n.getLocale(req), headerIndex: 2});
})
//Political party page
app.get("/party/:country/:name", function(req, res, next) {
    res.render("Pages/PoliticalParty.ejs", {lang: i18n.getLocale(req), headerIndex: 2});
})
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