//Constructs a forward difference table.Uses the first forward difference to approximate the derivative at targetX.
function newtonsForwardDifference(x, y, targetX) {
    const n = x.length;
    let diffTable = Array.from({ length: n }, () => Array(n).fill(0));

    // Fill first column with y values
    for (let i = 0; i < n; i++) {
        diffTable[i][0] = y[i];
    }//The first column of diffTable is filled with known function values f(x) (i.e., y values).

    // Compute forward difference table
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            diffTable[i][j] = (diffTable[i + 1][j - 1] - diffTable[i][j - 1]) / (x[i + j] - x[i]);
        }
    }//It iteratively computes divided differences for each column.

    // First derivative approximation at targetX
    let derivative = diffTable[0][1];//The first derivative approximation is taken from the first-order divided difference, i.e., Δf(x )
    return derivative;
}

module.exports = { newtonsForwardDifference };
