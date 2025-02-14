const express = require("express");
const router = express.Router();
const { iterativeMatrixInverse } = require("../taskfunc/matrixOperations");
const { linearLeastSquaresFit } = require("../taskfunc/curveFitting");
const { newtonsForwardDifference } = require("../taskfunc/firstDerivative");
const { bisectionMethod, falsePositionMethod, newtonRaphsonMethod } = require("../taskfunc/rootFinding"); // ✅ Import all three root-finding methods

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
        res.json({ root: result.root, iterations: result.iterations, relativeError: result.relativeError });
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
        res.json({ root: result.root, iterations: result.iterations, relativeError: result.relativeError });
    } catch (error) {
        res.status(500).json({ error: "Server error during Newton-Raphson Method: " + error.message });
    }
});

module.exports = router;