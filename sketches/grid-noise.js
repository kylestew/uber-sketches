const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const tweakpane = require("tweakpane");

const makeGridPositions = require("../lib/grid");
const eases = require("eases");

const settings = {
    dimensions: [1080, 1080],
    animate: true,
};

const params = {
    // grid settings
    rows: 16,
    cols: 16,
    margin: 0.333,

    // noise settings
    power: 2.0,
    freq: 0.001,
    amp: 0.2,

    // animation settings
    speed: 10.0,
    animate: true,
    frame: 0,
};

const drawSquare = (ctx, idx, x, y, z, w, h) => {
    // increase disarray with index
    const range = params.rows * params.cols;
    let freq = math.mapRange(idx, 0, range - 1, 0, 1);
    freq = Math.pow(freq, params.power);
    freq *= params.freq;

    const n = random.noise3D(x, y, z, freq);

    // rotate about center
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate(n);
    ctx.translate(w * -0.5, h * -0.5);

    // grid cell box
    ctx.fillRect(0, 0, w, h);
    // ctx.strokeRect(0, 0, w, h);
};

const sketch = () => {
    return ({ context, width, height, frame }) => {
        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);

        const margin = math.mapRange(params.margin, 0, 1, 0, width * 0.5);
        let pos = makeGridPositions(
            params.cols,
            params.rows,
            width - margin,
            height - margin,
            margin / 2.0,
            margin / 2.0
        );

        context.fillStyle = "#ff0000";
        context.strokeStyle = "#fff";

        function fillGrid(offset) {
            pos.forEach(({ idx, col, row, x, y, w, h }) => {
                context.save();
                context.translate(x, y);

                // DEBUG: grid positions
                // context.strokeStyle = "#ff0000";
                // context.strokeRect(0, 0, w, h);

                const f = params.animate ? frame : params.frame;
                let z = f * params.speed + offset;
                drawSquare(context, idx, x, y, z, w, h);

                context.restore();
            });
        }

        context.lineWidth = 4;

        context.fillStyle = "#ff0000";
        context.strokeStyle = "#ff0000";
        context.globalCompositeOperation = "lighter"; // adds colors together
        fillGrid(0.0);

        context.fillStyle = "#00ff00";
        context.strokeStyle = "#00ff00";
        context.globalCompositeOperation = "lighter"; // adds colors together
        fillGrid(100.0);

        context.fillStyle = "#0000ff";
        context.strokeStyle = "#0000ff";
        context.globalCompositeOperation = "lighter"; // adds colors together
        fillGrid(200.0);
    };
};

const createPane = () => {
    const pane = new tweakpane.Pane();
    let folder;

    folder = pane.addFolder({ title: "Grid" });
    folder.addInput(params, "cols", { min: 2, max: 24, step: 1 });
    folder.addInput(params, "rows", { min: 2, max: 24, step: 1 });
    folder.addInput(params, "margin", { min: 0.0, max: 1.0 });

    folder = pane.addFolder({ title: "Disarray" });
    folder.addInput(params, "power", { min: 0, max: 10 });
    folder.addInput(params, "freq", { min: -0.01, max: 0.01 });
    folder.addInput(params, "amp", { min: 0, max: 1 });

    folder = pane.addFolder({ title: "Animation" });
    folder.addInput(params, "speed", { min: 0, max: 100 });
    folder.addInput(params, "animate");
    folder.addInput(params, "frame", { min: 0, max: 999 });
};

createPane();
canvasSketch(sketch, settings);
