function bisectionMethod(func, a, b, tolerance, maxIterations) {
    let iteration = 0;
    let fa = func(a);
    let fb = func(b);

    if (fa * fb >= 0) {
        return { root: null, error: "Function values at interval endpoints must have opposite signs." };
    }

    let currentA = a;
    let currentB = b;

    while (iteration < maxIterations) {
        let c = (currentA + currentB) / 2;
        let fc = func(c);

        if (Math.abs(fc) <= tolerance || (currentB - currentA) / 2 < tolerance) {
            return { root: c, iterations: iteration + 1 };
        }

        if (fa * fc < 0) {
            currentB = c;
            fb = fc;
        } else {
            currentA = c;
            fa = fc;
        }
        iteration++;
    }

    return { root: (currentA + currentB) / 2, iterations: maxIterations, error: "Maximum iterations reached." };
}

function falsePositionMethod(func, a, b, tolerance, maxIterations) {
    let iteration = 0;
    let fa = func(a);
    let fb = func(b);

    if (fa * fb >= 0) {
        return { root: null, error: "Function values at interval endpoints must have opposite signs." };
    }

    let currentA = a;
    let currentB = b;
    let prevRoot = null; // To calculate relative error

    while (iteration < maxIterations) {
        // Calculate c using False Position formula
        let c = (currentA * fb - currentB * fa) / (fb - fa);
        let fc = func(c);

        if (Math.abs(fc) <= tolerance || Math.abs((c - prevRoot) / c) <= tolerance && prevRoot !== null) { // Relative error check added
            return { root: c, iterations: iteration + 1, relativeError: prevRoot === null ? 0 : Math.abs((c - prevRoot) / c) };
        }

        prevRoot = c; // Update previous root for relative error calculation

        if (fa * fc < 0) {
            currentB = c;
            fb = fc;
        } else {
            currentA = c;
            fa = fc;
        }
        iteration++;
    }

    return { root: (currentA + currentB) / 2, iterations: maxIterations, error: "Maximum iterations reached.", relativeError: Math.abs(((currentA + currentB) / 2 - prevRoot) / ((currentA + currentB) / 2)) }; // Approximate relative error if max iterations reached
}

function newtonRaphsonMethod(func, funcDerivative, initialGuess, tolerance, maxIterations) {
    let iteration = 0;
    let currentGuess = initialGuess;
    let prevGuess = null; // For relative error calculation
    let relativeErrorValue = 0; // Initialize relativeErrorValue

    while (iteration < maxIterations) {
        const fValue = func(currentGuess);
        const fDerivativeValue = funcDerivative(currentGuess);

        // Robust Relative Error Calculation
        if (currentGuess !== 0) {
            relativeErrorValue = Math.abs((currentGuess - prevGuess) / currentGuess);
        } else {
            relativeErrorValue = Math.abs(currentGuess - prevGuess); // Use absolute difference if currentGuess is zero
        }


        if (Math.abs(fValue) <= tolerance || relativeErrorValue <= tolerance && prevGuess !== null) { // Use relativeErrorValue in check
            return { root: currentGuess, iterations: iteration + 1, relativeError: relativeErrorValue }; // Return calculated relativeErrorValue
        }

        if (fDerivativeValue === 0) {
            return { root: null, iterations: iteration + 1, error: "Derivative is zero. Newton-Raphson method failed." }; // Handle zero derivative
        }

        prevGuess = currentGuess;
        currentGuess = currentGuess - fValue / fDerivativeValue;
        iteration++;
    }

    // Calculate relativeErrorValue for max iterations case as well (using the robust approach)
    if (currentGuess !== 0) {
        relativeErrorValue = Math.abs((currentGuess - prevGuess) / currentGuess);
    } else {
        relativeErrorValue = Math.abs(currentGuess - prevGuess);
    }
    return { root: currentGuess, iterations: maxIterations, error: "Maximum iterations reached.", relativeError: relativeErrorValue }; // Return calculated relativeErrorValue
}

module.exports = { bisectionMethod, falsePositionMethod, newtonRaphsonMethod }; // ✅ CORRECT module.exports - exporting all three