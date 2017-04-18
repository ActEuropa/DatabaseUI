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
if (!Detector.webgl) Detector.addGetWebGLMessage();

var renderer, scene, camera, stats, rayCaster, mousePosition, domeEvents, crosshair, controls, frame;
var bottom, back;
var objects = [];
var points_r = []; /* Point array to keep track of original location */
var points = [];
var textlabels = [];

var WIDTH = 528,
    HEIGHT = 528,
    LEFT = 0,
    TOP = 0
var dimension = 512;
var perspective = true;
init();
animate();

function init() {
    scene = new THREE.Scene();
    if (perspective) {
        camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 1, 3000);
        camera.position.z = 1000;
        scene.fog = new THREE.Fog(0xeaeaea, 800, 2000);
    }
    else {
        camera = new THREE.OrthographicCamera(window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -2000, 2000);
        scene.fog = new THREE.Fog(0xeaeaea, 200, -600);
    }
    renderer = new THREE.WebGLRenderer({ antialias: true });
    domEvents = new THREEx.DomEvents(camera, renderer.domElement);

    for (i = 0; i < Candidates.length; i++) {
        AddPoint(Candidates[i].FirstName + " " + Candidates[i].LastName, Candidates[i].Libertarian_sc, Candidates[i].Liberal_sc, Candidates[i].ProEU_sc, scene, Candidates[i].Color);
    }

    var geometryCube = cube(dimension);
    geometryCube.computeLineDistances();
    var object = new THREE.LineSegments(geometryCube, new THREE.LineBasicMaterial({ color: 0x002F55, linewidth: 1 }));
    frame = object;
    scene.add(frame);

    var loader = new THREE.TextureLoader();
    loader.load('../img/chart/Back.png', function (texture) {
        var geometry = new THREE.PlaneGeometry(dimension, dimension);
        var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5, transparent: true, depthWrite: false });
        back = new THREE.Mesh(geometry, material);
        back.position.z = -(dimension / 2);
        scene.add(back);
    });
    loader.load('../img/chart/Bottom.png', function (texture) {
        var geometry = new THREE.PlaneGeometry(dimension, dimension);
        var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5, transparent: true, depthWrite: false });
        bottom = new THREE.Mesh(geometry, material);
        bottom.position.y = -(dimension / 2);
        bottom.rotation.x = Math.PI / 2;
        bottom.rotation.y = Math.PI;
        scene.add(bottom);
    });

    renderer.setClearColor(0xeaeaea);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    //controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minAzimuthAngle = -Math.PI / 2;
    controls.maxAzimuthAngle = Math.PI / 2;
    controls.addEventListener('end', orbitcheck);
    controls.addEventListener('change', moved);
    controls.target.set(0, 1, 0);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.update();

    onWindowResize();

    window.addEventListener('resize', onWindowResize, false);
}
function createTextLabel() {
    var div = document.createElement('div');
    div.className = 'text-label';
    div.style.position = 'absolute';
    div.style.width = 100;
    div.style.height = 100;
    div.style.color = this.Color;
    div.innerHTML = "";
    div.style.top = -1000;
    div.style.left = -1000;
    div.style.transition = "100ms";

    var _this = this;

    return {
        element: div,
        parent: false,
        position: new THREE.Vector3(0, 0, 0),
        setHTML: function (html) {
            this.element.innerHTML = html;
        },
        setParent: function (threejsobj) {
            this.parent = threejsobj;
        },
        updatePosition: function () {
            if (parent) {
                this.position.copy(this.parent.position);
            }

            var coords2d = this.get2DCoords(this.position, _this.camera);
            this.element.style.left = coords2d.x + 'px';
            this.element.style.top = coords2d.y + 'px';
        },
        get2DCoords: function (position, camera) {
            var vector = position.project(camera);
            vector.x = (vector.x + 1) / 2 * WIDTH + LEFT + 12;
            vector.y = -(vector.y - 1) / 2 * HEIGHT + TOP - 24;
            return vector;
        }
    };
}

function cube(size) {

    var h = size * 0.5;

    var geometry = new THREE.Geometry();

    geometry.vertices.push(
        new THREE.Vector3(-h, -h, -h),
        new THREE.Vector3(-h, h, -h),

        new THREE.Vector3(-h, h, -h),
        new THREE.Vector3(h, h, -h),

        new THREE.Vector3(h, h, -h),
        new THREE.Vector3(h, -h, -h),

        new THREE.Vector3(h, -h, -h),
        new THREE.Vector3(-h, -h, -h),


        new THREE.Vector3(-h, -h, h),
        new THREE.Vector3(-h, h, h),

        new THREE.Vector3(-h, h, h),
        new THREE.Vector3(h, h, h),

        new THREE.Vector3(h, h, h),
        new THREE.Vector3(h, -h, h),

        new THREE.Vector3(h, -h, h),
        new THREE.Vector3(-h, -h, h),

        new THREE.Vector3(-h, -h, -h),
        new THREE.Vector3(-h, -h, h),

        new THREE.Vector3(-h, h, -h),
        new THREE.Vector3(-h, h, h),

        new THREE.Vector3(h, h, -h),
        new THREE.Vector3(h, h, h),

        new THREE.Vector3(h, -h, -h),
        new THREE.Vector3(h, -h, h)
    );

    return geometry;

}
function cross(size, x, y, z) {

    var h = size * 0.5;

    var geometry = new THREE.Geometry();
    if (checkforview != "side")
        geometry.vertices.push(
            new THREE.Vector3(x, y, -(dimension / 2)),
            new THREE.Vector3(x, y, dimension / 2)
        );
    if (checkforview != "top")
        geometry.vertices.push(
            new THREE.Vector3(x, -(dimension / 2), z),
            new THREE.Vector3(x, (dimension / 2), z)
        );
    geometry.vertices.push(
        new THREE.Vector3(-(dimension / 2), y, z),
        new THREE.Vector3(dimension / 2, y, z)
    );
    return geometry;

}

