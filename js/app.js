//グローバル
var mesh, camera, scene, renderer, control;
var helper;
var ready = false;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var clock = new THREE.Clock(false);
var delta;
var musicPlanes = [];
var musicIdx = [];
var walls = [];
var wallIdx = [];
var max_wall = [];
var i, a, h, max_h;
var cTime;
var roofs = [];
var roofCenter;
var comments = {};
var comments3D = {};
var loader = new THREE.FontLoader();
var font;
var song_id, songle_url, comment_data, comment_url, vmd_path, latency, nico_url;
var song_info = {
    "umiyuri":{"songle_url":"piapro.jp/t/5BXQ/20140224203011", 
        "nico_url":"sm22960446", 
        "comment_data":'<packet><thread thread="1393236346" version="20090904" res_from="-1000"/></packet>', 
        "comment_url":"http://msg.nicovideo.jp/25/api/", 
        "vmd_path":"models/vmd/umiyuri.vmd", 
        "latency":-300}, 
    "torinoko":{"songle_url":"piapro.jp/t/Eywb/20100804205216", 
        "nico_url":"sm11559163", 
        "comment_data":'<packet><thread thread="1280404533" version="20090904" res_from="-1000"/></packet>', 
        "comment_url":"http://msg.nicovideo.jp/14/api/", 
        "vmd_path":"models/vmd/torinoko.vmd", 
        "latency":-200}, 
    "clock_lock":{"songle_url":"piapro.jp/t/JpQ4/20091130003920", 
        "nico_url":"sm8933166", 
        "comment_data":'<packet><thread thread="1259323370" version="20090904" res_from="-1000"/></packet>', 
        "comment_url":"http://msg.nicovideo.jp/6/api/", 
        "vmd_path":"models/vmd/clock_lock.vmd", 
        "latency":-200}, 
    "fromytoy":{"songle_url":"piapro.jp/t/eECL/20090325180324", 
        "nico_url":"sm6529016", 
        "comment_data":'<packet><thread thread="1237844600" version="20090904" res_from="-1000"/></packet>', 
        "comment_url":"http://msg.nicovideo.jp/33/api/", 
        "vmd_path":"models/vmd/fromytoy.vmd", 
        "latency":-1300}, 
    "glow":{"songle_url":"piapro.jp/t/lcNu/20100628231225", 
        "nico_url":"sm11209477", 
        "comment_data":'<packet><thread thread="1277652167" version="20090904" res_from="-1000"/></packet>', 
        "comment_url":"http://msg.nicovideo.jp/50/api/", 
        "vmd_path":"models/vmd/glow.vmd", 
        "latency":1100},
    "karakuri":{"songle_url":"piapro.jp/t/nmoi/20110807213625", 
        "nico_url":"sm15022913", 
        "comment_data":'<packet><thread thread="1310727716" version="20090904" res_from="-1000"/></packet>', 
        "comment_url":"http://msg.nicovideo.jp/24/api/", 
        "vmd_path":"models/vmd/karakuri.vmd", 
        "latency":-300}, 
    "lover":{"songle_url":"piapro.jp/t/NXYR/20090901061115", 
        "nico_url":"sm8082467", 
        "comment_data":'<packet><thread thread="1251579370" version="20090904" res_from="-1000"/></packet>', 
        "comment_url":"http://msg.nicovideo.jp/28/api/", 
        "vmd_path":"models/vmd/lover.vmd", 
        "latency":-100}, 
    "snow_white":{"songle_url":"piapro.jp/t/F80E/20100225230021", 
        "nico_url":"sm9797269", 
        "comment_data":'<packet><thread thread="1266782945" version="20090904" res_from="-1000"/></packet>', 
        "comment_url":"http://msg.nicovideo.jp/11/api/", 
        "vmd_path":"models/vmd/snow_white.vmd", 
        "latency":-300}, 
    "soar":{"songle_url":"piapro.jp/t/cjYw/20080324002544", 
        "nico_url":"sm2700265", 
        "comment_data":'<packet><thread thread="1205868103" version="20090904" res_from="-1000"/></packet>', 
        "comment_url":"http://msg.nicovideo.jp/51/api/", 
        "vmd_path":"models/vmd/soar.vmd", 
        "latency":-200}
};


