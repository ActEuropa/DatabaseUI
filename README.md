This is the front and back end of our main website. It is comprised of three main blocks:

# Common

### Config variables
To function correctly, the database requires the following environment variables to be set:
* `CLOUDINARY_SECRET` : The secret API key for the Cloudinary CDN
* `MONGODB_URI` : A URI pointing towards the MongoDB database

If you are running the nodejs server locally, create a `.env` file at the root of the project, containing the following text:

    CLOUDINARY_SECRET=...
    MONGODB_URI=mongodb://...

### Files/Directories
* `/app.js` : core node.js server
* `/public/common/` : All the front-end files common to the blog and database
* `/views/Pages/Common/` : All the .ejs views common to the blog and database (error pages).
* `/views/Partials/` : These are all the partial .html files common to the blog and database

### Breaking news
Every time a user navigates to any page, the `/public/common/Breaking-News.json` file is downloaded by an inline script in the `/views/Partials/Header.html` file. It is a .json file that should be of the following structure:
````
{
    "show":true/false,
    "url":"/p/a-link-to-the-related-blog-post",
    "en":"The banner in english",
    "fr":"The banner in french",
    "es":"The banner in spanish",
    ...
}
````
The `show` bool value determines if the breaking news banner is visible, the `url` string is the url that is navigated to when one clicks on the banner (it should be a blog post talking about the specific event).
The inner content should at least be available in english.

### Localization

The entire website uses the i18n library for localization. The location of the end-user is detected automatically and specified via a cookie (`lang`), so it is possible to change the language at any time. Missing strings fallback to english.

The `/locales/` folder contains .json files corresponding to all member countries (+ english). These .json files specify a set of translations for static strings throughout the website.

The language of the blog posts and the database are also determined by i18n, however, for obvious reasons, they don't use the .json files from `/locales/`.

# Blog
### Files/Directories
* `/app_blog.js`: All the blog-related back-end.
* `/public/blog/` All the front-end files specific to the blog.
* `/views/Pages/Blog` All the blog-specific .ejs views.
* `/_posts/` The directory containing all the blog posts, in JSON Format.

### Blog posts
All blog posts are contained in the `/_posts/` folder as .json files. They are then stored in the server memory by the `Poet` plugin. The .json files must be of the following format:
````
{
        "title":"The title used for referencing by Poet",
        "heroimage":"A URL to the heading image of the blog post",
        "tags":["an", "array","of","all","the","related","tags"],
        "category":"The category in which the article falls",
        "date":"The publishing date",
        "author":"The name of the author",
        "en":{
            "title":"The title in English, preferrably the same as the referencing title",
            "subtitle":"The subtitle in English, which is visible below the title on the home page and blog post page",
            "article":"The content of the article in English, in HTML (inside the <article> tag)"
        },
        "fr":{
            "title":"The title in French, preferrably the same as the referencing title",
            "subtitle":"The subtitle in French, which is visible below the title on the home page and blog post page",
            "article":"The content of the article in French, in HTML (inside the <article> tag)"
        },
        ...
}
````
Each article must *at least* be in english.

# Database
### Files/Directories
* `/app_database.js`: All the database-related back-end.
* `/public/data/` All the front-end files specific to the database.
* `/views/Pages/Data` All the database-specific .ejs views.


                 <  ,     )  `_A_
           /"\   / "P     `-",V  B"    /"\
            ,-,/\T_D,      ,'( ) D
            ,7  P ) \      \(  -'
         _A_"--',T  H.   ..-H'-\         _A_
         /"\   ,;T___( ,/       |        /"\
                  , _/"        ,|
               C8>'"          (  _
           _A_  `q        _    "" )    _A_
         _./"\   )      <,sm>   _/'    /"\
        |  ""-._.H            ,/
        /        _A_ ,-._,'`. \  _A_
      ,/         /"\/    _A_ \ './"\      __,
      /         /"       /"\  '-."`.   -="p""
      ""\     _P"        !_!     "W "  H \_
         """""                ---//    (  ='
                              `"-'      `w
                                           """'

Icons by [Darrio Ferando](http://www.dario.io/)


