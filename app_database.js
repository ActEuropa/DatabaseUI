databaseInit = function (app, i18n) {
        //Database page
        app.get("/data", function (req, res, next) {
            res.render("Pages/Database/DataHome.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
        })
        //Person page
        app.get("/person/:name", function (req, res, next) {
            res.render('Pages/Database/Person.ejs', { lang: i18n.getLocale(req), person_name: req.params.name, headerIndex: 2 });
        })
        //Country page
        app.get("/country/:name", function (req, res, next) {
            res.render("Pages/Database/CountryPage.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
        })
        //Political party page
        app.get("/party/:country/:name", function (req, res, next) {
            res.render("Pages/Database/PoliticalParty.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
        })

        var getPersonData = function (name) {
            this.name = "test";
        }
    }