$("#profile-img-input").change(function () {
    var files = $(this)[0].files;
    if (files.length > 0) {
        var file = files[0]
        $('#rectangle-preview').attr('src', window.URL.createObjectURL(file));
        $('#circle-preview').attr('src', window.URL.createObjectURL(file));
        $('#preview-size').html(file.size + ' bytes');
    }
})
var nationalitylist = $("#nationalities");
$("#add-nationality").click(function (e) { nationalitylist=$("#nationalities"); AddNewItem(nationalitylist, "#remove-nationality", true); $("nationalitylist") })
$("#remove-nationality").click(function (e) { nationalitylist= $("#nationalities"); RemoveItem(nationalitylist, "#remove-nationality", true); })

var positionlist = $("#positions");
$("#add-position").click(function (e) { AddNewItem(positionlist, "#remove-position"); })
$("#remove-position").click(function (e) { RemoveItem(positionlist, "#remove-position"); })

var membershiplist = $("#memberships");
$("#add-membership").click(function (e) { AddNewItem(membershiplist, "#remove-membership"); })
$("#remove-membership").click(function (e) { RemoveItem(membershiplist, "#remove-membership"); })

var socialmedialist = $("#socialmedias");
$("#add-socialmedia").click(function (e) { AddNewItem(socialmedialist, "#remove-socialmedia"); })
$("#remove-socialmedia").click(function (e) { RemoveItem(socialmedialist, "#remove-socialmedia"); })

var quotelist = $("#quotes");
$("#add-quote").click(function (e) { AddNewItem(quotelist, "#remove-quote"); })
$("#remove-quote").click(function (e) { RemoveItem(quotelist, "#remove-quote"); })

$("#eco_range").on("input", function(){ ChangeValText("#eco_range")})
$("#soc_range").on("input", function(){ ChangeValText("#soc_range")})
$("#eu_range").on("input", function(){ ChangeValText("#eu_range")})
$("#auth_range").on("input", function(){ ChangeValText("#auth_range")})

function ChangeValText(rangename){$(rangename + "_val").text($(rangename).val()); }

var personObject = {}
personObject.positioning = {soc:50, eco:50, eu:50, auth: 50};
$("#fullname, #birth_date, #death_date").change(function (){ personObject[this.id] = $(this).val() })

$("#nationalities select").change(function(){
    var natArray = [];
    $("#nationalities select").each(function(i){ natArray.push($($("#nationalities select")[i]).val()); })
    personObject.nationality = natArray;
})

$("#eco_range").change(function(){personObject.positioning.eco = parseInt($(this).val()) })
$("#soc_range").change(function(){personObject.positioning.soc = parseInt($(this).val()) })
$("#eu_range").change(function(){personObject.positioning.eu = parseInt($(this).val()) })
$("#auth_range").change(function(){personObject.positioning.auth = parseInt($(this).val()) })

var localizableInputs = $("#bio_short, #bio_long");
localizableInputs.on("input", function (){
    if(personObject[this.id] == undefined) personObject[this.id] = {};
    personObject[this.id][$("#currentlang").val()] = $(this).val();
    console.log("editing" + this.id);
    if($(this).val().length == 0) delete personObject[this.id][$("#currentlang").val()];
    var valuelist = "";
    for(x in personObject[this.id]){
        x = $("<a/>", { text: x }).attr("onclick","languageClick(this)");
        x.addClass("langAnchor")
        if($("#currentlang").val() == x.text()) x.addClass("selected");
        valuelist = valuelist + "&nbsp;&nbsp;" + x[0].outerHTML;
    }
    $("#"+ this.id + "_props").html(valuelist);
})
$("#currentlang").change(function(){
    var objs = $(".inputprops a");
    var currentlang = $("#currentlang").val();
    objs.removeClass("selected");
    objs.each(function(i){
        if(objs[i].innerHTML == currentlang)
        $(objs[i]).addClass("selected")
    });
    localizableInputs.each(function(i){
        $(localizableInputs[i]).val(personObject[this.id][$("#currentlang").val()]);
    })
});
function languageClick(e){
    $("#currentlang").val(e.innerHTML);
    $("#currentlang").niceSelect("update");
    $("#currentlang").change();
}

$("#bio_long").change(function (){
    personObject.bio_long[$("#currentlang").val()] = $("#bio_long").val();
})
function AddNewItem(list, removebutton, ignoreAnimation){
    var select = list.children("div")[0];
    var new_item = $(select).clone(true).hide();
    var ni_children = new_item.children("textarea, input");
    for (index = 0; index < ni_children.length; ++index) {
        ni_children[index].innerHTML = "";
    }
    list.append(new_item);
    if(ignoreAnimation != true) new_item.slideDown(300);
    else new_item.fadeIn(200);
    if(list.children("div").length > 1){
        $(removebutton).fadeIn(200);
    }
}
function RemoveItem(list, removebutton, ignoreAnimation){
    if(ignoreAnimation != true)
    list.children("div").last().slideUp(300,function(){
        list.children("div").last().remove();
        if(list.children("div").length < 2) $(removebutton).fadeOut(200);
    })
    else{
        list.children("div").last().remove();
        if(list.children("div").length < 2) $(removebutton).fadeOut(200);
    }
}
$("#send").click(function (e) {
    alert(JSON.stringify(personObject));
})