function linearLeastSquaresFit(points) {
    if (!Array.isArray(points) || points.length === 0) {
        return { slope: null, intercept: null };
    }

    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (const [x, y] of points) {
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumX2 += x * x;
    }

    const denominator = n * sumX2 - sumX * sumX;
    if (denominator === 0) return { slope: null, intercept: null };

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    return { slope, intercept };
}

module.exports = { linearLeastSquaresFit };

