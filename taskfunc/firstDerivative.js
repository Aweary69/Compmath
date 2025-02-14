function newtonsForwardDifference(x, y, targetX) {
    const n = x.length;
    let diffTable = Array.from({ length: n }, () => Array(n).fill(0));

    // Fill first column with y values
    for (let i = 0; i < n; i++) {
        diffTable[i][0] = y[i];
    }

    // Compute forward difference table
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            diffTable[i][j] = (diffTable[i + 1][j - 1] - diffTable[i][j - 1]) / (x[i + j] - x[i]);
        }
    }

    // First derivative approximation at targetX
    let derivative = diffTable[0][1];
    return derivative;
}

module.exports = { newtonsForwardDifference };
