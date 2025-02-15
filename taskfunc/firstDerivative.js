/**
 * Approximates the first derivative of a function at a given point using Newton's Forward Difference formula.
 * @param {Array<number>} x - Array of x values.
 * @param {Array<number>} y - Array of corresponding y values.
 * @param {number} targetX - The x value at which to estimate the derivative.
 * @returns {number|string} - The estimated derivative value, or an error string if calculation fails.
 */
function newtonsForwardDifference(x, y, targetX) {
    const n = x.length;
    if (n < 2) {
        return "Not enough data points for derivative approximation."; // Need at least 2 points for forward difference
    }

    // 1. Find index of x value closest to targetX
    let closestIndex = 0;
    let minDifference = Math.abs(x[0] - targetX);

    for (let i = 1; i < n; i++) {
        const difference = Math.abs(x[i] - targetX);
        if (difference < minDifference) {
            minDifference = difference;
            closestIndex = i;
        }
    }

    let derivative;
    if (closestIndex < n - 1) {
        // Forward difference: (f(x_{i+1}) - f(x_i)) / (x_{i+1} - x_i)
        derivative = (y[closestIndex + 1] - y[closestIndex]) / (x[closestIndex + 1] - x[closestIndex]);
    } else if (closestIndex > 0) {
        // Backward difference if closestIndex is the last point: (f(x_i) - f(x_{i-1})) / (x_i - x_{i-1})
        derivative = (y[closestIndex] - y[closestIndex - 1]) / (x[closestIndex] - x[closestIndex - 1]);
    } else {
        return "Cannot calculate derivative at this targetX with given data."; // Edge case handling
    }

    return derivative; // Return the calculated derivative value
}

module.exports = { newtonsForwardDifference };