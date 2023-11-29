const canvasSketch = require("canvas-sketch");
const drawCenteredText = require("./lib/centered-text");

const settings = {
    dimensions: [1024, 1024],
};

const text = "A";
const fontSize = 1200;
const fontFamily = "serif";

const sketch = () => {
    return ({ context, width, height }) => {
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height);

        context.fillStyle = "black";

        context.font = `${fontSize}px ${fontFamily}`;

        drawCenteredText(context, text, width, height);
    };
};

canvasSketch(sketch, settings);
