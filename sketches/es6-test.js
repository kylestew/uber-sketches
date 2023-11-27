const canvasSketch = require("canvas-sketch");

import { circle } from "@thi.ng/geom";

console.log(circle);

const settings = {
    dimensions: [2048, 2048],
};

const sketch = () => {
    return ({ context, width, height }) => {
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height);
    };
};

canvasSketch(sketch, settings);
