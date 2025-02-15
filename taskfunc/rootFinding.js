/**
 * Finds the root of a function within a given interval using the Bisection method.
 * @param {function} func - The function for which to find the root.
 * @param {number} a - The lower bound of the interval.
 * @param {number} b - The upper bound of the interval.
 * @param {number} tolerance - The desired accuracy of the root.
 * @param {number} maxIterations - The maximum number of iterations allowed.
 * @returns {{root: number|null, iterations: number, error: string|null}} - Root, number of iterations, and error message (if any).
 */
function bisectionMethod(func, a, b, tolerance, maxIterations) {
    let iteration = 0;
    let fa = func(a);
    let fb = func(b);

    // Check if initial interval is valid (function values at endpoints must have opposite signs)
    if (fa * fb >= 0) {
        return { root: null, iterations: 0, error: "Function values at interval endpoints must have opposite signs." };
    }

    let currentA = a;
    let currentB = b;
    let c = (currentA + currentB) / 2; // Initialize c for the first iteration

    while (iteration < maxIterations) {
        c = (currentA + currentB) / 2; // Midpoint of the current interval
        let fc = func(c);

        // Check if root is found within tolerance or interval is sufficiently small
        if (Math.abs(fc) <= tolerance || (currentB - currentA) / 2 < tolerance) {
            return { root: c, iterations: iteration + 1, error: null }; // Root found
        }

        // Narrow down the interval based on the sign of f(c)
        if (fa * fc < 0) {
            currentB = c; // Root is in [currentA, c]
            fb = fc;
        } else {
            currentA = c; // Root is in [c, currentB]
            fa = fc;
        }
        iteration++;
    }

    // Maximum iterations reached without finding root within tolerance
    return { root: c, iterations: maxIterations, error: "Maximum iterations reached." };
}

/**
 * Finds the root of a function using the False Position method.
 * @param {function} func - The function for which to find the root.
 * @param {number} a - The lower bound of the interval.
 * @param {number} b - The upper bound of the interval.
 * @param {number} tolerance - The desired tolerance for the root.
 * @param {number} maxIterations - Maximum number of iterations allowed.
 * @returns {{root: number|null, iterations: number, relativeError: number, error: string|null}} - Root, iterations, relative error, and error message (if any).
 */
function falsePositionMethod(func, a, b, tolerance, maxIterations) {
    let iteration = 0;
    let fa = func(a);
    let fb = func(b);

    // Check if initial interval is valid
    if (fa * fb >= 0) {
        return { root: null, iterations: 0, relativeError: NaN, error: "Function values at interval endpoints must have opposite signs." };
    }

    let currentA = a;
    let currentB = b;
    let prevRoot = null; // To calculate relative error
    let c = 0; // Initialize c

    while (iteration < maxIterations) {
        // Calculate c using the False Position formula (secant line intersection with x-axis)
        c = (currentA * fb - currentB * fa) / (fb - fa);
        let fc = func(c);

        // Check for convergence based on function value and relative error
        let relativeErrorValue = prevRoot === null ? tolerance + 1 : Math.abs((c - prevRoot) / c); // Avoid division by zero and initial error check
        if (Math.abs(fc) <= tolerance || relativeErrorValue <= tolerance) {
            return { root: c, iterations: iteration + 1, relativeError: relativeErrorValue, error: null }; // Root found
        }

        prevRoot = c; // Update previous root for relative error calculation

        // Narrow down the interval based on the sign of f(c)
        if (fa * fc < 0) {
            currentB = c;
            fb = fc;
        } else {
            currentA = c;
            fa = fc;
        }
        iteration++;
    }

    // Max iterations reached, return with a possible error message and approximate relative error
    let relativeErrorValue = prevRoot === null ? NaN : Math.abs(((currentA + currentB) / 2 - prevRoot) / ((currentA + currentB) / 2));
    return { root: c, iterations: maxIterations, relativeError: relativeErrorValue, error: "Maximum iterations reached." };
}

/**
 * Finds the root of a function using the Newton-Raphson method.
 * @param {function} func - The function for which to find the root.
 * @param {function} funcDerivative - The derivative of the function.
 * @param {number} initialGuess - The initial guess for the root.
 * @param {number} tolerance - The desired tolerance for the root.
 * @param {number} maxIterations - Maximum number of iterations allowed.
 * @returns {{root: number|null, iterations: number, relativeError: number, error: string|null}} - Root, iterations, relative error, and error message (if any).
 */
function newtonRaphsonMethod(func, funcDerivative, initialGuess, tolerance, maxIterations) {
    let iteration = 0;
    let currentGuess = initialGuess;
    let prevGuess = null; // For relative error calculation
    let relativeErrorValue = tolerance + 1; // Initialize relative error to be larger than tolerance
    const iterationData = []; // Array to store iteration details

    while (iteration < maxIterations) {
        const fValue = func(currentGuess);
        const fDerivativeValue = funcDerivative(currentGuess);

        // Check if derivative is zero (to prevent division by zero)
        if (fDerivativeValue === 0) {
            return { root: null, iterations: iteration + 1, relativeError: NaN, error: "Derivative is zero. Newton-Raphson method failed.", iterationDetails: iterationData }; // Method fails if derivative is zero
        }

        // Calculate relative error, handling the case of initialGuess being 0
        relativeErrorValue = prevGuess === null ? tolerance + 1 : Math.abs((currentGuess - prevGuess) / currentGuess);

        // Store iteration data  <---  THIS PART WAS MISSING!
        iterationData.push({ 
            iteration: iteration + 1,
            rootApprox: currentGuess,
            fValue: fValue,
            relativeError: relativeErrorValue
        });

        // Check for convergence based on function value and relative error
        if (Math.abs(fValue) <= tolerance || relativeErrorValue <= tolerance) {
            return { root: currentGuess, iterations: iteration + 1, relativeError: relativeErrorValue, error: null, iterationDetails: iterationData }; // Root found
        }

        prevGuess = currentGuess; // Update previous guess for relative error calculation
        currentGuess = currentGuess - fValue / fDerivativeValue; // Newton-Raphson iteration formula
        iteration++;
    }

    // Max iterations reached, return with a possible error message and the last calculated relative error
    relativeErrorValue = prevGuess === null ? NaN : Math.abs((currentGuess - prevGuess) / currentGuess);
    iterationData.push({ // Store last iteration data even if max iterations reached
        iteration: maxIterations,
        rootApprox: currentGuess,
        fValue: func(currentGuess),
        relativeError: relativeErrorValue
    });
    return { root: currentGuess, iterations: maxIterations, relativeError: relativeErrorValue, error: "Maximum iterations reached.", iterationDetails: iterationData }; // Return calculated relativeErrorValue
}

module.exports = { bisectionMethod, falsePositionMethod, newtonRaphsonMethod };