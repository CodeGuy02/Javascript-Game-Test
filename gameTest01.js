
function first() {

playField = document.getElementById("playField");
controlField = document.getElementById("controlField");

w = playField.clientWidth;
l = playField.clientHeight;
//controlField.innerHTML = "Width: " + w + " Length: " + l;

playFieldCanvas = document.getElementById("playFieldCanvas");

// initialize kaboom context
const k = kaboom({
    width:w,
    height:l,
    canvas:playFieldCanvas,
});

k.loadRoot("https://game-project-demo-01.s3.us-east.cloud-object-storage.appdomain.cloud/");
k.loadSprite("sky", "background_glacial_mountains.png");
k.loadSprite("apple", "tomato.png");
k.loadSprite("cloud_lonely", "cloud_lonely.png");
k.loadSprite("snow_01", "clouds_mg_1.png");

// define a scene
k.scene("main", () => {

    // draw background on the bottom, ui on top, layer "obj" is default
    k.layers([
        "bg",
        "obj",
        "ui",
    ], "obj");

    //const c = rgba(0, 191, 255); // sky blue
    const obj = k.add([
        //k.rect(k.width, k.height),
        k.rect(w,l),
        k.pos(0, 0),
        k.color(0, 0.74, 1),
        k.layer("bg"),
    ]);

    /*
    const icyWater = k.add([
        //k.rect(k.width, k.height),
        k.rect(w,l),
        k.pos(0, (l*0.5)),
        k.color(0.2, 0.43, 0.89),
        k.layer("bg"),
    ]);
    */

    const numWaterLayers = 5;
    const waterLayers = Array(numWaterLayers);
    console.log('starting waterLayers ' + waterLayers);
    //const startingColor = [0.22, 0.33, 0.99];
    const startingColor = [0.2, 0.6, 0.9];
    var colorPositionY = 0;
    console.log('starting colors:' + startingColor);
    const startingWaterLinePos = (l*0.5);  // half screen length
    //const gradientColor =  (startingWaterLinePos) => {
        //console.log('arrow function called');
        for (i=0; i < numWaterLayers; i++) {
            if (i == 0) {
                console.log("layer 1 colors are:" + startingColor);
                colorPositionY = l*0.5;
                console.log("colorPositionY = " + colorPositionY);
                red = startingColor[0];
                green = startingColor[1];
                blue = startingColor[2];
                waterLayers[0] = k.add([
                    k.rect(w,l),
                    k.pos(0, colorPositionY),
                    k.color(red, green, blue),
                    k.layer("bg"),
                ]);
            }
            if (i != 0) {
                red = startingColor[0] - (i*(1/40));    //subtract for darker tones
                green = startingColor[1] - (i*(1/40));
                blue = startingColor[2] - (i*(1/40));
                colorPositionY = l * 0.5 + (i* (l/10));
                console.log("layer " + (i+1) + " colors are:" + red + " " + green + " " + blue);
                console.log("colorPositionY = " + colorPositionY);
                waterLayers[i] = k.add([
                    k.rect(w,l),
                    k.pos(0, colorPositionY),
                    k.color(red, green, blue),
                    k.layer("bg"),
                ]);
                console.log("");
            }
        }
    //    return waterLayers;
    //}

    console.log("width: " + w);

    const startSkyPosX = w * 1/2;
    const startSkyPosY = l * 1/3;
    //const startSky2PosX = w + (w*1/2);
    const startSky2PosX = startSkyPosX + (384);
    const startSky2PosY = l * 1/3;
    console.log('>> starting SkyPosX: ' + startSkyPosX);
    console.log('>> starting Sky2PosX:' + startSky2PosX);
    // snow embankment:
    const startSnowPosX = w * 1/2;
    const startSnow2PosX = startSnowPosX + (384);

    const sky = k.add([  
        k.sprite("sky"),
        k.scale(1,1),
        k.origin("center"),
        k.layer("bg"),
        k.pos(startSkyPosX, startSkyPosY),
    ]); 
    const sky2 = k.add([
        k.sprite("sky"),
        k.scale(1,1),
        k.origin("center"),
        k.layer("bg"),
        k.pos(startSky2PosX, startSky2PosY),
    ]);
    const cloud_lonely = k.add([
        k.sprite("cloud_lonely"),
        k.scale(1,1),
        k.origin("center"),
        k.layer("bg"),
        k.pos(w*3/4, l*1/6),
    ]);
    const snow_01 = k.add([
        k.sprite("snow_01"),
        k.scale(1,0.9),
        k.origin("center"),
        k.layer("bg"),
        k.pos(startSnowPosX, l*8/10),
    ]);
    const snow_02 = k.add([
        k.sprite("snow_01"),
        k.scale(1,0.9),
        k.origin("center"),
        k.layer("bg"),
        k.pos(startSnow2PosX, l*8/10),
    ]);

    const numApples = 4;
    const appleBasket = Array(numApples);
    const appleDistance = 180;
    // Create our apples:
    console.log('hello?');
    for (i=0; i < numApples; i++) {
        console.log('Adding apple to our basket.');
        startPosY = k.rand(l*1/2, l*8/10);
        appleBasket[i] = k.add([
            k.sprite("apple"),
            k.scale(1.5,1.5),
            k.origin("center"),
            k.layer("obj"),
            k.pos(w + (i*appleDistance), startPosY),
        ]);   
    }
    //k.loadRoot("file:///mountains/")

    k.add([
        k.layer("bg"),
        k.text("Fruit Runner", 18),
        k.color(1,0,0),
        k.pos(70, 10),
    ]);

    // add a text at position (100, 100)
    k.add([
        k.layer("bg"),
        //k.text("READY", 32),
        k.text("Score: 00000", 12),
        k.pos(30, 60),
    ]);

    k.add([
        k.layer("bg"),
        k.text("High Score: 25000", 12),
        k.color(1,0.5,0.3),
        k.pos(30, 40),
    ]);

    //var appleCounter = 0;
    k.loop(0.01, () => {
        //console.log('apple loop');
        for (i=0; i < numApples; i++) {
            appleBasket[i].move(-120,0);
            appleBasket[i].angle += 10;
            if (appleBasket[i].pos.x <= (0)) {
                // reset to starting position
                appleBasket[i].pos.x = w + appleDistance;
                appleBasket[i].pos.y = k.rand(l*1/2, l*8/10);
                console.log('Resetting apple position.');
        }
        }
    });

    /*
    k.wait(3, () => {
        sky.move(-5,0);
    });
    */

    /*
    k.wait(1, () => {
        sky.pos.x = sky.pos.x - 10;
    });
    */

    k.loop(0.01, () => {
        sky.move(-80,0);
        if (sky.pos.x <= (startSkyPosX - 384)) {
            // reset to starting position
            sky.pos.x = startSkyPosX;
            console.log('x position is :' + sky.pos.x);
        }
        sky2.move(-80,0);
        if (sky2.pos.x <= (startSkyPosX)) {
            // reset to starting position
            sky2.pos.x = startSky2PosX;
            console.log('x2 position is :' + sky2.pos.x);
        }
        cloud_lonely.move(-40,0);
        if (cloud_lonely.pos.x <= 0) {
            cloud_lonely.pos.x = w;
        }
        snow_01.move(-160,0);
        if (snow_01.pos.x <= (startSnowPosX - 384)) {
            snow_01.pos.x = startSnowPosX;
        }
        snow_02.move(-160,0);
        if (snow_02.pos.x <= (startSnowPosX)) {
            snow_02.pos.x = startSnow2PosX;
        } 
        //console.log("just like setInterval");
    });

   /*
   k.on("draw", "sky", (e) => {
    sky.pos.x
    */

});

// start the game
k.start("main");

}