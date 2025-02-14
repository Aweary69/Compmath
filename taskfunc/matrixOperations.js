function matrixTrace(A) {
    return A.reduce((sum, row, i) => sum + row[i], 0);
}

function identityMatrix(n) {
    return Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
    );
}

function multiplyMatrices(A, B) {
    let result = A.map(row => Array(B[0].length).fill(0));
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < B[0].length; j++) {
            for (let k = 0; k < A[0].length; k++) {
                result[i][j] += A[i][k] * B[k][j];
            }
        }
    }
    return result.map(row => row.map(val => Number(val.toFixed(10))));
}

function subtractMatrices(A, B) {
    return A.map((row, i) => row.map((val, j) => Number((val - B[i][j]).toFixed(10))));
}

function addMatrices(A, B) {
    return A.map((row, i) => row.map((val, j) => Number((val + B[i][j]).toFixed(10))));
}

function scaleMatrix(A, scalar) {
    return A.map(row => row.map(val => Number((val * scalar).toFixed(10))));
}

function matrixNorm(A) {
    return Math.sqrt(A.flat().reduce((sum, val) => sum + val * val, 0));
}

function isSingular(A) {
    // Determinant check (only works for 3x3)
    let det = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
              A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
              A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
    return Math.abs(det) < 1e-8;
}

function iterativeMatrixInverse(A, tol = 1e-8, maxIter = 500) {
    const n = A.length;
    const I = identityMatrix(n);
    
    if (isSingular(A)) {
        throw new Error("Matrix is singular or nearly singular, cannot compute inverse.");
    }

    const traceA = matrixTrace(A);
    if (traceA === 0) throw new Error("Trace is zero, cannot use this method.");
    
    let B = scaleMatrix(I, 1 / traceA); // Initial guess based on trace

    for (let iter = 0; iter < maxIter; iter++) {
        let E = subtractMatrices(I, multiplyMatrices(A, B)); // Compute error
        let B_new = multiplyMatrices(B, addMatrices(I, scaleMatrix(E, 0.5))); // Damped Newton-Schulz

        if (matrixNorm(E) < tol) {
            return B_new;
        }
        B = B_new;
    }

    return B;
}

module.exports = { iterativeMatrixInverse };
