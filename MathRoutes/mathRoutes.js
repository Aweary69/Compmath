const express = require("express");
const router = express.Router();
const { iterativeMatrixInverse } = require("../taskfunc/matrixOperations");
const { linearLeastSquaresFit } = require("../taskfunc/curveFitting");
const { newtonsForwardDifference } = require("../taskfunc/firstDerivative"); // ✅ Import first derivative function

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

// ✅ First Derivative Route (Newton’s Forward Difference)
// ✅ First Derivative Route
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


module.exports = router;
