function linearLeastSquaresFit(points) {
    if (!Array.isArray(points) || points.length === 0) {
        return { slope: null, intercept: null };
    }//Checks if points is a valid array and contains at least one point.

    const n = points.length;//n: Number of points in the dataset
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (const [x, y] of points) {
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }//Iterates through each point (x,y) in points and accumulates values

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return { slope: null, intercept: null };//if denominator === 0, it means all x values are identical (vertical line), so a unique solution doesn't exist.

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

module.exports = { linearLeastSquaresFit };

