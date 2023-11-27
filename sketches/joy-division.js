const canvasSketch = require("canvas-sketch");

const settings = {
    dimensions: [2048, 2048],
};

const sketch = ({ width }) => {
    var step = 40;
    var lines = [];

    let size = width;

    // Create the lines
    for (var i = step; i <= size - step; i += step) {
        var line = [];
        for (var j = step; j <= size - step; j += step) {
            // randomly displace the Y position of the points
            var distanceToCenter = Math.abs(j - size / 2);
            var variance = Math.max(size / 2 - 50 - distanceToCenter, 0);
            var random = ((Math.random() * variance) / 2) * -1;

            random *= 0.3;

            var point = { x: j, y: i + random };
            line.push(point);
        }
        lines.push(line);
    }

    return ({ context, width, height }) => {
        context.fillStyle = "white";
        context.fillRect(0, 0, width, height);

        // draw lines
        context.strokeStyle = "black";
        context.lineWidth = 5;

        lines.slice(4).forEach((line) => {
            context.beginPath();

            context.moveTo(line[0].x, line[0].y);

            for (var j = 0; j < line.length - 2; j++) {
                var xc = (line[j].x + line[j + 1].x) / 2;
                var yc = (line[j].y + line[j + 1].y) / 2;
                context.quadraticCurveTo(line[j].x, line[j].y, xc, yc);
            }

            context.quadraticCurveTo(line[j].x, line[j].y, line[j + 1].x, line[j + 1].y);

            context.save();
            context.globalCompositeOperation = "destination-out";
            context.fill();
            context.restore();
            context.stroke();
        });
    };
};

canvasSketch(sketch, settings);
