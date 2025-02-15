const express = require("express");
const router = express.Router();
const { iterativeMatrixInverse } = require("../taskfunc/matrixOperations");
const { linearLeastSquaresFit } = require("../taskfunc/curveFitting");
const { newtonsForwardDifference } = require("../taskfunc/firstDerivative");
const { bisectionMethod, falsePositionMethod, newtonRaphsonMethod } = require("../taskfunc/rootFinding");
const { jacobiMethod } = require("../taskfunc/jacobiMethod");
const { taylorSeriesApprox } = require("../taskfunc/taylorSeries");
const { f_x_task8, simpsons38Rule } = require("../taskfunc/simpsonsRule"); 

// Matrix Inversion Route
router.post("/inverse", (req, res) => {
    try {
        const A = req.body.matrix;
        const inverse = iterativeMatrixInverse(A);
        res.json({ inverse });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Curve Fitting Route
router.post("/curve-fit", (req, res) => {
    const points = req.body.points;
    if (!points || !Array.isArray(points)) {
        return res.status(400).json({ error: "Invalid input. Expected an array of points." });
    }
    const { slope, intercept } = linearLeastSquaresFit(points);
    res.json({ slope, intercept });
});

// First Derivative Route
router.post("/first-derivative", (req, res) => {
    try {
        const { x, y, targetX } = req.body;
        if (!Array.isArray(x) || !Array.isArray(y) || typeof targetX !== "number") {
            return res.status(400).json({ error: "Invalid input format." });
        }
        const result = newtonsForwardDifference(x, y, targetX);
        res.json({ derivative: result });
    } catch (error) {
        res.status(500).json({ error: "Server error: " + error.message });
    }
});

// Bisection Method Route
router.post("/bisection-root", (req, res) => {
    try {
        const { a, b, tolerance, maxIterations } = req.body;
        const func = (x) => Math.cos(x) - x;
        const result = bisectionMethod(func, parseFloat(a), parseFloat(b), parseFloat(tolerance), parseInt(maxIterations));
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.json({ root: result.root, iterations: result.iterations });
    } catch (error) {
        res.status(500).json({ error: "Server error during Bisection Method: " + error.message });
    }
});

// False Position Method Route
router.post("/false-position-root", (req, res) => {
    try {
        const { a, b, tolerance, maxIterations } = req.body;
        const func = (x) => Math.pow(x, 2) - 4 * Math.sin(x);
        const result = falsePositionMethod(func, parseFloat(a), parseFloat(b), parseFloat(tolerance), parseInt(maxIterations));
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        res.json({ root: result.root, iterations: result.iterations, relativeError: result.relativeError, iterationDetails: result.iterationDetails }); // Send iterationDetails
    } catch (error) {
        res.status(500).json({ error: "Server error during False Position Method: " + error.message });
    }
});

// Newton-Raphson Method Route
router.post("/newton-raphson-root", (req, res) => {
    try {
        const { initialGuess, tolerance, maxIterations } = req.body;
        const func = (x) => Math.pow(x, 2) - 4 * Math.sin(x);
        const funcDerivative = (x) => 2 * x - 4 * Math.cos(x);
        const result = newtonRaphsonMethod(func, funcDerivative, parseFloat(initialGuess), parseFloat(tolerance), parseInt(maxIterations));
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }

        console.log("Newton-Raphson Result from Backend:", result);  // ADD THIS LINE

        res.json({ root: result.root, iterations: result.iterations, relativeError: result.relativeError, iterationDetails: result.iterationDetails });
    } catch (error) {
        res.status(500).json({ error: "Server error during Newton-Raphson Method: " + error.message });
    }
});


// Jacobi Method Route (Task 3)
router.post("/jacobi-solve", (req, res) => {
    try {
        const { matrixA, vectorB, initialGuess, tolerance, maxIterations } = req.body;

        // Convert inputs from strings to numbers
        const A = matrixA.map(row => row.map(Number));
        const b = vectorB.map(Number);
        const x0 = initialGuess.map(Number);

        // Input validation (basic)
        if (!Array.isArray(A) || !Array.isArray(b) || !Array.isArray(x0) || A.length !== 3 || A[0].length !== 3 || b.length !== 3 || x0.length !== 3 || isNaN(tolerance) || isNaN(maxIterations)) {
            return res.status(400).json({ error: "Invalid input format for Jacobi Method." });
        }

        const result = jacobiMethod(A, b, x0, parseFloat(tolerance), parseInt(maxIterations));

        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        // Format solution to 6 decimal places for display
        res.json({ solution: result.solution.map(val => val.toFixed(6)), iterations: result.iterations });
    } catch (error) {
        res.status(500).json({ error: "Server error during Jacobi Method: " + error.message });
    }
});

module.exports = router;