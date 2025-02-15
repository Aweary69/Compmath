/**
 * Approximates the solution of the ODE dy/dx = y² + x², y(0) = 1 using Taylor series method.
 * Uses Taylor series expansion up to the third derivative.
 * @param {number} x - The point at which to approximate y(x).
 * @returns {number} - The approximated value of y(x).
 */
function taylorSeriesApprox(x) {
    // Derivatives evaluated at x=0 and y(0)=1:
    const y0 = 1;
    const yPrime0 = 1;
    const yDoublePrime0 = 2;
    const yTriplePrime0 = 8;

    // Taylor series expansion up to third derivative:
    return y0 + yPrime0 * x + (yDoublePrime0 / 2) * x**2 + (yTriplePrime0 / 6) * x**3;
}

module.exports = { taylorSeriesApprox };