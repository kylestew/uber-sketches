import "./style.css";

// import createShader from "gl-basic-shader";

// var shader = createShader(gl, {
//     texcoord: true, //vertex texcoords
//     normal: false, //vertex normals
//     color: true, //vertex colors
//     tint: [1, 0, 0, 1], //uniform color tint
// });
// console.log(shader);

/*
function setupScene(gl) {
    // let shader = require("gl-basic-shader")(gl);

    function render() {
        let width = gl.drawingBufferWidth;
        let height = gl.drawingBufferHeight;

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.CULL_FACE);

        // SharedArrayBuffer.bind()
    }
}

/// Setup a GL rendering context and run the rendering loop
function setup() {
    // Create a new canvas element
    var canvas = document.createElement("canvas");
    canvas.id = "myCanvas";
    canvas.width = 800;
    canvas.height = 600;

    // Append the canvas to the body or another DOM element
    var appDiv = document.getElementById("app");
    if (appDiv == null) return;
    appDiv.appendChild(canvas);

    var gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) {
        alert("Your browser does not support WebGL");
        return;
    }
    // TODO: way to force unwrap gl var

    setupScene(gl!);

    // TODO: make fullscreen and handle window resize

    function renderLoop() {
        if (gl) {
            let width = gl.drawingBufferWidth;
            let height = gl.drawingBufferHeight;

            gl.clearColor(1.0, 0.0, 0.0, 1.0);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            gl.viewport(0, 0, width, height);

            // TODO: main render

            requestAnimationFrame(renderLoop);
        }
    }
    renderLoop();
}

document.addEventListener("DOMContentLoaded", setup);
*/
