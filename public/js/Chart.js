if (!Detector.webgl) Detector.addGetWebGLMessage();

var renderer, scene, camera, stats, crosshair, controls, frame;
var bottom, back;
var points_r = []; /* Point array to keep track of original location */
var points = [];
var textlabels = [];
var crosshairs = [];
var WIDTH = 528,
    HEIGHT = 528,
    LEFT = 0,
    TOP = 0;
var dimension = 512;
var container;
function NewVosem(Candidates, foreground = 0x002F55, background = 0xeaeaea, showlabels=true, holdcross=false) {
var createTextLabel = function() {
    var div = document.createElement('div');
    div.className = 'text-label';
    div.style.position = "absolute";
    div.style.width = 100;
    div.style.height = 100;
    div.style.color = this.Color;
    div.innerHTML = "";

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
        vector.x = (vector.x + 1)/2 * WIDTH + 12;
        vector.y = -(vector.y - 1)/2 * HEIGHT -24;
            return vector;
        }
    };
};

var cube = function(size) {

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

};
var cross = function(size, x, y, z) {

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

};

var onWindowResize = function() {

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
    var cont = document.getElementById("vosem-container");
    HEIGHT = cont.offsetHeight;
    WIDTH = cont.offsetWidth;
    LEFT = cont.offsetLeft;
    TOP = cont.offsetTop;
    renderer.setSize(WIDTH, HEIGHT);
};

var animate = function(time) {
    requestAnimationFrame(animate);
    render();
    TWEEN.update(time);
    stats.update();
    controls.update;
};

