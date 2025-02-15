/**
 * Solves a system of linear equations Ax = b using the Jacobi iterative method.
 * @param {Array<Array<number>>} A - The coefficient matrix (square matrix).
 * @param {Array<number>} b - The constant terms vector.
 * @param {Array<number>} initialGuess - Initial guess for the solution vector x.
 * @param {number} tolerance - Tolerance for convergence.
 * @param {number} maxIterations - Maximum number of iterations.
 * @returns {{solution: Array<number>, iterations: number, error: string|null}} - Solution vector, number of iterations, and error message (if any).
 */
function jacobiMethod(A, b, initialGuess, tolerance, maxIterations) {
    let x = [...initialGuess]; // Copy initial guess to avoid modification
    let xNext = Array(x.length).fill(0); // Array to store the next iteration's values
    let iterations = 0;
    const n = A.length;

    // Check if matrix A is square
    if (n !== A[0].length) {
        return { solution: null, iterations: 0, error: "Matrix 'A' must be a square matrix." };
    }
    // Check if dimensions of A, x, and b are compatible
    if (b.length !== n || initialGuess.length !== n) {
        return { solution: null, iterations: 0, error: "Dimensions of matrix 'A', vector 'b', and initial guess are not compatible." };
    }

    while (iterations < maxIterations) {
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    sum += A[i][j] * x[j]; // Summation of off-diagonal elements
                }
            }
            // Jacobi iteration formula: xNext[i] = (b[i] - sum) / A[i][i]
            xNext[i] = (b[i] - sum) / A[i][i];

            // Check for division by zero (diagonal element A[i][i] should not be zero)
            if (A[i][i] === 0) {
                return { solution: null, iterations: iterations, error: "Division by zero encountered. Jacobi method requires non-zero diagonal elements." };
            }
        }

        // Check for convergence using Euclidean norm (L2 norm)
        let error = 0;
        for (let i = 0; i < n; i++) {
            error += Math.pow(xNext[i] - x[i], 2);
        }
        error = Math.sqrt(error); // Euclidean norm

        if (error < tolerance) {
            return { solution: xNext, iterations: iterations + 1, error: null }; // Converged
        }

        x = [...xNext]; // Update x for the next iteration
        iterations++;
    }

    return { solution: x, iterations: maxIterations, error: "Maximum iterations reached, solution may not have converged." }; // Not converged within maxIterations
}


module.exports = { jacobiMethod };