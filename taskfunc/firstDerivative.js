function newtonsForwardDifference(x, y, targetX) {
    const n = x.length;
    if (n < 2) {
        return "Not enough data points for derivative approximation."; // Handle case with insufficient points
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

    // 2. Calculate forward difference using closest point and the next one (if available)
    let derivative;
    if (closestIndex < n - 1) {
        // Use forward difference: (f(x_{i+1}) - f(x_i)) / (x_{i+1} - x_i)
        derivative = (y[closestIndex + 1] - y[closestIndex]) / (x[closestIndex + 1] - x[closestIndex]);
    } else if (closestIndex > 0) {
        // If closestIndex is the last point, use backward difference: (f(x_i) - f(x_{i-1})) / (x_i - x_{i-1})
        derivative = (y[closestIndex] - y[closestIndex - 1]) / (x[closestIndex] - x[closestIndex - 1]);
    } else {
        return "Cannot calculate derivative at this targetX with given data."; // Should not happen in typical cases, but for robustness
    }

    return derivative;
}

module.exports = { newtonsForwardDifference };