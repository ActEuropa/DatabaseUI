databaseInit = function (app, i18n, upload, im, fs, cloudinary) {

    //Function to create JSON from the schema
    Array.prototype.contains = function (a) { for (i in this) { if (this[i] == a) return true; } return false; }
    var objectPath = require("object-path");
    function CreateForm(schema) {
        var FormHTML = "";
        var currentpath = "";
        var getPath = function (object, key) {

            function iter(o, p) {
                if (typeof o === 'object') {
                    return Object.keys(o).some(function (k) {
                        return iter(o[k], p.concat(k));
                    });
                }
                if (p[p.length - 1] === key) {
                    path = p;
                    return true;
                }
            }

            var path = [];
            iter(object, []);
            return path.join('.');
        }

        var iterate = function (mainobj, name, recpath) {
            currentpath = recpath + "." + name;
            var obj = mainobj[name];
            var formObject = new Object();
            formObject.name = name;
            if (Array.isArray(obj)) {
                formObject.isArray = true;
                obj = obj[0];
            }
            formObject.type = [];
            if (mainobj[name].type === undefined) {
                for (var propertyName in obj) {
                    formObject.type.push(iterate(obj, propertyName, currentpath))
                }
            }
            else {
                formObject.type = obj.type.name;
            }

            if (obj.$DISP != undefined)
                formObject.$DISP = obj.$DISP;
            currentpath = "";
            if (Intlfields.contains(name)) formObject.intl = true;
            else formObject.intl = false;
            return formObject;
        }
        var schobj = schema.obj
        var entries = [];
        for (var propertyName in schobj) {
            entries.push(iterate(schobj, propertyName, ""))
        }
        var newInput = function (type, name) {
            return "<input class='styledinput' type='" + type + "' autocomplete='off' style='width:100%;' data-name='" + name + "'></input>"
        }
        var newentry = function (item) {
            var currentStr = "";
            var type = "text"
            var HitElse = false;
            if (item.type == "Date") type = "date"
            else if (item.type == "Number") type = "number"
            else if (item.isArray) {
                HitElse = true;
                currentStr += "<h2>" + item.name + "</h2>"
                currentStr += "<div style='background-color:white;padding:12px;'>"
                for (i2 = 0; i2 < item.type.length; i2++) {
                    currentStr += newentry(item.type[i2]);
                }
                currentStr += "</div>"
            }
             if(!HitElse) currentStr += "<label>"+ item.name + "</label>" + newInput(item.type, item.name)
            return currentStr;
        }
        for (i = 0; i < entries.length; i++) {
            FormHTML += newentry(entries[i])
        }
        return FormHTML;
    }
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
    mongoose.plugin(mongooseIntl, { languages: ["en", "cr", "cs", "da", "nl", "et", "fi", "fr", "bg", "de", "el", "hu", "ga", "it", "lv", "lt", "mt", "pl", "pt", "ro", "sk", "sl", "es", "sv"], defaultLanguage: 'en' });

    var Intlfields = ["bio_short", "bio_long", "title", "description", "role", "quote", "subtitle"]; //This is to keep track of translateable fields

    //Mongoose schema definitions
    //WARNING!!!!! DO NOT CALL ANY PROPERTY "TYPE"! IT WILL MESS UP WITH THE FORM CREATION FUNCTION!

    var Schema = mongoose.Schema;
    var personSchema = new Schema({
        visibility: {type: Number}, //0=visible, 1= hidden, 2= non-referenced
        name: { type: String },
        fullname: { type: String },
        gender: { type: Number }, //0=Male, 1 = Female, 2= Nonbinary
        bio_short: { type: String, intl: true },
        bio_long: { type: String, intl: true },
        dateofbirth: { type: Date },
        locationofbirth: { type: String },
        dateofdeath: { type: Date },
        nationalities: [{ type: String }],
        jobs:
        [{
            title: { type: String, intl: true },
            description: { type: String, intl: true },
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
            role: [{ type: String, intl: true }]
        }],
        socialmedia_urls: [{ type: String }],
        quotes:
        [{
            quote: { type: String, intl: true },
            location: { type: String },
            date: { type: String },
            source_urls: [{ type: String }],
            context: { type: String }
        }],
        criminalrecord: [{
            gravity: { type: Number }, //0=not too important, 5= really fucking bad
            title: { type: String, intl: true },
            subtitle: { type: String, intl: true },
            timeline: {
                title: { type: String, intl: true },
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
        bio_short: { type: String, intl: true },
        bio_long: { type: String, intl: true },
        dateofbirth: Date,
        dateofdeath: Date,
        nationality: String,
        major: Boolean,
        img_profile: String,
        img_cover: String,
        socialmedia_urls: [String],
        predecessor: Schema.Types.ObjectId,
        successor: Schema.Types.ObjectId,
        tags: Schema.Types.ObjectId,
        official_positioning: {
            SocialFreedom: Number,
            EconomicFreedom: Number,
            Europeanism: Number,
            Authoritarianism: Number
        },
        calculated_positioning: {
            SocialFreedom: Number,
            EconomicFreedom: Number,
            Europeanism: Number,
            Authoritarianism: Number
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
    app.get("/data/person/edit", function (req, res, next) {
        res.render("Pages/Database/EditDatabaseEntry.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
    })
    //Upload person data
    app.post("/data/person/edit/upload", upload.single('profileimg'), function (req, res, next) {
        var sentobj = JSON.parse(req.body.json);
        var Person = mongoose.model("Person", personSchema);
        var p = new Person;
        p.name = sentobj.name;
        p.fullname = sentobj.fullname
        p.gender = sentobj.gender;
        p.set("bio_short.all", sentobj.bio_short);
        p.set("bio_long.all", sentobj.bio_short);
        p.dateofbirth = new Date(sentobj.birth_date);
        p.nationalities = sentobj.nationalities;
        p.positioning.eco = sentobj.positioning.eco;
        p.positioning.soc = sentobj.positioning.soc;
        p.positioning.eu = sentobj.positioning.eu;
        p.positioning.auth = sentobj.positioning.auth;

        var id = mongoose.Types.ObjectId();
        cloudinary.uploader.upload(req.file.path, function (result) { console.log(result) },
            {
                public_id: id.toHexString()
            });

        //fs.unlinkSync(req.file.path);
        p._id = id;
        p.save(function (err, mobj, numAffected) {
            if (err) { res.sendStatus(400); }
            else { res.sendStatus(200); }
        });

        // res.render("Pages/Database/Person_Edit.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
    })
}