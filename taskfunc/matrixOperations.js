// Helper Functions for Matrix Operations

function multiplyMatrices(A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const colsB = B[0].length;
    if (colsA !== B.length) {
        throw new Error("Matrices can't be multiplied: Incompatible dimensions.");
    }

    let result = Array(rowsA).fill(null).map(() => Array(colsB).fill(0));

    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsB; j++) {
            let sum = 0;
            for (let k = 0; k < colsA; k++) {
                sum += A[i][k] * B[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

function scalarMultiplyMatrix(scalar, A) {
    const rowsA = A.length;
    const colsA = A[0].length;
    let result = Array(rowsA).fill(null).map(() => Array(colsA).fill(0));
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            result[i][j] = scalar * A[i][j];
        }
    }
    return result;
}

function subtractMatrices(A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    if (rowsA !== B.length || colsA !== B[0].length) {
        throw new Error("Matrices can't be subtracted: Incompatible dimensions.");
    }
    let result = Array(rowsA).fill(null).map(() => Array(colsA).fill(0));
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            result[i][j] = A[i][j] - B[i][j];
        }
    }
    return result;
}

function identityMatrix(size) {
    let result = Array(size).fill(null).map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        result[i][i] = 1;
    }
    return result;
}

function trace(A) {
    let tr = 0;
    for (let i = 0; i < A.length; i++) {
        tr += A[i][i];
    }
    return tr;
}


// Iterative Matrix Inverse using Schulz Iteration
function iterativeMatrixInverse(A, iterations = 10) { // Default to 10 iterations, can be adjusted
    const size = A.length;

    if (size !== A[0].length) {
        throw new Error("Matrix must be square for inversion.");
    }

    // Initial guess based on trace
    const initialGuessScalar = 1 / trace(A);
    let X = scalarMultiplyMatrix(initialGuessScalar, identityMatrix(size));


    for (let k = 0; k < iterations; k++) {
        const AX = multiplyMatrices(A, X);
        const I_minus_AX = subtractMatrices(identityMatrix(size), AX);
        const termToAdd = scalarMultiplyMatrix(2, identityMatrix(size)); // Create 2I
        const termToAdd_minus_AX = subtractMatrices(termToAdd, AX); // 2I - AX
        const X_next = multiplyMatrices(X, termToAdd_minus_AX); // X_k * (2I - AX_k)

        X = X_next; // Update X for the next iteration
    }

    return X;
}


module.exports = { iterativeMatrixInverse, linearLeastSquaresFit: null, newtonsForwardDifference: null }; // Export iterativeMatrixInverse and keep others as null for now.