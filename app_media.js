
var SaveProfileImage = function(file, id){
        gm(file.path).resize(96, 96, '!').write('public/media/w96/', function (err) {if (!err) console.log('done');});
    }