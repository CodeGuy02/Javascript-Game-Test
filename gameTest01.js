var gameStarted = false;
var gameOver = false;

var player = null;
var score = 0;

const FLY_FORCE = 400;

function first() {

if (gameStarted) {
    flapForYourLife();
} else {

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
k.loadSprite("player", "SpeckledAngelFish_0001.png");

// define a scene
k.scene("main", () => {

    k.gravity(800);

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


    /*
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
    */

    // Determine how many sky backgrounds are required using clientWidth
    sky = 0;
    numSkiesNeeded = Math.ceil(w / 384) + 2;
    console.log(' ====== skies needed:' + numSkiesNeeded);
    const skies = [];
    lastArrayItemPositionX = 0;

    for (i=0; i < numSkiesNeeded; i++) {
        startNewSkyPosX = 384 * i;
        newSky = k.add([
            k.sprite("sky"),
            k.scale(1,1),
            k.origin("center"),
            k.layer("bg"),
            k.pos(startNewSkyPosX, startSkyPosY),
        ]);
        console.log('Sky ' + i + 'will have a starting position of:' + startNewSkyPosX);    
        skies.push(newSky);
        if (i == (numSkiesNeeded-1)) {
            lastArrayItemPositionX = startNewSkyPosX;
        }
    }


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
    player = k.add([
        k.sprite("player"),
        k.scale(0.2,0.2),
        k.origin("center"),
        k.layer("obj"),
        k.pos(w*1/4,l*1/4),
        k.area(),
        k.body(),
    ]);

    /*
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
            k.area(),
            "apple",
        ]);   
    }
    //k.loadRoot("file:///mountains/")

    */

    
    function spawnApple() {

		// add apple object
		a = k.add([
			k.sprite("apple"),
            k.scale(1.5,1.5),
            k.layer("bg"),
            k.origin("center"),
			k.pos(w, k.rand(l/4, l*7/8)),
            k.area(),
			"app",
		]);

        //a.move(k.LEFT, 1);

		// wait a random amount of time to spawn next tree
		//k.wait(k.rand(0.5, 1.5), spawnApple);
        console.log('  ????? 1 x: ' + a.pos.x + ' y: ' + a.pos.y);

	}

    k.action("app", (app) => {
        console.log("moving apple");
		app.move(-250, 0);
		if (app.pos.x < 0) {
			k.destroy(app);
            console.log("apple destroyed!");
		}
	});

	// start spawning trees
	//spawnApple();

	// lose if player collides with any game obj with tag "tree"
	player.collides("app", () => {
		// go to "lose" scene and pass the score
		destroy(a);
        score += 200;
        console.log(' ????? 2');
	});
    
    

    k.add([
        k.layer("bg"),
        k.text("Fruit Runner", 18),
        k.color(1,0,0),
        k.pos(70, 10),
    ]);

    // add a text at position (100, 100)
    const scoreLabel = k.add([
        k.layer("bg"),
        //k.text("READY", 32),
        k.text("Score: " + score, 14),
        k.pos(30, 60),
    ]);

    k.add([
        k.layer("bg"),
        k.text("High Score: 25000", 16),
        k.color(1,0.5,0.3),
        k.pos(30, 40),
    ]);

    //var appleCounter = 0;
    k.loop(0.01, () => {
        if (gameOver == false) {
            score++;
            if (score % 100 == 0) {
                spawnApple();
            }
        }

    
        scoreLabel.text = "Score: " + score;

        /*
        //console.log('apple loop');
        for (i=0; i < numApples; i++) {
            appleBasket[i].move(-220,0);
            appleBasket[i].angle += 10;
            if (appleBasket[i].pos.x <= (0)) {
                // reset to starting position
                appleBasket[i].pos.x = w + appleDistance;
                appleBasket[i].pos.y = k.rand(l*1/2, l*8/10);
                //console.log('Resetting apple position.');
        }
        }
        */
    });

    /*
    k.wait(3, () => {
        sky.move(-5,0);
    });
    */
    player.collides("app", (app) => {
		destroy(app);
		score += 1000;
	});
    /*
    k.wait(1, () => {
        sky.pos.x = sky.pos.x - 10;
    });
    */

    k.loop(0.01, () => {


        /*
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
        */
        for (i=0; i < skies.length; i++) {
            
            sky = skies[i];
            sky.move(-80,0);
            sky.pos.x = Math.round(sky.pos.x);

            if ( (!isNaN(skies[i-1]) ) ) {
                if (i-1 == -1) {
                    previousSky = skies[skies.length - 1];
                } else
                {
                    previousSky = skies[i-1];
                }
                    if ( (sky.pos.x - (previousSky.pos.x + 384) ) != 1 ) {
                        console.log('i-1=' + i-1 + ' pos= ' + previousSky.pos.x + 384);
                        console.log('i=' + i + ' pos=' + sky.pos.x);
                        sky.pos.x = previousSky.pos.x + 1;
                        
                    }
                    console.log(' ** fixed : ' + i + ' and ' + (i - 1));
                
            }

            /*
            if (( (sky.pos.x) > w) && ( (skies[i]) < (w+40))) {
                
                if (skies[i + 1]) {
                    currentFarRightSkyPos = sky.pos.x + 384;
                    nextLeftSkyPos = skies[i + 1].pos.x;
                    if ((nextLeftSkyPos - currentFarRightSkyPos ) != 1) {
                        skies[i+1].pos.x = currentFarRightSkyPos + 1;
                        console.log(' ** fixed : ' + i + ' and ' + (i + 1));
                    }
                } 
                
            }
            */
            
            if (sky.pos.x <= -384) {
                // reset to starting position
                if (sky.pos.x < -384) {
                    sky.pos.x = -384;
                }
                if (i === 0) {
                    console.log('------------------------');
                }
                console.log('sky ' + i + ' new xPos: ' + sky.pos.x);
                sky.pos.x = lastArrayItemPositionX;
                console.log('lastArrayItemPositionX position is :' + sky.pos.x);
                
            }
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

        if (player.pos.y >= l) {

            if (gameStarted) {
                if (w > 667) {
                    k.add([
                        k.layer("bg"),
                        k.text("Game Over", 26),
                        k.color(1,0.5,0.3),
                        k.pos(w/3, l/2),
                    ]);
                } else {
                    k.add([
                        k.layer("bg"),
                        k.text("Game Over", 26),
                        k.color(1,0.5,0.3),
                        k.pos(w/5, l/2),
                    ]);
                }

                gameStarted = false;
                gameOver = true;
                console.log(">>>>>>> gameStarted now false");
            }            
        }

        //console.log("just like setInterval");
    });

   /*
   k.on("draw", "sky", (e) => {
    sky.pos.x
    */

}); // end k.scene(...)

// start the game
k.start("main");
gameStarted = true;
console.log(">>>>>>> game has started");

} // this section ends setting up and starting the game

} // end first()


function flapForYourLife() {
    try {
        player.jump(FLY_FORCE);
        console.log("flapping");
    } catch {
        console.log("player object not found!")
    }

}