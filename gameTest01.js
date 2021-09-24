// basic multi scene setup
//import scene from "https://kaboomjs.com/lib/0.5.1/kaboom.js";

//const kaboom = require("kaboom");   // kaboom has already been declared.

//import {scene} from "https://kaboomjs.com/lib/0.5.1/kaboom.js";
//import kaboom from "kaboom";
//var kaboom = require("https://kaboomjs.com/lib/0.5.1/kaboom.js");


playField = document.getElementById("playField");
controlField = document.getElementById("controlField");

w = playField.clientWidth;
h = playField.clientHeight;


playFieldCanvas = document.getElementById("playFieldCanvas");
k = kaboom({width:w, height:h, canvas:playFieldCanvas, global:true, debug:true});
debug.inspect = true;

scene("game", () => {

	add([
        "text",
		text("Press space to view score", { width: width() }),
	]);

	keyPress("space", () => {
		// passing custom data to another scene
		go("score", ~~rand(100));
	});

    console.log("in game scene");
});


go("game");

console.log('scene data= ' + JSON.stringify(k));

/*
scene("score", (score) => {

	// receives score and display it
	add([
		text("Score: " + score),
	]);

	// go back to game scene on key press
	keyPress("space", () => {
		go("game");
	});

});

go("game");
*/

function first() {
    
}