// 便利関数
var _ua = (function(u){
    return {
        Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1) 
            || u.indexOf("ipad") != -1
            || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
            || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
            || u.indexOf("kindle") != -1
            || u.indexOf("silk") != -1
            || u.indexOf("playbook") != -1, 
        Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
            || u.indexOf("iphone") != -1
            || u.indexOf("ipod") != -1
            || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
            || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
            || u.indexOf("blackberry") != -1
    }
})(window.navigator.userAgent.toLowerCase());
if (_ua.Mobile || _ua.Tablet){
    $("#param_acc").prop('checked', true);
}
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length,  min = i - size,  temp,  index;
    while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(min);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function loadScript(src, callback) {
    var done = false;
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = src;
    head.appendChild(script);
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
        if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
            done = true;
            callback();
            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
            if ( head && script.parentNode ) {
                head.removeChild( script );
            }
        }
    };
}

// 楽曲設定
$(document).on("click", "#mmd_set_button.off", function(){
    $("#mmd_set_list").slideDown("fast");
    $(this).removeClass("off").addClass("on");
    $("#setting_list").slideUp("fast");
    $("#copyright_list").slideUp("fast");
    $("#setting_button").removeClass("on").addClass("off")
    $("#copyright_button").removeClass("on").addClass("off")
    $("#mmd_set").css("z-index", "3");
    $("#param").css("z-index", "0");
    $("#copyright").css("z-index", "0");
});
$(document).on("click", "#mmd_set_button.on", function(){
    $("#mmd_set_list").slideUp("fast", function() {
        $("#copyright").css("z-index", "3")
        $("#param").css("z-index", "2")
        $("#mmd_set").css("z-index", "1")
    });
    $(this).removeClass("on").addClass("off");
});
$(document).on("click", ".mmd_set_elm", function(){
    $(".mmd_set_elm.select").removeClass("select");
    song_id = $(this).attr("id");
    $(this).addClass("select");
});

//クレジット設定
$(document).on("click", "#copyright_button.off", function(){
    $("#copyright_list").slideDown("fast");
    $(this).removeClass("off").addClass("on");
    $("#setting_list").slideUp("fast");
    $("#mmd_set_list").slideUp("fast");
    $("#setting_button").removeClass("on").addClass("off")
    $("#mmd_set_button").removeClass("on").addClass("off")
    $("#copyright").css("z-index", "3");
    $("#mmd_set").css("z-index", "0");
    $("#param").css("z-index", "0");
});
$(document).on("click", "#copyright_button.on", function(){
    $("#copyright_list").slideUp("fast", function() {
        $("#copyright").css("z-index", "3")
        $("#param").css("z-index", "2")
        $("#mmd_set").css("z-index", "1")
    });
    $(this).removeClass("on").addClass("off");
});

// パラメータ設定
$(document).on("click", "#setting_button.off", function(){
    $("#setting_list").slideDown("fast");
    $(this).removeClass("off").addClass("on");
    $("#copyright_list").slideUp("fast");
    $("#mmd_set_list").slideUp("fast");
    $("#copyright_button").removeClass("on").addClass("off")
    $("#mmd_set_button").removeClass("on").addClass("off")
    $("#param").css("z-index", "3");
    $("#copyright").css("z-index", "0");
    $("#mmd_set").css("z-index", "0");
});
$(document).on("click", "#setting_button.on", function(){
    $("#setting_list").slideUp("fast", function() {
        $("#copyright").css("z-index", "3")
        $("#param").css("z-index", "2")
        $("#mmd_set").css("z-index", "1")
    });
    $(this).removeClass("on").addClass("off");
});



var param_acc = false;
var param_stereo = false;
var param_songle = false;
var param_comment = false;
var param_shade = false;
var param_phisic = false;
var param_anti = false;
var param_kyaku = false;
$(document).on("click", "#start_button", function(){
    if($("#param_acc:checked").val()){
        param_acc = true;
    }
    if($("#param_stereo:checked").val()){
        param_stereo = true;
    }
    if($("#param_kyaku:checked").val()){
        param_kyaku = true;
    }
    if($("#param_songle:checked").val()){
        param_songle = true;
    }
    if($("#param_comment:checked").val()){
        param_comment = true;
    }
    if($("#param_shade:checked").val()){
        param_shade = true;
    }
    if($("#param_phisic:checked").val()){
        param_phisic = true;
    }
    if($("#param_anti:checked").val()){
        param_anti = true;
    }
    var sinfo = song_info[$(".mmd_set_elm.select").attr("id")];
    songle_url = sinfo["songle_url"];
    comment_data = sinfo["comment_data"];
    comment_url = sinfo["comment_url"];
    vmd_path = sinfo["vmd_path"];
    latency = sinfo["latency"];
    nico_url = sinfo["nico_url"];
    start_MMD();
});

