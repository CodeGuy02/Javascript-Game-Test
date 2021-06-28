
function first() {

playField = document.getElementById("playField");
controlField = document.getElementById("controlField");

w = playField.clientWidth;
l = playField.clientHeight;
controlField.innerHTML = "Width: " + w + " Length: " + l;

playFieldCanvas = document.getElementById("playFieldCanvas");

// initialize kaboom context
// const k = kaboom();

const k = kaboom({
    width:w,
    height:l,
    canvas:playFieldCanvas,
});

// define a scene
k.scene("main", () => {

    // draw background on the bottom, ui on top, layer "obj" is default
    k.layers([
        "bg",
        "obj",
        "ui",
    ], "obj");

    //const sky = k.add([
    //    k.sprite("sky", "sky.png"),
    //]);

    //k.loadRoot("https://github.com/CodeGuy02/Javascript-Game-Test/blob/364b4279d67834c2ee19f192259d7f4afe0b3fbe/");
    //k.loadRoot("https://cors-anywhere.herokuapp.com/https://github.com/CodeGuy02/Javascript-Game-Test/tree/364b4279d67834c2ee19f192259d7f4afe0b3fbe/mountains/");
    //k.loadRoot("https://github.com/CodeGuy02/Javascript-Game-Test/tree/364b4279d67834c2ee19f192259d7f4afe0b3fbe/mountains/");
    //k.loadRoot("https://game-project-demo-01.s3.us-east.cloud-object-storage.appdomain.cloud/");
    k.loadRoot("file:///mountains/")
    k.loadSprite('sky', 'background_glacial_mountains.png');

    // add a text at position (100, 100)
    k.add([
        k.sprite("sky"),
        k.layer("bg"),
        k.text("READY", 32),
        k.pos(100, 100),
    ]);

});

// start the game
k.start("main");

}