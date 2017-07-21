databaseInit = function (app, i18n, upload, im, fs, cloudinary) {

    //Function to create JSON from the schema
    Array.prototype.contains = function (a) { for (i in this) { if (this[i] == a) return true; } return false; }
    var objectPath = require("object-path");

    //Mongoose setup
    var mongoose = require('mongoose');
    console.log("Connecting to " + process.env.MONGODB_URI)
    mongoose.connect(process.env.MONGODB_URI);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log("Connected to mongodb database")
    });

    //Mongoose Internationalization
    var mongooseIntl = require('mongoose-intl');
    var i18nPlugin = require('mongoose-i18n');
    mongoose.plugin(i18nPlugin, { languages: ["en", "cr", "cs", "da", "nl", "et", "fi", "fr", "bg", "de", "el", "hu", "ga", "it", "lv", "lt", "mt", "pl", "pt", "ro", "sk", "sl", "es", "sv"], defaultLanguage: 'en' });
    
    var Intlfields = ["bio_short", "bio_long", "title", "description", "role", "quote", "subtitle"]; //This is to keep track of translateable fields

    //Mongoose schema definitions
    //WARNING!!!!! DO NOT CALL ANY PROPERTY "TYPE"! IT WILL MESS UP WITH THE FORM CREATION FUNCTION!

    var Schema = mongoose.Schema;
    var personSchema = new Schema({
        visibility: { type: Number, required: true }, //0=visible, 1= hidden, 2= non-referenced
        name: { type: String, required: true },
        fullname: { type: String },
        gender: { type: Number, required: true }, //0=Male, 1 = Female, 2= Nonbinary
        bio_short: { type: String, i18n: true },
        bio_long: { type: String, i18n: true },
        dateofbirth: { type: Date },
        locationofbirth: { type: String },
        dateofdeath: { type: Date },
        locationofdeath: { type:String },
        nationalities: [{ type: String }],
        jobs:
        [{
            title: { type: String, i18n: true },
            description: { type: String, i18n: true },
            from: { type: Date },
            to: { type: Date },
            political: { type: Boolean }, //This mainly serves to calculate the political career length.
            elected: { type: Boolean },
            parlement: { type: String },
            parlementplace: { type: Number }
        }],
        politicalmemberships:
        [{
            party: { type: String },
            from: { type: Date },
            to: { type: Date },
            role: [{ type: String, i18n: true }]
        }],
        socialmedia_urls: [{ type: String }],
        quotes:
        [{
            quote: { type: String, i18n: true },
            location: { type: String },
            date: { type: String },
            source_urls: [{ type: String }],
            context: { type: String }
        }],
        criminalrecord: [{
            gravity: { type: Number }, //0=not too important, 5= really fucking bad
            title: { type: String, i18n: true },
            subtitle: { type: String, i18n: true },
            timeline: {
                title: { type: String, i18n: true },
                date: { type: Date }
            }
        }],
        positioning: {
            soc: { type: Number },
            eco: { type: Number },
            eu: { type: Number },
            auth: { type: Number }
        }
    });
    var Person = mongoose.model('Person', personSchema);

    var tagSchema = new Schema({
        text: { type: String, intl: true },
        description: { type: String, intl: true }
    })
    // var Tag = mongoose.model('Tag', tagSchema);

    var partySchema = new Schema({
        name: { type: String, intl: true },
        abreviation: String,
        color1: String,
        color2: String,
        bio_short: { type: String, intl: true },
        bio_long: { type: String, intl: true },
        dateofbirth: Date,
        dateofdeath: Date,
        nationality: String,
        major: Boolean,
        socialmedia_urls: [String],
        founders: [Schema.Types.ObjectId],
        predecessor: Schema.Types.ObjectId,
        successor: Schema.Types.ObjectId,
        tags: Schema.Types.ObjectId,
        official_positioning: {
            eco: Number,
            soc: Number,
            eu: Number,
            auth: Number
        },
        calculated_positioning: {
            eco: Number,
            soc: Number,
            eu: Number,
            auth: Number
        }
    });
    //  var Party = mongoose.model('Party', partySchema);

    var parlementSchema = new Schema({
        name: { type: String, intl: true },
        type: Number,
        bio_short: { type: String, intl: true },
        bio_long: { type: String, intl: true },
        country: String,
        location: String,
        img_inside: String,
        img_outside: String,
        svg: String //The seat numbers should be embeded in the SVG
    });
    //  var Parlement = mongoose.model('Person', parlementSchema);

    var electionSchema = new Schema({
        name: { type: String, intl: true },
        candidates: [Schema.Types.ObjectId],
        country: String,
        from: Date,
        to: Date,
        published: Date,
        type: Number,
        polls: [{
            institute_name: { type: String, intl: true },
            institute_url: String,
            summary: { type: String, intl: true },
            method_url: String,
            values: [{ candidate: [Schema.Types.ObjectId], value: Number }]
        }]
    });
    //  var Election = mongoose.model('Person', personSchema);

    var countrySchema = new Schema({
        iso_3166_2: String,
        name: { type: String, intl: true },
        bio_short: { type: String, intl: true },
        bio_long: { type: String, intl: true },
        governments: [{ //Array for the unlikely event in which a european country changes constitution
            established: Date,
            socialmedia_urls: [String],
            members: [{
                name: String,
                id: String, //if ever the person exists in the database
                role: { type: String, intl: true },
                type: Number,
                hierarchy: String, //the direct hierarchy of the person
                from: Date,
                to: Date
            }]
        }]
        //The rest of the data we've got about countries, like flags or statistics don't need to be linked to the database.
        //as they can just exist as plain files.
    });
    //  var Country = mongoose.model('Person', personSchema);
    ///////////////////////////
    //  Rendering functions  //
    ///////////////////////////
    //Database page
    app.get("/data", function (req, res, next) {
        res.render("Pages/Database/DataHome.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
    })
    //Person page
    app.get("/person/:id", function (req, res, next) {
        Person.findById(req.params.id, function (err, selPerson) {
            if(selPerson == undefined){
                res.sendStatus(404); return;
            }
            console.log(Date.toCivilizedString(selPerson._doc.birthdate))
            res.render('Pages/Database/Person.ejs', { lang: i18n.getLocale(req), headerIndex: 2, p: selPerson._doc });
        });
    })
    //Country page
    app.get("/country/:name", function (req, res, next) {
        res.render("Pages/Database/CountryPage.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
    })
    //Political party page
    app.get("/party/:country/:name", function (req, res, next) {
        res.render("Pages/Database/PoliticalParty.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
    })
    //Editing page
    app.get("/data/new/person", function (req, res, next) {
        res.render("Pages/Database/EditDatabaseEntry.ejs", { lang: i18n.getLocale(req), headerIndex: 2, partial: "../../Partials/Database/Edit/Person.html"});
    })
    app.get("/data/new/party", function (req, res, next) {
        res.render("Pages/Database/EditDatabaseEntry.ejs", { lang: i18n.getLocale(req), headerIndex: 2, partial: "../../Partials/Database/Edit/Party.html" });
    })
    //Upload person data
    app.post("/data/person/edit/upload", upload.single('profileimg'), function (req, res, next) {
      //  res.sendStatus(403);return;
        var so = JSON.parse(req.body.json);
        var Person = mongoose.model("Person", personSchema);
        var p = new Person;
        Object.assign(p, so);
        var id = mongoose.Types.ObjectId();
       
        p._id = id;
        p.save(function (err, mobj, numAffected) {
            if (err) { res.status(400).send(JSON.stringify(err)); /*fs.unlinkSync(req.file.path);*/ return;  }
            else { res.status(200).send("/person/" + id.toHexString()) }
        });
        cloudinary.uploader.upload(req.file.path, function (result) { /* fs.unlinkSync(req.file.path);*/ },
        {
            public_id: id.toHexString()
        });
    })
}