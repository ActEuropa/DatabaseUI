blogInit = function (app, Poet, i18n) {
        var poet = Poet(app, {
            posts: __dirname + "/_posts",
            postsPerPage: 5,
            metaFormat: 'json'
        });

        poet.addTemplate({
            ext: 'json',
            fn : function (options) {}
        }).init();

        poet.watch(function () {
            console.log("Reloaded poet")
        }).init();
        app.set('view engine', 'markdown');
        poet.addRoute('/blog/p/:post', function (req, res, next) {
            var post = poet.helpers.getPost(req.params.post);
            if (post) {
                // Do some fancy logging here
                res.render("Pages/Blog/BlogPost.ejs", { lang: i18n.getLocale(req), headerIndex: 0, post: post });
                
            } else {
                res.send(404);
            }
        }).init();

        app.get("/", function (req, res, next) {
            var posts = poet.helpers.getPosts(0, 5);
            res.render("Pages/Blog/BlogHome.ejs", { lang: i18n.getLocale(req), headerIndex: 0, posts: posts });
        });
        app.get("/blog/edit", function (req, res, next) {
            res.render("Pages/Blog/NewBlogPost.ejs", { lang: i18n.getLocale(req), headerIndex: 0 });
        });
        app.get("/manifesto", function (req, res, next) {
            res.render("Pages/Blog/Manifesto.ejs", { lang: i18n.getLocale(req), headerIndex: 1 });
        });
        app.get("/CreateError/500", function (req, res, next) {
            res.render("Pages/Blog/Manifesto.ejs", { lang: i18n.getLocale(req) });
        });
    }