function start_MMD(){
    $("#load").fadeIn("fast", function(){
        $("#top").css("display", "none");
    });
    // スタート画面
    var element = SongleWidgetAPI.createSongleWidgetElement({
        api: "songle-widget-api-example",           
        url: songle_url, 
        songVolume: 0, 
        songleWidgetSizeW: "auto", 
        songAutoPlay: false,                         
        songAutoLoop: false                         
    });
    document.getElementById('songle_div').appendChild(element);
    // 壁の最上ノートを決める．
    for (a=0; a<17; a++){
        max_h = getRandomInt(6, 22);
        max_wall[a] = max_h;
    }

    //コメント
    if (param_comment == true){
        var chorus_span = [];
        $.when(
            $.ajax({
                type:'GET',
                url: "https://widget.songle.jp/api/v1/song/chorus.json?url=" + songle_url,
                dataType: 'json', 
                success: function(json){
                    for (var i=0;i<json["chorusSegments"].length;i++){
                        for(var j in json["chorusSegments"][i]["repeats"]){
                            var start = (json["chorusSegments"][i]["repeats"][j]["start"]/10)-100;
                            var end = (start+json["chorusSegments"][i]["repeats"][j]["duration"]/10)+100;
                            chorus_span.push({"start":start, "end":end});
                        }
                        break;
                    }
                },
                error: function(){}
            })
        ).done(function() {
            $.ajax({
                type:'POST',
                url: comment_url,
                data: comment_data,
                dataType: 'xml', 
                success: function(xml){
                    $("#load_message").text("コメント取得中");
                    $(xml).find("chat").each(function() {
                        var comment = $(this).text(); //コメントを表示
                        var t = parseInt($(this).attr('vpos')); //vpos(発言時刻)を表示
                        for (var i in chorus_span){
                            if (chorus_span[i]["start"] <= t && t <= chorus_span[i]["end"]){
                                if (comment != ""){
                                    comments[t] = comment;
                                }
                            }
                        }
                    });
                    loader.load( 'js/07YasashisaGothic_Regular.js',  function ( response ) {
                        $("#load_message").text("フォントデータ読み込み中");
                        font = response;
                        init();
                        animate();
                    });
                },
                error: function(){
                }
            });
        });
    }else{
        init();
        animate();
    }
}


var lightCubeMaterial, spotLightbeamMaterial, lightTbeamMaterialG, lightTbeamMaterialW, lightCubeTMaterialG, lightCubeTMaterialW;

