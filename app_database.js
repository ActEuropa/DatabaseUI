databaseInit = function (app, i18n, upload, im, fs, cloudinary) {

    //Mongoose setup
    var mongoose = require('mongoose');
    mongoose.connect(process.env.MLAB_URL);
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
        fullname: String,
        gender: Number, //0=Male, 1 = Female, 2= Nonbinary
        bio_short: {type: String, intl:true},
        bio_long: {type: String, intl:true},
        dateofbirth: Date,
        locationofbirth: String,
        dateofdeath: Date,
        nationalities: [String],
        jobs: 
        [{ title: {type: String, intl:true}, 
           description: {type: String, intl:true}, 
           from: Date, 
           to: Date,
           political: Boolean, //This mainly serves to calculate the political career length.
           elected: Boolean,
           parlement: Schema.Types.ObjectId, 
           parlementplace: Number }],
        politicalmemberships: 
        [{ party: Schema.Types.ObjectId,
           from: Date,
           to: Date,
           role: [{type: String, intl:true}]}],
        socialmedia_urls: [String],
        img_profile: String,
        quotes: 
        [{
            quote: {type: String, intl:true},
            location: String,
            date: String,
            source_urls: [String],
            context: String
        }],
        criminalrecord:[{
            gravity: 0, //0=not too important, 5= really fucking bad
            title: {type: String, intl:true},
            subtitle: {type: String, intl:true}
        }],
        positioning:{
            soc: Number,
            eco: Number,
            eu: Number,
            auth: Number
        }
    });
    var Person = mongoose.model('Person', personSchema);

    var tagSchema = new Schema({
        text: {type: String, intl:true},
        description: {type: String, intl:true}
    })
    var partySchema = new Schema({
        name: {type: String, intl:true},
        abreviation: String,
        bio_short: {type: String, intl:true},
        bio_long: {type: String, intl:true},
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
    var parlementSchema = new Schema({
        name: {type: String, intl:true},
        type: Number,
        bio_short: {type: String, intl:true},
        bio_long: {type: String, intl:true},
        country: String,
        location: String,
        img_inside: String,
        img_outside: String,
        svg: String //The seat numbers should be embeded in the SVG
    });
    var electionSchema = new Schema({
        name: {type: String, intl:true},
        candidates: [Schema.Types.ObjectId],
        country: String,
        from: Date,
        to: Date,
        published: Date,
        type: Number,
        polls:[{
            institute_name: {type: String, intl:true},
            institute_url: String,
            summary: {type: String, intl:true},
            method_url: String,
            values:[{candidate: [Schema.Types.ObjectId], value: Number}]
        }]
    });
    var countrySchema = new Schema({
        iso_3166_2: String,
        name: {type: String, intl:true},
        bio_short: {type: String, intl:true},
        bio_long: {type: String, intl:true},
        governments:[{ //Array for the unlikely event in which a european country changes constitution
            established: Date,
            socialmedia_urls: [String],
            members:[{
                name: String,
                id: String, //if ever the person exists in the database
                role: {type: String, intl:true},
                type: Number,
                hierarchy: String, //the direct hierarchy of the person
                from: Date,
                to: Date
           }]
        }]
        //The rest of the data we've got about countries, like flags or statistics don't need to be linked to the database.
        //as they can just exist as plain files.
    });
    ///////////////////////////
    //  Rendering functions  //
    ///////////////////////////
    //Database page
    app.get("/data", function (req, res, next) {
        res.render("Pages/Database/DataHome.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
    })
    //Person page
    app.get("/person/:id", function (req, res, next) {
        Person.findById(req.params.id, function(err, selPerson){
            console.log(Date.toCivilizedString( selPerson._doc.birthdate))
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
        res.render("Pages/Database/Person_Edit.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
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
        cloudinary.uploader.upload(req.file.path, function(result) { console.log(result) },
        { public_id: id.toHexString(),
        });

        //fs.unlinkSync(req.file.path);
        p._id = id;
        p.save(function (err, mobj, numAffected) {
            if (err) {res.sendStatus(400); }
            else { res.sendStatus(200); }
        });

       // res.render("Pages/Database/Person_Edit.ejs", { lang: i18n.getLocale(req), headerIndex: 2 });
    })
    app.get("/data/person/new/Test", function (req, res, next) {
        createTestPerson();
    })

    function AddToDatabase(json){
        
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
      //  p.save(function(){console.log("Added test entry to database")});
    }
    var getPersonData = function (name) {
        this.name = "test";
    }
}