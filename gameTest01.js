
function first() {

// initialize kaboom context
const k = kaboom();

// define a scene
k.scene("main", () => {

    // draw background on the bottom, ui on top, layer "obj" is default
    layers([
        "bg",
        "obj",
        "ui",
    ], "obj");

    // add a text at position (100, 100)
    k.add([
        k.text("READY", 32),
        k.pos(100, 100),
    ]);

});

// start the game
k.start("main");

}