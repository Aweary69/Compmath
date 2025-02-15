/**
 * Calculates the linear least squares fit for a given set of data points.
 * @param {Array<Array<number>>} points - Array of [x, y] data points.
 * @returns {{slope: number|null, intercept: number|null}} - Slope and intercept of the best-fit line, or null if calculation fails.
 */
function linearLeastSquaresFit(points) {
    if (!Array.isArray(points) || points.length === 0) {
        return { slope: null, intercept: null }; // Return null if no points provided
    }

    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    // Calculate sums needed for the least squares formula
    for (const [x, y] of points) {
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }

    // Calculate denominator and handle the case of division by zero
    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return { slope: null, intercept: null }; // Return null if denominator is zero (vertical line case)

    // Calculate slope and intercept using least squares formulas
    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept }; // Return slope and intercept of the best-fit line
}

module.exports = { linearLeastSquaresFit };