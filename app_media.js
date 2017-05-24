mediaInit = function (app, i18n) {
    app.post("/media/img/upload", function (req, res, next) {
        res.render("Pages/Database/DataHome.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
    })
}