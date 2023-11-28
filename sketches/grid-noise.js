const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const tweakpane = require("tweakpane");

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

/**
 * Creates a grid of positions based on the specified number of columns and rows.
 * Each position in the grid is represented as an object containing its column (col),
 * row, and its x and y coordinates within the grid. The function also calculates
 * the width and height of each cell in the grid.
 *
 * @param {number} cols - The number of columns in the grid.
 * @param {number} rows - The number of rows in the grid.
 * @param {number} gridW - The total width of the grid.
 * @param {number} gridH - The total height of the grid.
 * @param {number} margX - The horizontal margin or offset to apply to each cell's x position.
 * @param {number} margY - The vertical margin or offset to apply to each cell's y position.
 * @returns {Object[]} positions - An array of objects where each object represents a cell's position and size.
 *                                Each object has the properties: col (column index), row (row index),
 *                                x (x-coordinate of the cell), y (y-coordinate of the cell),
 *                                w (width of the cell), and h (height of the cell).
 */
const makeGridPositions = (cols, rows, gridW, gridH, margX, margY) => {
    const numCells = cols * rows;

    const cellW = gridW / cols;
    const cellH = gridH / rows;

    let positions = [];
    let idx = 0;
    for (let i = 0; i < numCells; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);

        positions.push({
            idx: idx++,
            col,
            row,
            x: margX + col * cellW,
            y: margY + row * cellH,
            w: cellW,
            h: cellH,
        });
    }
    return positions;
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
        context.textBaseline = "top";
        // context.textAlign = "center";

        pos.forEach(({ idx, col, row, x, y, w, h }) => {
            context.save();
            context.translate(x, y);

            // grid cell box
            context.strokeStyle = "#fff";
            context.lineWidth = 2;
            context.strokeRect(0, 0, w, h);

            // measure text
            const text = idx.toString();
            const metrics = context.measureText(text);

            const mx = metrics.actualBoundingBoxLeft * -1;
            const my = metrics.actualBoundingBoxAscent * -1;
            const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
            const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

            // center text
            const tx = (w - mw) * 0.5 - mx;
            const ty = (h - mh) * 0.5 - my;
            context.translate(tx, ty);

            // draw text outline
            context.strokeStyle = "#00ff00";
            context.strokeRect(mx, my, mw, mh);

            // draw text
            context.fillText(text, 0, 0);

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
    folder.addInput(params, "cols", { min: 2, max: 50, step: 1 });
    folder.addInput(params, "rows", { min: 2, max: 50, step: 1 });
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
