/**
 * Draws centered text on a canvas context.
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {string} text - The text to be drawn.
 * @param {number} containerWidth - The width of the container.
 * @param {number} containerHeight - The height of the container.
 */
function drawCenteredText(ctx, text, containerWidth, containerHeight) {
    ctx.save();

    // measure text
    ctx.textBaseline = "top";
    const metrics = ctx.measureText(text);

    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // center text
    const tx = (containerWidth - mw) * 0.5 - mx;
    const ty = (containerHeight - mh) * 0.5 - my;
    ctx.translate(tx, ty);

    // draw text outline
    // ctx.strokeStyle = "#00ff00";
    // ctx.strokeRect(mx, my, mw, mh);

    // draw text
    ctx.fillText(text, 0, 0);

    ctx.restore();
}

module.exports = drawCenteredText;