function init(){
    // シーン
    scene = new THREE.Scene();
    // 環境光 平行光
    var ambient = new THREE.AmbientLight( 0x666666 );
    scene.add( ambient );
    var directionalLightA = new THREE.DirectionalLight( 0x908580, 0.6 );
    directionalLightA.position.set( -50,  15,  30 );
    scene.add( directionalLightA );
    var directionalLightB = new THREE.DirectionalLight( 0x908580, 0.6 );
    directionalLightB.position.set( 50,  15,  30 );
    scene.add( directionalLightB );
    // スポットライト
    var lightCubeGeometory = new THREE.SphereGeometry(1);
    lightCubeMaterial = new THREE.MeshBasicMaterial({color: "white"});                  // TODO グローバル
    var lightGeometory = new THREE.CylinderGeometry(1.2, 1, 2, 8, 1, true);
    var lightMaterial = new THREE.MeshBasicMaterial({color: "black", side:THREE.DoubleSide});
    var spotLightbeamGeometory = new THREE.CylinderGeometry(0.8, 8, 130, 32, 1, true);
    spotLightbeamMaterial = new THREE.MeshBasicMaterial({color: "#86cecb", transparent:true, opacity:0.05, depthWrite:false});              //TODO グローバル
    var spotLightbeam = new THREE.Mesh(spotLightbeamGeometory, spotLightbeamMaterial);
    spotLightbeam.position.set(5, 3, -1.8);
    spotLightbeam.rotation.z = 100*Math.PI/180;
    spotLightbeam.rotation.y = 30*Math.PI/180;
    scene.add(spotLightbeam);
    var spotLightbeam = new THREE.Mesh(spotLightbeamGeometory, spotLightbeamMaterial);
    spotLightbeam.position.set(-5, 3, -1.8);
    spotLightbeam.rotation.z = 100*Math.PI/180;
    spotLightbeam.rotation.y = -210*Math.PI/180;
    scene.add(spotLightbeam);
    // スポットライトA
    var lightCube_objectA = new THREE.Mesh(lightCubeGeometory, lightCubeMaterial);
    lightCube_objectA.position.set(-50.3, -8.5, 30.3);
    scene.add(lightCube_objectA);
    var light_objectA = new THREE.Mesh(lightGeometory, lightMaterial);
    light_objectA.position.set(-50.3, -8.5, 30.3);
    light_objectA.rotation.x = -2*Math.PI/5;
    light_objectA.rotation.z = -3*Math.PI/10;
    scene.add(light_objectA);
    var spotlightA = new THREE.SpotLight("#86cecb", 5, 50, Math.PI/4, 5);
    spotlightA.position.set(-50, -8.5, 30);
    spotlightA.target.position = new THREE.Vector3(0, 0, 0); 
    scene.add(spotlightA);
    // スポットライトB
    var lightCube_objectB = new THREE.Mesh(lightCubeGeometory, lightCubeMaterial);
    lightCube_objectB.position.set(50.3, -8.5, 30.3);
    scene.add(lightCube_objectB);
    var light_objectB = new THREE.Mesh(lightGeometory, lightMaterial);
    light_objectB.position.set(50.3, -8.5, 30.3);
    light_objectB.rotation.x = -2*Math.PI/5;
    light_objectB.rotation.z = 3*Math.PI/10;
    scene.add(light_objectB);
    var spotlightB = new THREE.SpotLight("#86cecb", 5, 50, Math.PI/4, 5);
    spotlightB.position.set(50, -8.5, 30);
    spotlightB.target.position = new THREE.Vector3(0, 0, 0); 
    scene.add(spotlightB);
    // WebGLレンダラ
    if (param_anti == true){
        renderer = new THREE.WebGLRenderer({ antialias:true });
    }else{
        renderer = new THREE.WebGLRenderer();
    }
    renderer.setClearColor("black");
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.zIndex = 2;
    renderer.domElement.style.top = 0;
    document.getElementById('mmd').appendChild(renderer.domElement);
    // 影の設定 （重いので切る）
    if (param_shade == true){
        renderer.shadowMap.enabled = true;
        directionalLightA.castShadow = true;
        directionalLightA.shadow.mapSize.x = 500;
        directionalLightA.shadow.mapSize.y = 500;
        directionalLightA.shadow.camera.right = 20;
        directionalLightA.shadow.camera.top = 20;
        directionalLightA.shadow.camera.left = -20;
        directionalLightA.shadow.camera.bottom = -20;

        directionalLightB.castShadow = true;
        directionalLightB.shadow.mapSize.x = 500;
        directionalLightB.shadow.mapSize.y = 500;
        directionalLightB.shadow.camera.right = 20;
        directionalLightB.shadow.camera.top = 20;
        directionalLightB.shadow.camera.left = -20;
        directionalLightB.shadow.camera.bottom = -20;
        renderer.shadowMap.cullFace = THREE.CullFaceNone;
        directionalLightA.shadow.bias = -0.01;
        directionalLightB.shadow.bias = -0.01;
    }
    // カメラ
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 50;
    camera.position.y = -1;
    // コントロール
    if (param_acc){
        control = new THREE.DeviceOrientationControls(camera, renderer.domElement);     //加速度
    }else{
        control = new THREE.OrbitControls(camera, renderer.domElement);       // マウス
        control.minDistance = 8;
        control.maxDistance = 80;
        control.maxPolarAngle = 11*Math.PI/20;
    }
    // 床（音楽とあわせる）
    var musicGeometry = new THREE.BoxGeometry(5.2, 5.2, 0.1);
    var idx = 0;
    for (var i=0; i<20; i++){
        for (var j=0; j<10; j++){
            var musicMaterial = new THREE.MeshLambertMaterial({color: "white"});
            musicPlanes[idx] = new THREE.Mesh(musicGeometry, musicMaterial);
            musicPlanes[idx].position.set(-53+5.6*i, -10.15, -20+5.6*j);
            musicPlanes[idx].rotation.x = 90 * Math.PI / 180;
            musicPlanes[idx].receiveShadow = true;
            scene.add(musicPlanes[idx]);
            musicIdx.push(idx);
            idx++;
        }
    }
    //ステージ土台
    var baseGeometry = new THREE.CubeGeometry(113, 10, 57);
    var baseMaterial = new THREE.MeshLambertMaterial({color: "#181818", side:THREE.DoubleSide});
    var base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.set(0, -15.2, 5); // totate,  scale
    scene.add(base);
    //ステージ奥
    var hallOGeometry = new THREE.PlaneGeometry(130, 50);
    var hallOtexture = THREE.ImageUtils.loadTexture('img/wall_out.png');
    var hallOMaterial = new THREE.MeshLambertMaterial({map:hallOtexture, transparent:true});
    var hallO = new THREE.Mesh(hallOGeometry, hallOMaterial);
    hallO.position.set(0, 4.8, -25);
    scene.add(hallO);

    //観客入り口
    var hallIGeometry = new THREE.PlaneGeometry(130, 50);
    var hallItexture = THREE.ImageUtils.loadTexture('img/wall_in.png');
    var hallIMaterial = new THREE.MeshLambertMaterial({map:hallItexture});
    var hallI = new THREE.Mesh(hallIGeometry, hallIMaterial);
    hallI.position.set(0, 4.8, 65);
    hallI.rotation.y = Math.PI;
    scene.add(hallI);

    var doorGeometry = new THREE.PlaneGeometry(20, 25);
    var doortexture = THREE.ImageUtils.loadTexture('img/door.png');
    var doorMaterial = new THREE.MeshLambertMaterial({map: doortexture});
    var door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(-35, -8, 64.8); // totate,  scale
    door.rotation.y = Math.PI;
    scene.add(door);
    var door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(35, -8, 64.8); // totate,  scale
    door.rotation.y = Math.PI;
    scene.add(door);

    //観客壁
    var hallLGeometry = new THREE.PlaneGeometry(90, 50);
    var halltexture = THREE.ImageUtils.loadTexture('img/wall.png');
    var hallLMaterial = new THREE.MeshLambertMaterial({map:halltexture});
    var hallL = new THREE.Mesh(hallLGeometry, hallLMaterial);
    hallL.position.set(-65, 4.8, 20);
    hallL.rotation.y = Math.PI/2;
    scene.add(hallL);
    var hallR = new THREE.Mesh(hallLGeometry, hallLMaterial);
    hallR.position.set(65, 4.8, 20);
    hallR.rotation.y = -Math.PI/2;
    scene.add(hallR);
    //観客天井
    var hallTGeometry = new THREE.PlaneGeometry(130, 90);
    var hallTMaterial = new THREE.MeshLambertMaterial({color: "#2b2b2b"});
    var hallT = new THREE.Mesh(hallTGeometry, hallTMaterial);
    hallT.position.set(0, 29.83, 20);
    hallT.rotation.x = Math.PI/2;
    scene.add(hallT);
    //観客床
    var hallFGeometry = new THREE.PlaneGeometry(130, 90);
    var hallFtexture = THREE.ImageUtils.loadTexture('img/floor.png');
    var hallFMaterial = new THREE.MeshLambertMaterial({map:hallFtexture, side:THREE.DoubleSide});
    var hallF = new THREE.Mesh(hallFGeometry, hallFMaterial);
    hallF.position.set(0, -20.2, 20);
    hallF.rotation.x = Math.PI/2;
    scene.add(hallF);
    //柵
    var path = new THREE.SplineCurve3([
        new THREE.Vector3(-5, 0, 0), 
        new THREE.Vector3(-5, 5, 0), 
        new THREE.Vector3(-5, 6, 0), 
        new THREE.Vector3(0, 6, 0), 
        new THREE.Vector3(5, 6, 0), 
        new THREE.Vector3(5, 5, 0), 
        new THREE.Vector3(5, 0, 0), 
    ]);
    var tubeGeo = new THREE.TubeGeometry(path, 10, 0.5, 8);
    var tubeMat = new THREE.MeshLambertMaterial({ color: "#3c3c3c"});
    for (var i=0;i<10;i++){
        var tube = new THREE.Mesh(tubeGeo, tubeMat);
        tube.position.set(-55+i*12, -20, 40);
        scene.add( tube );
    }
    // 天井ライトのパイプ
    var lightPipeGeometory = new THREE.CylinderGeometry(0.5, 0.5, 130, 12, 1, true);
    var lightPipeMaterial = new THREE.MeshBasicMaterial({color: "#4e4e4e", side:THREE.DoubleSide});
    var pipe = new THREE.Mesh(lightPipeGeometory, lightPipeMaterial);
    pipe.position.set(0, 27.8, -4);
    pipe.rotation.z = Math.PI/2;
    scene.add(pipe);
    var lightjointGeometory = new THREE.CylinderGeometry(0.5, 0.5, 3, 12, 1, true);
    // 天井ライト
    var lightTGeometory = new THREE.CylinderGeometry(1.8, 2, 6, 32, 1, true);
    var lightTbeamGeometory = new THREE.CylinderGeometry(1.7, 9, 90, 32, 1, true);
    lightTbeamMaterialG = new THREE.MeshBasicMaterial({color: "#86cecb", transparent:true, opacity:0.05, depthWrite:false});           //TODO グローバル
    lightTbeamMaterialW = new THREE.MeshBasicMaterial({color: "white", transparent:true, opacity:0.05, depthWrite:false});             //TODO グローバル
    var lightTMaterial = new THREE.MeshBasicMaterial({color: "black", side:THREE.DoubleSide});
    var lightCubeTGeometory = new THREE.SphereGeometry(1.5);
    lightCubeTMaterialG = new THREE.MeshBasicMaterial({color: "#86cecb"});              //TODO グローバル
    lightCubeTMaterialW = new THREE.MeshBasicMaterial({color: "white"});                //TODO グローバル
    for (var i=0;i<3;i++){
        for (var j=0;j<3;j++){
            var lightT = new THREE.Mesh(lightTGeometory, lightTMaterial);
            var joint = new THREE.Mesh(lightjointGeometory, lightPipeMaterial);
            if (i == 1){
                var lightTbeam = new THREE.Mesh(lightTbeamGeometory, lightTbeamMaterialW);
                var lightCT = new THREE.Mesh(lightCubeTGeometory, lightCubeTMaterialW);
            }else{
                var lightTbeam = new THREE.Mesh(lightTbeamGeometory, lightTbeamMaterialG);
                var lightCT = new THREE.Mesh(lightCubeTGeometory, lightCubeTMaterialG);
            }
            joint.position.set(-50+i*10+j*40, 28.5, -4);
            lightT.position.set(-50+i*10+j*40, 25, -5);
            lightT.rotation.y = 45*Math.PI/180;
            lightT.rotation.x = -60*Math.PI/180;
            lightTbeam.position.set(-50+i*10+j*40, 2, 35);
            lightTbeam.rotation.y = 45*Math.PI/180;
            lightTbeam.rotation.x = -60*Math.PI/180;
            scene.add(lightT);
            scene.add(lightTbeam);
            scene.add(joint);
            lightCT.position.set(-50+i*10+j*40, 25, -5);
            scene.add(lightCT);
        }
    }

    // フロントスピーカー
    var f_speakerGeometry = new THREE.CubeGeometry(6, 3, 5);
    var f_speakerMaterial = new THREE.MeshLambertMaterial({color: "#2b2b2b"});
    var fsfGeometry = new THREE.PlaneGeometry(6, 3);
    var fsftexture = THREE.ImageUtils.loadTexture('img/fsf.png');
    var fsfMaterial = new THREE.MeshLambertMaterial({color:"white", map:fsftexture});
    for (var i=0;i<4;i++){
        var f_speaker = new THREE.Mesh(f_speakerGeometry, f_speakerMaterial);
        var fsf = new THREE.Mesh(fsfGeometry, fsfMaterial);
        fsf.position.set(-30+i*20, -8.55, 32);
        fsf.rotation.x = -Math.PI/12
        scene.add(fsf);

        f_speaker.position.set(-30+i*20, -9.2, 29.5);
        f_speaker.rotation.x = -Math.PI/12
        scene.add(f_speaker);
    }
    // サイドスピーカー
    var s_speakerGeometry = new THREE.CubeGeometry(15, 37, 10);
    var s_speakerMaterial = new THREE.MeshLambertMaterial({color: "#2b2b2b"});
    var s_speaker = new THREE.Mesh(s_speakerGeometry, s_speakerMaterial);
    var ssfGeometry = new THREE.PlaneGeometry(15, 37);
    var ssftexture = THREE.ImageUtils.loadTexture('img/ssf.png');
    var ssfMaterial = new THREE.MeshLambertMaterial({color:"white", map:ssftexture});
    var ssf = new THREE.Mesh(ssfGeometry, ssfMaterial);
    s_speaker.position.set(-44, 8.5, -16);
    s_speaker.rotation.y = Math.PI/20;
    ssf.position.set(-43.3, 8.5, -10.9);
    ssf.rotation.y = Math.PI/20;
    scene.add(s_speaker);
    scene.add(ssf);
    var s_speaker = new THREE.Mesh(s_speakerGeometry, s_speakerMaterial);
    var ssf = new THREE.Mesh(ssfGeometry, ssfMaterial);
    s_speaker.position.set(44, 8.5, -16);
    s_speaker.rotation.y = -Math.PI/20;
    ssf.position.set(+43.3, 8.5, -10.9);
    ssf.rotation.y = -Math.PI/20;
    scene.add(s_speaker);
    scene.add(ssf);

    //壁（音楽と合わせる）
    var r = 55;
    var wallGeometry = new THREE.PlaneGeometry(3, 1);
    for (var a=0; a<17; a++){
        walls[a] = [];
        for (var h=0;h<22;h++){
            var wallMaterial = new THREE.MeshLambertMaterial({color: "hsl(183, 74%, " + (29 + (3*h)) + "%)"});
            if (h < max_wall[a]){
                var wall = new THREE.Mesh(wallGeometry,  wallMaterial);
            }else{
                var wall = new THREE.Mesh(wallGeometry,  wallMaterial);
                wall.scale.x = 0.15;
                wall.scale.y = 0.5;
            }
            var rad = 2*Math.PI*a/100;
            wall.position.set(-32+a*4, 1.4*h-6.5, -25);
            walls[a][h] = wall
            scene.add(walls[a][h]);
        }
    }

    // skydome
    var sky_geometry = new THREE.SphereGeometry(200, 60, 40);  
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load( "img/sky.jpg" );
    var sky_material = new THREE.MeshBasicMaterial({map:texture});
    skyBox = new THREE.Mesh(sky_geometry, sky_material);  
    skyBox.scale.set(-1, 1, 1);  
    skyBox.rotation.z = 45 * Math.PI / 180;
    skyBox.rotation.y = 45 * Math.PI / 180;
    scene.add(skyBox);  

    //コメント  (重い)再生とともにレンダリングは無理なので予め数百個のコメントをレンダリングして置く（何か工夫できるかも）
    if (param_comment == true){
        for (cTime in comments){
            var TextMaterial = new THREE.MeshLambertMaterial( { color: "white"} );
            var TextGeometry = new THREE.TextGeometry(comments[cTime],  {
                size: 2,  height: 0.2,  curveSegments: 3, 
                font: font,  weight: "regular",
            });
            var c = Math.floor((parseInt(cTime) - 300)/10)*10;
            comments3D[c] = new THREE.Mesh( TextGeometry,  TextMaterial );
            comments3D[c].position.set(55, 2*getRandomInt(0, 10)-5, -2.5*getRandomInt(0, 10)+15);
            comments3D[c].material.visible  = false;
            scene.add( comments3D[c] );
        }
    }
    // MMDモデル
    var onProgress = function ( xhr ) {
        if ( xhr.lengthComputable ) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            console.log( Math.round(percentComplete, 2) + '% downloaded' );
            $("#load_message").text("MMDモデル読み込み中");
        }
    };
    var onError = function ( xhr ) {
    };
    var modelFile = 'models/pmd/lat/index.pmd';
    var vmdFiles = [ vmd_path ];
    if (param_stereo == true){
        helper = new THREE.MMDHelper(renderer, true);
    }else{
        helper = new THREE.MMDHelper(renderer, false);
    }
    var loader = new THREE.MMDLoader();

    loader.load( modelFile, vmdFiles, function ( object ) {
        mesh = object;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.y = -10.2;
        helper.add( mesh );
        helper.setAnimation( mesh );
        helper.setCamera( camera );
        if (param_phisic == true){
            helper.setPhysics( mesh );    //物理エンジンの有無
        }
        helper.unifyAnimationDuration( { afterglow: 2.0 } );
        scene.add( mesh );
        ready = true;
    }, onProgress, onError );

       
    // 観客
    if (param_kyaku == true){
        var idxs = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5];
        var a = 0;
        for (i=0; i<10; i++){
            loader.load( "models/pmd/kyaku/kyaku.pmd", ["models/vmd/kyaku/kyaku" + idxs[i] + ".vmd"], function ( object ) {
                if (a == 5){
                    a += 1;
                }
                object.position.set(-50+10*a, -20.2, 50);
                object.rotation.y = Math.PI;
                helper.add(object);
                helper.setAnimation(object);
                scene.add(object);
                a += 1;
            }, onProgress, onError );
        }
    }

    window.addEventListener( 'resize', onWindowResize, false );
};