var checkforview = undefined;
var render = function() {
    for (var i = 0; i < textlabels.length; i++) {
        textlabels[i].updatePosition();
    }
    renderer.render(scene, camera);
};
var orbitcheck = function() {
    var azimuthal = controls.getAzimuthalAngle();
    console.log(azimuthal);
    var polar = controls.getPolarAngle();
    if (polar > 1.45 && polar < 1.65 && azimuthal > -0.15 && azimuthal < 0.15) {
        checkforview = "side";

        for (i = 0; i < points.length; i++) {
            new TWEEN.Tween(points[i].position).to({ z: 256 }, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        }
        for (i = 0; i < crosshairs.length; i++) {
            new TWEEN.Tween(crosshairs[i].scale).to({ z: 0.0001 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(crosshairs[i].position).to({ z: 256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        }
        new TWEEN.Tween(frame.scale).to({ z: 0.0001 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(back.scale).to({ x: 1.4, y: 1.4 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(back.material).to({ opacity: 0.5 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(frame.position).to({ z: 256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(back.position).to({ z: 256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        currentBGtween = new TWEEN.Tween(bottom.material).to({ opacity: 0 }, 100).start();
    }
    else if (polar < 0.05) {
        checkforview = "top";
        for (i = 0; i < points.length; i++) {
            new TWEEN.Tween(points[i].position).to({ y: 256 }, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        }
        for (i = 0; i < crosshairs.length; i++) {
            new TWEEN.Tween(crosshairs[i].scale).to({ y: 0.0001 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(crosshairs[i].position).to({ y: 256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        }
        new TWEEN.Tween(frame.scale).to({ y: 0.0001 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(frame.position).to({ y: 256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(bottom.position).to({ y: 256 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        
        currentBGtween = new TWEEN.Tween(back.material).to({ opacity: 0 }, 100).start();
        new TWEEN.Tween(bottom.scale).to({ x: 1.4, y: 1.4 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(bottom.material).to({ opacity: 0.5 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
    }
    else if (polar > 3.09) {
        console.log("BOTTOM VIEW");
    }
};
var currentBGtween;
var moved = function() {
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
            for (i = 0; i < crosshairs.length; i++) {
                new TWEEN.Tween(crosshairs[i].scale).to({ z: 1 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
                new TWEEN.Tween(crosshairs[i].position).to({ z: 0 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
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
            for (i = 0; i < crosshairs.length; i++) {
                new TWEEN.Tween(crosshairs[i].scale).to({ y: 1 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
                new TWEEN.Tween(crosshairs[i].position).to({ y: 1 }, 600).easing(TWEEN.Easing.Exponential.Out).start();
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
};
var AddPoint = function(label, x, y, z, scene, color) {
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
    if(showlabels)
    {
    var text = createTextLabel();
    text.setHTML(label);
    text.setParent(mesh);
    text.element.style.color = color;
    text.element.style.opacity = 0;
    this.textlabels.push(text);
    container.appendChild(text.element);
    }
if(holdcross)
{
        var geometryCube = cross(dimension, mesh.position.x, mesh.position.y, mesh.position.z);
        geometryCube.computeLineDistances();
        crosshair = new THREE.LineSegments(geometryCube, new THREE.LineBasicMaterial({ color: color, linewidth: 1, depthWrite: false, depthTest: false, renderOrder: 3 }));
        crosshairs.push(crosshair);
        scene.add(crosshair);
}
    domEvents.addEventListener(mesh, 'mouseover', function (event) {
        if(!holdcross)
        {
        var geometryCube = cross(dimension, mesh.position.x, mesh.position.y, mesh.position.z);
        geometryCube.computeLineDistances();
        crosshair = new THREE.LineSegments(geometryCube, new THREE.LineBasicMaterial({ color: color, linewidth: 1, depthWrite: false, depthTest: false, renderOrder: 3 }));
        crosshairs.push(crosshair);
        scene.add(crosshair);
        }
        text.element.style.opacity = 1;
    }, false);
    domEvents.addEventListener(mesh, 'mouseout', function (event) {
        if(!holdcross)
        {
            crosshairs = crosshairs.filter(function(tremove) { 
                return tremove !== crosshair;
            });
            scene.remove(crosshair);
            
        }
        
        text.element.style.opacity = 0;
    }, false);
};
    container = document.getElementById('vosem-container');
    camera = new THREE.CombinedCamera(512,512,60,1,3000)
    camera.position.z = 1000;
    scene = new THREE.Scene();

    if(background == "transparent"){
        scene.fog = new THREE.FogExp2(background, 0.0006);
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha:true });
    } 
    else{
        scene.fog = new THREE.FogExp2(background, 0.0006);
        renderer = new THREE.WebGLRenderer({ antialias: true});
    }

    domEvents = new THREEx.DomEvents(camera, renderer.domElement);

    for (i = 0; i < Candidates.length; i++) {
        AddPoint(Candidates[i].FirstName + " " + Candidates[i].LastName, Candidates[i].Libertarian_sc, Candidates[i].Liberal_sc, Candidates[i].ProEU_sc, scene, Candidates[i].Color);
    }

    var geometryCube = cube(dimension);
    geometryCube.computeLineDistances();
    var object = new THREE.LineSegments(geometryCube, new THREE.LineBasicMaterial({ color: foreground, linewidth: 1 }));
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
    if(background != "transparent")
        renderer.setClearColor(background);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(WIDTH, HEIGHT);
    
    container.appendChild(renderer.domElement);

    stats = new Stats();
    
    container.appendChild(stats.dom);

    //controls
    var initControls = function(){
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.minAzimuthAngle = -Math.PI / 2;
        controls.maxAzimuthAngle = Math.PI / 2;
        controls.addEventListener('end', orbitcheck);
        controls.addEventListener('change', moved);
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.update();
    };
    initControls();

    onWindowResize();

    window.addEventListener('resize', onWindowResize, false);
    animate();
    container.style.opacity = 1;
    $("#cubeloader_wrap").animate("opacity",0,400,function(){$("#cubeloader_wrap").remove();});

    //settings
    $(".switch > input").change(function() {
    if(this.checked) {
        this.parentElement.nextElementSibling.style.color="#002F55";
    }
    else
    {
        this.parentElement.nextElementSibling.style.color="#7f7f7f";
    }});
    //TODO simplify and have only one function for both events
    $("#settings-icon").on("click", function(){ sidebtnclick("#settings-flyout","#settings-icon"); });
    $("#help-icon").on("click", function(){ sidebtnclick("#help-flyout"); });
    var sidebtnclick = function(flyout, icon=undefined){
        var flyout = $(flyout);
        if(flyout.css("visibility") == "visible"){
            if(icon!==undefined)$(icon).css({transform:"rotate(90deg)"});
            flyout.css({transition : 'ease-in .2s'});
            flyout.css({opacity: 0, transform:"translateX(12px) scaleY(0.9)", visibility:"hidden"});
            flyout_hidden = true;
            if(flyout == $("#settings-icon")) $("#tutorial_move").attr("src", "");
        }
        else{
            if(icon!==undefined)$(icon).css({transform:"rotate(0deg)"});
            flyout.css({transition : 'ease-out .2s'});
            flyout.css({opacity: 1, transform:"translateX(0px) scaleY(1)", visibility:"visible"});
            flyout_hidden = false;
            if(flyout == $("#settings-icon")) $("#tutorial_move").attr("src", "/mp4/tutorial_move.mp4");
        }
    };
    $("#projbtn_o").on("click",function(){
        $("#projbtn_o").attr('class', 'projpick-select'); $("#projbtn_p").attr('class', 'projpick-unselect');
        camera.zoom = 1.75;
        camera.toOrthographic();
    });
    $("#projbtn_p").on("click",function(){
        camera.zoom = 1;
        camera.toPerspective();
        $("#projbtn_p").attr('class', 'projpick-select'); $("#projbtn_o").attr('class', 'projpick-unselect');
    });
}
