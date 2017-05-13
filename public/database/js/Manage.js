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

$("#add-nationality").click(function (e) {
    AddNewItem(nationalitylist, "#remove-nationality");
})
$("#remove-nationality").click(function (e) {
    RemoveItem(nationalitylist, "#remove-nationality");
})

var positionlist = $("#positions");
$("#add-position").click(function (e) {
    AddNewItem(positionlist, "#remove-position");
})
$("#remove-position").click(function (e) {
    RemoveItem(positionlist, "#remove-position");
})

var membershiplist = $("#memberships");
$("#add-membership").click(function (e) {
    AddNewItem(membershiplist, "#remove-membership");
})
$("#remove-membership").click(function (e) {
    RemoveItem(membershiplist, "#remove-membership");
})
function AddNewItem(list, removebutton){
    var select = list.children("div")[0];
    var new_item = $(select.outerHTML);
    var ni_children = new_item.children("textarea, input");
    for (index = 0; index < ni_children.length; ++index) {
        ni_children[index].innerHTML = "";
    }
    list.append(new_item);
    if(list.children("div").length > 1){
        $(removebutton).show(200);
    }
}
function RemoveItem(list, removebutton){
    list.children("div").last().remove();
    if(list.children("div").length < 2){
        $(removebutton).hide(200);
    }
}
$("#send").click(function (e) {

})