function animate(){
    requestAnimationFrame(animate);
    render();
};


var comment_durations = [];
var delta = 0.0;
var renf = false;
var latency_f = false;
function render() {
    if (ready) {
        delta = clock.getDelta();
        skyBox.rotation.y -= 0.0005;
        skyBox.rotation.x += 0.0005;
        helper.animate( delta );
        helper.render( scene, camera );
        if (param_acc == true){
            control.connect();
        }
        control.update();
        if (param_songle == true){
            if (_ua.Mobile || _ua.Tablet){
            }else{
                down_wall();
            }
        }
        if (param_comment == true){
            if (SW && clock.running){
                cTime = Math.floor(SW.position.milliseconds/100)*10;
                if (comments3D[cTime]){
                    comment_durations.push(cTime);
                }
                for (var cT in comment_durations){
                    comments3D[comment_durations[cT]].position.x -= 0.1;
                    comments3D[comment_durations[cT]].material.visible = true;
                }
                if (comment_durations.length != 0){
                    if (comments3D[comment_durations[0]].position.x < -250){
                        comments3D[comment_durations[0]].material.visible = false;
                        comment_durations.shift();
                    }
                }
            }
        }
        $("#load_message").text("完了(再生ボタンを押してね)");
        if (renf == false){
            $("#footer").css("z-index", "10");
            renf = true;
        }
    } else {
        renderer.clear();
        helper.render( scene, camera );
    }
}

