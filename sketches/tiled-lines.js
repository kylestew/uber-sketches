const canvasSketch = require("canvas-sketch");

const STROKE_WIDTH = 10;
const STEP_SIZE = 80;

const settings = {
    dimensions: [2048, 2048],
};

function drawLine(context, x, y, width, height) {
    const random = Math.random();
    const startX = random < 0.5 ? x : x + width;
    const startY = y;
    const endX = random < 0.5 ? x + width : x;
    const endY = y + height;

    context.lineWidth = STROKE_WIDTH;
    // context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
}

function createGrid(context, width, height, step) {
    for (let x = 0; x < width; x += step) {
        for (let y = 0; y < height; y += step) {
            drawLine(context, x, y, step, step);
        }
    }
}

const sketch = ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.lineJoin = "round";
    context.lineCap = "square";

    createGrid(context, width, height, STEP_SIZE);
    context.stroke();
};

canvasSketch(sketch, settings);