function onWindowResize() {

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    var cont = document.getElementById("container");
    HEIGHT = cont.offsetHeight;
    WIDTH = cont.offsetWidth;
    LEFT = cont.offsetLeft;
    TOP = cont.offsetTop;
    renderer.setSize(WIDTH, HEIGHT);
}

function animate(time) {
    requestAnimationFrame(animate);
    render();
    TWEEN.update(time);
    stats.update();
    controls.update;
}

var checkforview = undefined;
function render() {
    var time = Date.now() * 0.001;

    for (var i = 0; i < textlabels.length; i++) {
        textlabels[i].updatePosition();
    }
    renderer.render(scene, camera);
}
var animateOk;
function orbitcheck() {
    var azimuthal = controls.getAzimuthalAngle();
    console.log(azimuthal);
    var polar = controls.getPolarAngle();
    if (polar > 1.45 && polar < 1.65 && azimuthal > -0.15 && azimuthal < 0.15) {
        checkforview = "side";
        console.log("SIDE");
        for (i = 0; i < points.length; i++) {
            new TWEEN.Tween(points[i].position).to({ z: 256 }, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        }
        new TWEEN.Tween(frame.scale).to({ z: 0.0001 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(back.scale).to({ x: 1.4, y: 1.4 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(back.material).to({ opacity: 0.5 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(frame.position).to({ z: 256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(back.position).to({ z: 256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(bottom.material).to({ opacity: 0 }, 100).start();
    }
    else if (polar < 0.05) {

        console.log("TOP VIEW");
        checkforview = "top";
        for (i = 0; i < points.length; i++) {
            new TWEEN.Tween(points[i].position).to({ y: 256 }, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        }
        new TWEEN.Tween(frame.scale).to({ y: 0.0001 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(frame.position).to({ y: 256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(bottom.position).to({ y: 256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(back.material).to({ opacity: 0 }, 100).start();
        new TWEEN.Tween(bottom.scale).to({ x: 1.4, y: 1.4 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(bottom.material).to({ opacity: 0.5 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
    }
    else if (polar > 3.09) {
        console.log("BOTTOM VIEW");
    }
}
function moved() {
    if (checkforview != undefined) {
        var polar = controls.getPolarAngle();
        var azimuthal = controls.getAzimuthalAngle();
        if (checkforview == "side" && (polar < 1.45 || polar > 1.64 || azimuthal < -0.15 || azimuthal > 0.15)) {
            checkforview = undefined;
            console.log("SIDE");
            for (i = 0; i < points.length; i++) {
                var pos = points_r[i].position;
                new TWEEN.Tween(points[i].position).to(pos, 1000).easing(TWEEN.Easing.Exponential.Out).start();
            }
            new TWEEN.Tween(frame.scale).to({ z: 1 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(back.scale).to({ x: 1, y: 1 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(back.material).to({ opacity: 1 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(frame.position).to({ z: 0 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(back.position).to({ z: -256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(bottom.material).to({ opacity: 1 }, 100).start();
            new TWEEN.Tween(top.material).to({ opacity: 1 }, 100).start();
        }
        else if (checkforview == "top" && polar > 0.05) {
            checkforview = undefined;
            for (i = 0; i < points.length; i++) {
                var pos = points_r[i].position;
                new TWEEN.Tween(points[i].position).to(pos, 1000).easing(TWEEN.Easing.Exponential.Out).start();
            }
            new TWEEN.Tween(frame.scale).to({ y: 1 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(frame.position).to({ y: 0 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(bottom.position).to({ y: -256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(back.material).to({ opacity: 1 }, 100).start();
            new TWEEN.Tween(bottom.scale).to({ x: 1, y: 1 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(bottom.material).to({ opacity: 1 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        }
        else if (polar < 3.09) {
            console.log("BOTTOM VIEW");
        }
    }
}
var meshes = [];
function AddPoint(label, x, y, z, scene, color) {
    var material = new THREE.MeshBasicMaterial({
        color: color, depthWrite: false
    });
    var geometry = new THREE.SphereGeometry(12, 48, 48);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (x - 50) * (dimension / 100);
    mesh.position.y = (y - 50) * (dimension / 100);
    mesh.position.z = (z - 50) * (dimension / 100);
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = true;
    points.push(mesh);
    points_r.push(mesh.clone());
    scene.add(mesh);
    var text = this.createTextLabel();
    text.setHTML(label);
    text.setParent(mesh);
    text.element.style.color = color;
    text.element.style.opacity = 0;
    this.textlabels.push(text);
    this.container.appendChild(text.element);
    domEvents.addEventListener(mesh, 'mouseover', function (event) {
        var geometryCube = cross(dimension, mesh.position.x, mesh.position.y, mesh.position.z);
        geometryCube.computeLineDistances();
        crosshair = new THREE.LineSegments(geometryCube, new THREE.LineBasicMaterial({ color: color, linewidth: 1, depthWrite: false, depthTest: false, renderOrder: 3 }));
        scene.add(crosshair);
        text.element.style.opacity = 1;
    }, false)
    domEvents.addEventListener(mesh, 'mouseout', function (event) {
        scene.remove(crosshair);
        text.element.style.opacity = 0;
    }, false)
}

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