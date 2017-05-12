databaseInit = function (app, i18n) {

    //Mongoose setup
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://webapp:5xtgCftAyR2SmfS@ds137121.mlab.com:37121/acteuropadb');
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Connected to mongodb database")
    });
    
    //Mongoose Internationalization
    var mongooseIntl = require('mongoose-intl');
    mongoose.plugin(mongooseIntl, { languages: ["en","cr","cs","da","nl","et","fi","fr","bg","de","el","hu","ga","it","lv","lt","mt","pl","pt","ro","sk","sl","es","sv"], defaultLanguage: 'en' });

    //Mongoose schema definitions
    var Schema = mongoose.Schema;
    var personSchema = new Schema({
        name: String,
        bio_short: {type: String, intl:true},
        bio_long: {type: String, intl:true},
        dateofbirth: Date,
        dateofdeath: Date,
        nationality: [String],
        jobs: 
        [{ title: {type: String, intl:true}, 
           description: {type: String, intl:true}, 
           from: Date, 
           to: Date, 
           tags: Schema.Types.ObjectId, 
           parlement: Schema.Types.ObjectId, 
           parlementplace: Number }],
        politicalmemberships: 
        [{ party: Schema.Types.ObjectId,
           from: Date,
           to: Date,
           role: [{type: String, intl:true}]}],
        socialmedia_urls: [String],
        img_profile: String,
        img_cover: String,
        quotes: 
        [{
            quote: {type: String, intl:true},
            location: String,
            date: String,
            source_urls: [String],
            context: String
        }],
        positioning:{
            SocialFreedom: Number,
            EconomicFreedom: Number,
            Europeanism: Number,
            Authoritarianism: Number
        }
    });
    var tagSchema = new Schema({
        name: []
    })
    var partySchema = new Schema({
        name: String,
        abreviation: String,
        bio_short: String,
        bio_long: String,
        dateofbirth: Date,
        dateofdeath: Date,
        nationality: String,
        major: Boolean,
        official_positioning:{
            SocialFreedom: Number,
            EconomicFreedom: Number,
            Europeanism: Number,
            Authoritarianism: Number
        },
        calculated_positioning:{
            SocialFreedom: Number,
            EconomicFreedom: Number,
            Europeanism: Number,
            Authoritarianism: Number
        }
    });

    ///////////////////////////
    //  Rendering functions  //
    ///////////////////////////
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

    app.get("/data/person/edit", function (req, res, next) {
        res.render("Pages/Database/Person_Edit.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
    })
    app.get("/data/person/new/Test", function (req, res, next) {
        createTestPerson();
    })

    function createTestPerson(){
        var Person = mongoose.model('Person', personSchema);
        var p = new Person;
        p.name = "Lorem Ipsum"
        p.bio_short = "This is the short biography of Lorem Ipsum, the first test entry in the ActEuropa database"
        p.set('bio_short.all', {
            en: "title in English",
            fr: "title in French"
        });
        p.bio_long = "This is the long biography of Lorem Ipsum, the first and hopefullt not last test entry in the glorious ActEuropa database. Born at 19:43, as the weather outside was grey and ugly, Lorem Ipsum's ambition had always been to serve his creators. This finally became a dream at the age of one minute, when this stupid pointless biography was finally written. Since, he has been mayor, MP, and is now hoping to become the next president of database test entries."
        p.dateofbirth = Date.now()
        p.nationality = ["en", "fr", "it", "es"]
        //I really can't be arsed to add the rest right now.
        p.save(function(){console.log("Added test entry to database")});
    }
    var getPersonData = function (name) {
        this.name = "test";
    }
}