var step = 0;
function down_wall(){       // 壁の各最上ノートを黒にする
    for (a=0; a<17; a++){
        max_h = max_wall[a];
        walls[a][max_h].scale.x = 0.15;
        walls[a][max_h].scale.y = 0.5;
        if (step == 0){
            if (max_h > 1){
                max_wall[a] = max_h-1;
            }
            step = 1;
        }else if(step == 1){
            step = 2;
        }else{
            step = 0;
        }
    }
}


function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight);
}

$(document).on("click", "#reload_button", function(){
    window.location.reload();
});

var floor_color = 0xffffff;
var sampleIdx = [];
var hue, pastel;
var SW;
var start_flag = false;
var chorus_flag = false;
window.onSongleWidgetReady = function(apiKey, songleWidget){
    SW = songleWidget;
    if (latency >= 0){
        songleWidget.seekTo(latency);
    }
    songleWidget.on("play", function(e){
        $("#load").fadeOut("fast");
        start_flag = true;
        $('#songle_div').animate({'top': '+=56px'});
    });
    songleWidget.on("playingProgress", function(e){
        if (start_flag == true){
            start_flag = false;
            clock.start();
            if (latency < 0){
                setTimeout(function(){
                    songleWidget.seekTo(0);
                    songleWidget.volume = 100;
                }, -1*latency);
            }else{
                songleWidget.volume = 1;
            }
        }
    });
    songleWidget.on("pause", function(e){
        clock.stop();
        $('#songle_div').animate({'top': '-=56px'});
    });
    songleWidget.on("finish", function(e){
        clock.stop();
        $('#songle_div').animate({'top': '-=56px'});
        $('<iframe/>').attr('src', 'http://ext.nicovideo.jp/thumb/' + nico_url)
        .css("height", "200px")
        .css("width", "300px")
        .append($("<a/>").attr("href", 'http://www.nicovideo.jp/watch/' + nico_url))
        .appendTo("#nico_label");
        $("#end_panel").fadeIn("slow");
    });

    if (param_songle == true){
        songleWidget.on("chordPlay", function(e){
            hue = Math.floor(Math.random() * 360);
            pastel = "hsl(" + hue + ", 100%, 87%)";
            floor_color = new THREE.Color(pastel);
            for (i=0; i<sampleIdx.length; i++){
                musicPlanes[sampleIdx[i]].material.color.setHex(0xffffff);
            }
            sampleIdx = getRandomSubarray(musicIdx, 80);
            for (i=0; i<sampleIdx.length; i++){
                musicPlanes[sampleIdx[i]].material.color.set(floor_color);
            }
        });

        songleWidget.on("chorusEnter", function(e){
            for (a=0; a<17; a++){
                for (h=0;h<22;h++){
                    walls[a][h].material.color.set("hsl(330, 76%, " + (52 + h) + "%)");
                }
            }
            lightCubeMaterial.color.set("rgb(225, 40, 133)");
            spotLightbeamMaterial.color.set("rgb(225, 40, 133)");
            lightTbeamMaterialG.color.set("rgb(225, 40, 133)");
            lightTbeamMaterialW.color.set("rgb(225, 40, 133)");
            lightCubeTMaterialG.color.set("rgb(225, 40, 133)");
            lightCubeTMaterialW.color.set("rgb(225, 40, 133)");
            setTimeout(function(){
                chorus_flag = true;
            }, 1000);
        });
        songleWidget.on("chorusLeave", function(e){
            if (chorus_flag == true){
                for (a=0; a<17; a++){
                    for (h=0;h<22;h++){
                        walls[a][h].material.color.set("hsl(183, 74%, " + (29 + (3*h)) + "%)");
                    }
                }
                lightCubeMaterial.color.set("rgb(255, 255, 255)");
                spotLightbeamMaterial.color.set("rgb(134, 206, 203)");
                lightTbeamMaterialG.color.set("rgb(134, 206, 203)");
                lightTbeamMaterialW.color.set("rgb(255, 255, 255)");
                lightCubeTMaterialG.color.set("rgb(134, 206, 203)");
                lightCubeTMaterialW.color.set("rgb(255, 255, 255)");
                chorus_flag = false;
            }
        });
        if (_ua.Mobile || _ua.Tablet){
        }else{
            songleWidget.on("beatPlay", function(e){
                for (a=0; a<17; a++){
                    max_h = getRandomInt(6, 22);
                    max_wall[a] = max_h;
                    for (h=0;h<22;h++){
                        if (h < max_h){
                            walls[a][h].scale.x = 1;
                            walls[a][h].scale.y = 1;
                        }else{
                            walls[a][h].scale.x = 0.15;
                            walls[a][h].scale.y = 0.5;
                        }
                    }
                }
            });
        }
    }
}
