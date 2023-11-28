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

module.exports = makeGridPositions;
