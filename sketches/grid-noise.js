const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const tweakpane = require("tweakpane");

const makeGridPositions = require("../lib/grid");
const drawCenteredText = require("../lib/centered-text");

const settings = {
    dimensions: [1080, 1080],
    animate: true,
};

const params = {
    // grid settings
    rows: 8,
    cols: 8,
    margin: 0.333,

    // glyph settings
    // scaleMin: 1,
    // scaleMax: 30,
    // lineCap: "butt",

    // noise settings
    // freq: 0.001,
    // amp: 0.2,
    // animate: true,
    // frame: 0,
};

const drawSquare = (ctx, width, height) => {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.fill();
};

const sketch = () => {
    return ({ context, width, height, frame }) => {
        context.fillStyle = "black";
        context.fillRect(0, 0, width, height);

        const margin = math.mapRange(params.margin, 0, 1, 0, width * 0.5);
        pos = makeGridPositions(
            params.cols,
            params.rows,
            width - margin,
            height - margin,
            margin / 2.0,
            margin / 2.0
        );

        context.fillStyle = "#ff0000";
        context.strokeStyle = "#fff";
        context.font = "100px serif";

        pos.forEach(({ idx, col, row, x, y, w, h }) => {
            context.save();
            context.translate(x, y);

            // grid cell box
            context.strokeStyle = "#fff";
            context.lineWidth = 2;
            context.strokeRect(0, 0, w, h);

            drawCenteredText(context, idx, w, h);

            context.restore();
        });

        // context.fillStyle = "#00ff00";
        // context.globalCompositeOperation = "lighter"; // adds colors together

        // pos.forEach(({ col, row, x, y, w, h }) => {
        //     context.save();
        //     // context.translate(x, y);
        //     context.translate(x + w * 0.05, y + h * 0.05);

        //     drawThing(context, w * 0.5, h * 0.5);

        //     context.restore();
        // });

        // context.fillStyle = "#0000ff";
        // context.globalCompositeOperation = "lighter";

        // pos.forEach(({ col, row, x, y, w, h }) => {
        //     context.save();
        //     // context.translate(x, y);
        //     // context.translate(x + w * 0.05, y + h * 0.05);
        //     context.translate(x + w * 0.1, y + h * 0.1);

        //     drawThing(context, w * 0.5, h * 0.5);

        //     context.restore();
        // });

        // for (let i = 0; i < numCells; i++) {

        /*

        const f = params.animate ? frame : params.frame;
        const n = random.noise3D(x, y, f * 10, params.freq);
        const angle = n * Math.PI * params.amp;

        const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

        context.save();
        context.translate(x, y);
        context.translate(margX, margY);
        context.translate(cellW * 0.5, cellH * 0.5);
        context.rotate(angle);

        context.lineWidth = scale;
        context.lineCap = params.lineCap;

        context.beginPath();
        context.moveTo(w * -0.5, 0);
        context.lineTo(w * 0.5, 0);
        context.stroke();

        context.restore();

        */
        // }
    };
};

const createPane = () => {
    const pane = new tweakpane.Pane();
    let folder;

    folder = pane.addFolder({ title: "Grid" });
    folder.addInput(params, "cols", { min: 2, max: 24, step: 1 });
    folder.addInput(params, "rows", { min: 2, max: 24, step: 1 });
    folder.addInput(params, "margin", { min: 0.0, max: 1.0 });

    // folder = pane.addFolder({ title: "Symbol" });
    // folder.addInput(params, "lineCap", {
    //     options: { butt: "butt", round: "round", square: "square" },
    // });
    // folder.addInput(params, "scaleMin", { min: 1, max: 100 });
    // folder.addInput(params, "scaleMax", { min: 1, max: 100 });

    // folder = pane.addFolder({ title: "Noise" });
    // folder.addInput(params, "freq", { min: -0.01, max: 0.01 });
    // folder.addInput(params, "amp", { min: 0, max: 1 });
    // folder.addInput(params, "animate");
    // folder.addInput(params, "frame", { min: 0, max: 999 });
};

createPane();
canvasSketch(sketch, settings);
