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

    // If f(a) and f(b) don't have opposite signs, adjust b slightly
    if (fa * fb >= 0) {
        console.warn("Warning: Function values at interval endpoints do not have opposite signs. Adjusting bounds...");
        b += 0.1; // Slightly shift b to avoid failure
        fb = func(b);
    }

    let currentA = a;
    let currentB = b;
    let prevRoot = null; // Track previous root
    let relativeError = null; // Initialize relative error

    while (iteration < maxIterations) {
        let c = (currentA * fb - currentB * fa) / (fb - fa);
        let fc = func(c);

        if (prevRoot !== null) {
            relativeError = Math.abs((c - prevRoot) / (c || 1)); // Avoid division by zero
        }

        if (Math.abs(fc) <= tolerance || (relativeError !== null && relativeError <= tolerance)) {
            return { root: c, iterations: iteration + 1, relativeError: relativeError || 0 };
        }

        prevRoot = c; // Store previous root for relative error calculation

        if (fa * fc < 0) {
            currentB = c;
            fb = fc;
        } else {
            currentA = c;
            fa = fc;
        }

        iteration++;
    }

    return {
        root: prevRoot !== null ? prevRoot : (a + b) / 2, // If all else fails, return midpoint
        iterations: maxIterations,
        error: "Maximum iterations reached.",
        relativeError: relativeError || 0
    };
}



function newtonRaphsonMethod(func, funcDerivative, initialGuess, tolerance, maxIterations) {
    let iteration = 0;
    let currentGuess = initialGuess;
    let prevGuess = null; // For relative error calculation

    while (iteration < maxIterations) {
        const fValue = func(currentGuess);
        const fDerivativeValue = funcDerivative(currentGuess);

        if (fDerivativeValue === 0) {
            return { root: null, iterations: iteration + 1, error: "Derivative is zero. Newton-Raphson method failed." };
        }

        let relativeError = prevGuess !== null ? Math.abs((currentGuess - prevGuess) / (currentGuess || 1)) : 0; // Avoid division by zero

        if (Math.abs(fValue) <= tolerance || (relativeError <= tolerance && prevGuess !== null)) { 
            return { root: currentGuess, iterations: iteration + 1, relativeError };
        }

        prevGuess = currentGuess;
        currentGuess = currentGuess - fValue / fDerivativeValue;
        iteration++;
    }

    return { 
        root: currentGuess, 
        iterations: maxIterations, 
        error: "Maximum iterations reached.", 
        relativeError: prevGuess !== null ? Math.abs((currentGuess - prevGuess) / (currentGuess || 1)) : 0 
    };
}

function jacobiMethod(tolerance, maxIterations) {
    let A = [
        [3, 1, -1],
        [2, -8, 1],
        [-1, 1, 5]
    ];
    let B = [1, -2, 3];
    let x = [0, 0, 0]; // Initial guess
    let prevX = [...x]; // Store previous iteration values

    let iterations = 0;
    let relativeError = 1;

    while (iterations < maxIterations && relativeError > tolerance) {
        let newX = [...x];

        for (let i = 0; i < A.length; i++) {
            let sum = B[i];

            for (let j = 0; j < A[i].length; j++) {
                if (i !== j) {
                    sum -= A[i][j] * prevX[j];
                }
            }

            newX[i] = sum / A[i][i];
        }

        // Compute relative error
        relativeError = Math.max(
            ...newX.map((val, i) => Math.abs((val - prevX[i]) / (val || 1)))
        );

        prevX = [...newX];
        iterations++;

        if (relativeError < tolerance) break;
    }

    return { solution: prevX, iterations, relativeError };
}

function taylorSeriesApprox(x) {
    const x0 = 0;
    let y = 1; // Initial condition y(0) = 1
    
    // Compute derivatives at x0
    const y1 = (y ** 2) + (x0 ** 2);
    const y2 = 2 * y * y1 + 2 * x0;
    const y3 = 2 * (y1 ** 2) + 2 * y * y2 + 2;
    
    // Taylor series expansion up to the third derivative
    return y + y1 * x + (y2 * x ** 2) / 2 + (y3 * x ** 3) / 6;
}


function f_x(x) {
    return x ** 3;
}

function simpsons38Rule(a, b, n) {
    const h = (b - a) / n;
    let integralSum = f_x(a) + f_x(b);

    for (let i = 1; i < n; i++) {
        const x_i = a + i * h;
        if (i % 3 === 0) {
            integralSum += 2 * f_x(x_i);
        } else {
            integralSum += 3 * f_x(x_i);
        }
    }

    return (3 * h / 8) * integralSum;
}




module.exports = { jacobiMethod };


module.exports = { bisectionMethod, falsePositionMethod, newtonRaphsonMethod , jacobiMethod , taylorSeriesApprox , simpsons38Rule }; // ✅ CORRECT module.exports - exporting all three