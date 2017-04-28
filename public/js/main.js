function Person(FirstName, LastName, DateOfBirth, Liberal_sc, Libertarian_sc, ProEU_sc, Bio, Beliefs, Party, Country, Color) {
    this.FirstName = FirstName;
    this.LastName = LastName;
    this.DateOfBirth = DateOfBirth;
    this.Liberal_sc = Liberal_sc;
    this.Libertarian_sc = Libertarian_sc;
    this.ProEU_sc = ProEU_sc;
    this.Bio = Bio;
    this.Beliefs = Beliefs;
    this.Party = Party;
    this.Country = Country;
    this.Color = Color;
}

var p1 = new Person("Emmanuel", "Macron", "21/12/1977", 80, 70, 80, "", "", "En Marche!", "FR", "#377672");
var p2 = new Person("Jean-Luc", "Mélenchon", "19/07/1951", 95, 10, 40, "", "", "La France Insoumise - GUE/NGL", "FR", "#b50000");
var p3 = new Person("Marine", "Le Pen", "05/07/1968", 3, 10, 10, "", "", "FN", "FR", "#1f2c6f");
var p4 = new Person("François", "Fillon", "04/03/1954", 10, 95, 60, "", "", "La France Insoumise", "FR", "#452887");
var Candidates = [p1, p2, p3, p4];


//Sticky headers + Graphs:
jQuery(document).ready(function () {
    $('select').niceSelect();
    var cc = "ES";
    NewGraph({title: "GDP", file:"../data/GDP.tsv", column:"unit,s_adj,na_item,geo\\time",rows:["CP_MNAC,NSA,B1GQ,"+cc],id:"g-gdp",multiplier:1000000,type:"€"});
    NewGraph({title: "NATIONAL DEBT", file:"../data/DEBT.tsv", column:"unit,sector,na_item,geo\\time",rows:["MIO_EUR,S13,GD,"+cc,"MIO_EUR,S13,GD,EA18"],id:"g-debt",type:"€",multiplier:1000000});
    NewGraph({title: "UNEMPLOYMENT", file:"../data/UNEMPLOYMENT.tsv", column:"age,unit,sex,geo\\time",rows:["TOTAL,PC_ACT,T,"+cc,"TOTAL,PC_ACT,T,EU28"],id:"g-unemployment",min:0,max:100,type:"%"});
    NewGraph({title: "POPULATION", file:"../data/POPULATION.tsv", column:"indic_de,geo\\time",rows:["JAN,"+cc],id:"g-population",type:""});
 
    $('#sticky-list').stickySectionHeaders({
        stickyClass: 'sticky',
        headlineSelector: 'strong'
    });

});
NewVosem(Candidates);
function NewGraph(dataset) {
    d3.tsv(dataset.file, function (data) {
        //var filtered = data.filter(d => d[column] == row);
        var dataarray = [];
        //var selectedData = d3.entries(filtered[0]).filter(d => d.key != [column]);
        dataset.rows.forEach(function (r) {
            var selectedData = d3.entries(data.filter(d => d[dataset.column] == r)[0]).filter(d => d.key != [dataset.column]);
            if(dataset.multiplier != undefined){
                for (i = 0; i < selectedData.length; i++) { 
                    selectedData[i].value = selectedData[i].value*dataset.multiplier;
                }
            }
            dataarray.push(selectedData);
            var valray = selectedData.map(a => a.value)
            var tmax = Math.max.apply(Math, valray);
            var tmin  = Math.min.apply(Math, valray);
            if (dataset.max == undefined || dataset.max<tmax) dataset.max = tmax;
            if (dataset.min == undefined || dataset.min>tmin) dataset.min = tmin;
        });
        
        var latestdata = dataarray[0][dataarray[0].length-1]
        $("#grapharea").prepend("<div class='graph_container'>\
                             <div class='graph' id='"+dataset.id+"'></div>\
                             <span class='graph_title'>"+dataset.title+"</span>\
                             <span class='graph_value'>"+ spacenb(latestdata.value) + dataset.type+"</span>\
                             <div><span class='graph_rating'>2nd</span><span class='graph_place'> in europe</span></div>\
                             <div style='margin-top:-12px;'><span class='graph_rating'>7th</span><span class='graph_place'> in the world</span></div>\
                          </div>");
        MG.data_graphic({
            animate_on_load: true,
            data: dataarray,
            width: 240,
            height: 128,
            top: 24,
            bottom: 0,
            right: -8,
            left: -8,
            area: false,
            missing_is_hidden: true,
            min_y: dataset.min,
            max_y: dataset.max,
            target: document.getElementById(dataset.id),
            x_accessor: 'key',
            y_accessor: 'value'
        });
    });
}
function spacenb(num) {
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}