/**
 * Helper Functions for Matrix Operations
 */

/**
 * Multiplies two matrices A and B.
 * @param {Array<Array<number>>} A - The first matrix.
 * @param {Array<Array<number>>} B - The second matrix.
 * @returns {Array<Array<number>>} - The result of matrix multiplication.
 * @throws {Error} - If matrices cannot be multiplied due to incompatible dimensions.
 */
function multiplyMatrices(A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const colsB = B[0].length;

    if (colsA !== B.length) {
        throw new Error("Matrices can't be multiplied: Incompatible dimensions.");
    }

    // Initialize result matrix with zeros
    let result = Array(rowsA).fill(null).map(() => Array(colsB).fill(0));

    // Perform matrix multiplication
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

/**
 * Multiplies a matrix A by a scalar.
 * @param {number} scalar - The scalar value.
 * @param {Array<Array<number>>} A - The matrix.
 * @returns {Array<Array<number>>} - The result of scalar multiplication.
 */
function scalarMultiplyMatrix(scalar, A) {
    const rowsA = A.length;
    const colsA = A[0].length;
    // Initialize result matrix with zeros
    let result = Array(rowsA).fill(null).map(() => Array(colsA).fill(0));
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            result[i][j] = scalar * A[i][j];
        }
    }
    return result;
}

/**
 * Subtracts matrix B from matrix A.
 * @param {Array<Array<number>>} A - The first matrix.
 * @param {Array<Array<number>>} B - The second matrix.
 * @returns {Array<Array<number>>} - The result of matrix subtraction (A - B).
 * @throws {Error} - If matrices cannot be subtracted due to incompatible dimensions.
 */
function subtractMatrices(A, B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    if (rowsA !== B.length || colsA !== B[0].length) {
        throw new Error("Matrices can't be subtracted: Incompatible dimensions.");
    }
    // Initialize result matrix with zeros
    let result = Array(rowsA).fill(null).map(() => Array(colsA).fill(0));
    for (let i = 0; i < rowsA; i++) {
        for (let j = 0; j < colsA; j++) {
            result[i][j] = A[i][j] - B[i][j];
        }
    }
    return result;
}

/**
 * Creates an identity matrix of a given size.
 * @param {number} size - The size of the identity matrix (size x size).
 * @returns {Array<Array<number>>} - The identity matrix.
 */
function identityMatrix(size) {
    // Initialize matrix with zeros
    let result = Array(size).fill(null).map(() => Array(size).fill(0));
    for (let i = 0; i < size; i++) {
        result[i][i] = 1; // Set diagonal elements to 1
    }
    return result;
}

/**
 * Calculates the trace of a square matrix.
 * @param {Array<Array<number>>} A - The square matrix.
 * @returns {number} - The trace of the matrix.
 */
function trace(A) {
    let tr = 0;
    for (let i = 0; i < A.length; i++) {
        tr += A[i][i]; // Sum of diagonal elements
    }
    return tr;
}


/**
 * Iteratively computes the inverse of a matrix A using Schulz iteration.
 * @param {Array<Array<number>>} A - The square matrix to be inverted.
 * @param {number} [iterations=10] - The number of iterations for the Schulz method.
 * @returns {Array<Array<number>>} - The approximate inverse matrix.
 * @throws {Error} - If the matrix is not square.
 */
function iterativeMatrixInverse(A, iterations = 10) {
    const size = A.length;

    if (size !== A[0].length) {
        throw new Error("Matrix must be square for inversion.");
    }

    // Initial guess for inverse, scaled by the trace of A
    const initialGuessScalar = 1 / trace(A);
    let X = scalarMultiplyMatrix(initialGuessScalar, identityMatrix(size));


    for (let k = 0; k < iterations; k++) {
        const AX = multiplyMatrices(A, X);
        const I_minus_AX = subtractMatrices(identityMatrix(size), AX);
        const termToAdd_minus_AX = subtractMatrices(scalarMultiplyMatrix(2, identityMatrix(size)), AX); // 2I - AX
        const X_next = multiplyMatrices(X, termToAdd_minus_AX); // X_(k+1) = X_k * (2I - AX_k)

        X = X_next; // Update inverse approximation
    }

    return X; // Return the iteratively approximated inverse
}


module.exports = { iterativeMatrixInverse };