/**
 * Function to be integrated for Task 8: f(x) = 2x^3.
 * @param {number} x - The input value.
 * @returns {number} - The value of 2x^3 at x.
 */
function f_x_task8(x) {
    return 2 * x**3;
}

/**
 * Computes the definite integral of f(x) using Simpson's 3/8 Rule.
 * @param {function} f - The function to integrate.
 * @param {number} a - The lower limit of integration.
 * @param {number} b - The upper limit of integration.
 * @param {number} n - The number of subintervals (must be a multiple of 3).
 * @returns {number} - The approximate value of the definite integral.
 */
function simpsons38Rule(f, a, b, n) {
    const h = (b - a) / n;
    let integralSum = f(a) + f(b); // f(x0) + f(xn)

    for (let i = 1; i < n; i++) {
        const x_i = a + i * h;
        if (i % 3 === 0) {
            integralSum += 2 * f(x_i); // Coefficients of 2 for i = 3, 6, 9, ...
        } else {
            integralSum += 3 * f(x_i); // Coefficients of 3 for i ≠ 3, 6, 9, ...
        }
    }

    return (3 * h / 8) * integralSum;
}

module.exports = { f_x_task8, simpsons38Rule };