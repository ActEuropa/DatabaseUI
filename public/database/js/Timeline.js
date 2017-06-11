function randomVal(min,max){ return Math.floor(Math.random()*(max-min+1)+min); }
function get_random_color() {
    return "hsl(" + randomVal(0,360) + ","+ randomVal(0,70) + "%,30%)";
}

var scale = 0.2;
var totalHeight = 0;
//Event to display on the timeline
function Event(title, start, end, template) {
    this.start = start;
    this.end = end;
    this.title = title;
    this.color = get_random_color();
    this.template = template;
    this.side = 0;
    this.fontsize = "0.75em";
    this.fontweight = "400";
    if (this.end == undefined) {
        this.color = "#c73e12";
        this.fontsize = "0.9em";
        this.fontweight= "bold";
    }
    var wtester = $(".widthtester").first().css({"font-weight": this.fontweight, "font-size": this.fontsize});
    wtester.text(this.title)
    this.mwidth = wtester.outerWidth();
    /*height and scale properties*/
    this.scale = ko.observable(scale);
    this.height = ko.computed(function () {
        var days;
        if (!this.end) {
            days = moment().diff(this.start, "days");
        } else {
            days = this.end.diff(this.start, "days");
        }
        var h = days * this.scale();
        totalHeight += h;
        return days * this.scale();
    }, this);
    this.top = ko.computed(function () {
        var now = moment();
        if (!this.end) {
            return 0;
        }
        var diff = now.diff(this.end, 'days');
        return (diff * (this.scale()));

    }, this);

    /*time helpers*/
    this.fromEnd = function () {
        if (!this.end) {
            return "present"
        }
        return this.end.from(moment());
    };
    this.fromStart = function () {
        return this.start.from(moment());
    };
    /*selected*/
    this.selected = ko.observable(false);
    this.toggleSelected = function () {
        this.selected(!this.selected());
    };
}

//TODO: no overlapping event paradigm

//right events

var rightEvents = [];
var leftEvents = []
var latestDate = 0;

//Timeline Viewmodel
function ViewModel() {
    this.title = "jQuery Simple Timeline";
    this.subtitle = "Example";
    this.lastIndex = 0;
    var politicalTime = 0;
    //THIS IS KIND OF SHITTY (at least it doesn't need to be obfuscated though)
    for (i = 0, len = events.length; i < len; i++) {
        var start1 = events[i].start.unix();
        var end1 = Date.now();
        if (events[i].end != undefined)
            var end1 = events[i].end.unix();
        if(latestDate < end1)
        latestDate = end1;
        for (i2 = 0, len2 = i; i2 < len2; i2++) {
            if (events[i2] != events[i]) {
                var start2 = events[i2].start.unix();
                var end2 = Date.now();
                if (events[i2].end != undefined)
                    var end2 = events[i2].end.unix();
                if (start1 < end2 && end1 > start2) {
                    if(events[i].top() - events[i2].top() < 36)
                       events[i].side = events[i].side + events[i2].mwidth;
                    else
                       events[i].side = events[i].side+4;
                }
                else if(events[i].top() - events[i2].top() < 36){
                    events[i].side = events[i].side + events[i2].mwidth;
                }
            }
        };
                       
        if(events[i].template.political == "true"){
            politicalTime = politicalTime +  (end1 - start1);
        }
        $("#politicalCareer").text(humanizeDuration(politicalTime*1000, {units: ['y', 'mo', 'd'], round:true}));
        console.log("pushed");
        console.log("side=" + events[i].side);
        rightEvents.push(events[i]);
    }

    
    $("#timeline-grid").css("height", totalHeight-200 + "px");
    this.leftEvents = ko.observableArray(leftEvents);
    this.rightEvents = ko.observableArray(events);
    this.currentScale = ko.observable(scale);
    this.currentScale.subscribe(this.updateEventsScale.bind(this));

    //any selected
    this.itemSelected = ko.computed(function () {
        var leftSelected = this.leftEvents().some(function (event) {
            return event.selected();
        });
        //return early
        if (leftSelected) {
            return leftSelected;
        }
        var rightSelected = this.rightEvents().some(function (event) {
            return event.selected();
        });

        return rightSelected;
    }, this);

    //combined and sorted items
    this.combinedSorted = ko.computed(function () {

        var combined = this.leftEvents().concat(this.rightEvents());

        //sort by computed top position
        combined.sort(function (a, b) {

            if (a.top() < b.top())
                return -1;
            if (a.top() > b.top())
                return 1;
            return 0;

        });

        return combined;

    }, this);
};

ViewModel.prototype.updateEventsScale = function (value) {
    this.leftEvents().forEach(function (event) {
        event.scale(value);
    });
    this.rightEvents().forEach(function (event) {
        event.scale(value);
    });
};
ViewModel.prototype.scrollNext = function () {

    if (this.lastIndex < this.combinedSorted().length - 1) {
        this.lastIndex++;
    }
    var top = this.combinedSorted()[this.lastIndex].top()

    $.scrollTo(top, 250);

};
ViewModel.prototype.scrollPrevious = function () {

    if (this.lastIndex > 0) {
        this.lastIndex--;
    }
    var top = this.combinedSorted()[this.lastIndex].top()

    $.scrollTo(top, 250);

};

//TODO also fire when scrolling
$("#timeline-grid").mousemove(function(e){ 
    document.getElementById('currentdate').style.top =(e.pageY - $(this).position().top) + "px";
    var latest = new Date(latestDate);

    latest.setDate(latest.getDate() - (e.pageY - $(this).position().top) / scale)
    $("#currentdate span").first().text(fdate(latest));
});

function fdate(d) {
  let mm = String(d.getMonth() + 1); let dd = String(d.getDate()); const yy = String(d.getFullYear()); if (mm.length < 2) mm = '0' + mm; if (dd.length < 2) dd = '0' + dd;
  return `${mm}/${dd}/${yy}`;
}