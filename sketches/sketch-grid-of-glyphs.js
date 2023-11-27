const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

// easing equations robert penner
// easings.net
const eases = require("eases");
console.log(eases.expoInOut(0.75));
// cubic-bezier.com to make custom weighted cubic bezier eases
const BezierEasing = require("bezier-easing");
const easeFn = BezierEasing(0.67, 0.03, 0.29, 0.99);
console.log(easeFn(0.75));

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const colorCount = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount);
  console.log(colorCount, palette);

  const createGrid = () => {
    const points = [];
    const count = 40;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = x / (count - 1);
        const v = y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.1;
        points.push({
          color: random.pick(palette),
          r: radius,
          pos: [u, v],
          rotation: random.noise2D(u, v),
        });
      }
    }
    return points;
  };

  random.setSeed(11);
  const points = createGrid().filter(() => random.value() > 0.5); // remove random
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    points.forEach((data) => {
      const { color, pos, r, rotation } = data;
      const [u, v] = pos;

      // push in margins
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, r * width, 0, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.fill();

      context.save();
      context.fillStyle = color;
      context.font = `${r * width}px "Helvetica"`;
      context.translate(x, y);
      context.rotate(rotation);
      // context.fillText("=", 0, 0);
      context.fillText("+", 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
