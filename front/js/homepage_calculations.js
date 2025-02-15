// homepage_calculations.js - Functions related to numerical computations

async function initiateInverseComputation() {
    const rows = parseInt(document.getElementById("matrixRows_inverse").value);
    const cols = parseInt(document.getElementById("matrixCols_inverse").value);
    let matrix = [];
    let isValidMatrix = true;
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            const inputElement = document.getElementById(`inverse-matrix-input-${i}-${j}`);
            const inputValue = parseFloat(inputElement.value);
            resetValidationMessage(inputElement.id);
            if (isNaN(inputValue)) {
                displayValidationMessage(inputElement.id, "Must be a number.");
                isValidMatrix = false;
            }
            row.push(inputValue);
        }
        matrix.push(row);
    }

    if (!isValidMatrix) return;
    if (matrix.length === 0 || matrix[0].length === 0) {
        alert("Please generate a matrix to compute the inverse.");
        return;
    }

    const serverResponse = await fetch("/math/inverse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matrix })
    });

    const processedData = await serverResponse.json();

    if (processedData.inverse) {
        displayInverseMatrixAsTable(processedData.inverse);
    } else {
        document.getElementById("inverseResultArea").innerText = "❌ Error: " + processedData.error;
    }
}

async function commenceCurveFitting() {
    const inputPointsText = document.getElementById("pointsInputArea").value;
    resetValidationMessage("pointsInputArea");
    const pointsData = inputPointsText.trim().split(" ").map(p => p.split(",").map(Number));

    if (inputPointsText.trim() === "") {
        displayValidationMessage("pointsInputArea", "Please enter data points.");
        return;
    }

    for (let i = 0; i < pointsData.length; i++) {
        const point = pointsData[i];
        if (point.length !== 2) {
            displayValidationMessage("pointsInputArea", "Invalid point format at point " + (i + 1) + ". Use format: x,y x,y ...");
            return;
        }
        if (isNaN(point[0]) || isNaN(point[1])) {
            displayValidationMessage("pointsInputArea", "Non-numeric value in point " + (i + 1) + ". Use format: x,y x,y ...");
            return;
        }
    }

    const serverResponse = await fetch("/math/curve-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: pointsData })
    });

    const analysisResult = await serverResponse.json();

    if (analysisResult.error) {
        document.getElementById("curveFitResultArea").innerText = "❌ Error: " + analysisResult.error;
    } else {
        document.getElementById("curveFitResultArea").innerText =
            `✅ Best-fit line: y = ${analysisResult.slope.toFixed(4)}x + ${analysisResult.intercept.toFixed(4)}`;
    }
}

async function calculateDerivativeValue() {
    const xInputString = document.getElementById("xValuesInput").value.trim();
    const yInputString = document.getElementById("yValuesInput").value.trim();
    const targetXInputValue = document.getElementById("targetXValue").value;

    resetValidationMessage("xValuesInput");
    resetValidationMessage("yValuesInput");
    resetValidationMessage("targetXValue");

    if (xInputString.trim() === "" || yInputString.trim() === "" || targetXInputValue.trim() === "") {
        if (xInputString.trim() === "") displayValidationMessage("xValuesInput", "Please enter x values.");
        if (yInputString.trim() === "") displayValidationMessage("yValuesInput", "Please enter y values.");
        if (targetXInputValue.trim() === "") displayValidationMessage("targetXValue", "Please enter target x value.");
        return;
    }

    const xValueArray = xInputString.split(",").map(num => parseFloat(num));
    const yValueArray = yInputString.split(",").map(num => parseFloat(num));
    const targetXValue = parseFloat(targetXInputValue);

    if (xValueArray.some(isNaN)) {
        displayValidationMessage("xValuesInput", "Invalid x value(s). Must be comma-separated numbers.");
        return;
    }
    if (yValueArray.some(isNaN)) {
        displayValidationMessage("yValuesInput", "Invalid y value(s). Must be comma-separated numbers.");
        return;
    }
    if (isNaN(targetXValue)) {
        displayValidationMessage("targetXValue", "Target x must be a number.");
        return;
    }
    if (xValueArray.length !== yValueArray.length) {
        displayValidationMessage("yValuesInput", "Number of y values must match number of x values.");
        return;
    }

    try {
        const serverResponse = await fetch("/math/first-derivative", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ x: xValueArray, y: yValueArray, targetX: targetXValue })
        });

        const rawResponseText = await serverResponse.text();
        console.log("Raw response:", rawResponseText);

        const derivativeData = JSON.parse(rawResponseText);
        console.log("Parsed data:", derivativeData);

        document.getElementById("derivativeResultArea").innerText = `Derivative at x=${targetXValue}: ${derivativeData.derivative}`;
    } catch (errorInfo) {
        console.error("Error:", errorInfo);
        document.getElementById("derivativeResultArea").innerText = "Error computing derivative.";
    }
}

async function computeNumericalRoot() {
    const a = document.getElementById("bisectionA").value;
    const b = document.getElementById("bisectionB").value;
    const tolerance = document.getElementById("bisectionTolerance").value;
    const maxIterations = document.getElementById("bisectionMaxIter").value;
    const graphicalApproxRoot = parseFloat(document.getElementById("graphicalRootApprox").value) || 0.74;
    const functionInput = document.getElementById('graphicalFunctionInput').value;

    if (isNaN(a) || isNaN(b) || isNaN(tolerance) || isNaN(maxIterations)) {
        alert("Please enter valid numbers for interval, tolerance, and max iterations.");
        return;
    }

    const func = (x) => {
        try {
            let y = eval(functionInput.replace(/Math\./g, 'Math.'));
            if (typeof y !== 'number' || isNaN(y)) return NaN;
            return y;
        } catch (error) {
            console.error("Function evaluation error:", error);
            return NaN;
        }
    };

    try {
        const response = await fetch("/math/bisection-root", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ a, b, tolerance, maxIterations })
        });

        const data = await response.json();

        if (response.ok) {
            const numericalRoot = data.root;
            const iterations = data.iterations;

            document.getElementById("numericalRootResult").innerText = numericalRoot.toFixed(6) + ` (Iterations: ${iterations})`;

            const absoluteError = Math.abs(numericalRoot - graphicalApproxRoot);
            document.getElementById("graphicalRootError").innerText = absoluteError.toFixed(6);
        } else {
            document.getElementById("numericalRootResult").innerText = "Error: " + data.error;
            document.getElementById("graphicalRootError").innerText = "N/A";
        }

    } catch (error) {
        console.error("Error calling bisection route:", error);
        document.getElementById("numericalRootResult").innerText = "Error computing numerical root.";
        document.getElementById("graphicalRootError").innerText = "N/A";
    }
}

async function computeFalsePositionRoot() {
    const a = document.getElementById("falsePositionA").value;
    const b = document.getElementById("falsePositionB").value;
    const tolerance = document.getElementById("falsePositionTolerance").value;
    const maxIterations = document.getElementById("falsePositionMaxIter").value;

    if (isNaN(a) || isNaN(b) || isNaN(tolerance) || isNaN(maxIterations)) {
        alert("Please enter valid numbers for interval, tolerance, and max iterations for False Position.");
        return;
    }

    try {
        const response = await fetch("/math/false-position-root", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ a, b, tolerance, maxIterations })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("falsePositionRootResult").innerText = data.root.toFixed(6);
            document.getElementById("falsePositionIterations").innerText = data.iterations;
            document.getElementById("falsePositionRelativeError").innerText = data.relativeError.toFixed(6);

            displayIterationTable('falsePositionIterationTable', data.iterationDetails);
        } else {
            document.getElementById("falsePositionRootResult").innerText = "Error: " + data.error;
            document.getElementById("falsePositionIterations").innerText = "N/A";
            document.getElementById("falsePositionRelativeError").innerText = "N/A";
            document.getElementById('falsePositionIterationTable').innerHTML = '';
        }

    } catch (error) {
        console.error("Error calling false position route:", error);
        document.getElementById("falsePositionRootResult").innerText = "Error computing root.";
        document.getElementById("falsePositionIterations").innerText = "N/A";
        document.getElementById("falsePositionRelativeError").innerText = "N/A";
        document.getElementById('falsePositionIterationTable').innerHTML = '';
    }
}

async function computeNewtonRaphsonRoot() {
    const initialGuess = document.getElementById("newtonRaphsonInitialGuess").value;
    const tolerance = document.getElementById("newtonRaphsonTolerance").value;
    const maxIterations = document.getElementById("newtonRaphsonMaxIter").value;

    if (isNaN(initialGuess) || isNaN(tolerance) || isNaN(maxIterations)) {
        alert("Please enter valid numbers for initial guess, tolerance, and max iterations for Newton-Raphson.");
        return;
    }

    try {
        const response = await fetch("/math/newton-raphson-root", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ initialGuess, tolerance, maxIterations })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("newtonRaphsonRootResult").innerText = data.root.toFixed(6);
            document.getElementById("newtonRaphsonIterations").innerText = data.iterations;
            document.getElementById("newtonRaphsonRelativeError").innerText = data.relativeError.toFixed(6);

            displayIterationTable('newtonRaphsonIterationTable', data.iterationDetails);
        } else {
            document.getElementById("newtonRaphsonRootResult").innerText = "Error: " + data.error;
            document.getElementById("newtonRaphsonIterations").innerText = "N/A";
            document.getElementById("newtonRaphsonRelativeError").innerText = "N/A";
            document.getElementById('newtonRaphsonIterationTable').innerHTML = '';
        }

    } catch (error) {
        console.error("Error calling newton raphson route:", error);
        document.getElementById("newtonRaphsonRootResult").innerText = "Error computing root.";
        document.getElementById("newtonRaphsonIterations").innerText = "N/A";
        document.getElementById("newtonRaphsonRelativeError").innerText = "N/A";
        document.getElementById('newtonRaphsonIterationTable').innerHTML = '';
    }
}

async function computeJacobiSolution() {
    const rows = parseInt(document.getElementById("matrixRows_jacobi").value);
    const cols = parseInt(document.getElementById("matrixCols_jacobi").value);
    let matrixA = [];
    let vectorB = [];
    let initialGuess = [];
    let isValidMatrix = true;

    for (let i = 0; i < rows; i++) {
        let matrixRow = [];
        for (let j = 0; j < cols; j++) {
            const inputElement = document.getElementById(`jacobi-matrix-input-${i}-${j}`);
            const inputValue = parseFloat(inputElement.value);
            resetValidationMessage(inputElement.id);
            if (isNaN(inputValue)) {
                displayValidationMessage(inputElement.id, "Matrix value must be a number.");
                isValidMatrix = false;
            }
            matrixRow.push(inputValue);
        }
        matrixA.push(matrixRow);

        const vectorBInputElement = document.getElementById(`jacobi-vector-b-input-${i}`);
        const vectorBValue = parseFloat(vectorBInputElement.value);
        resetValidationMessage(vectorBInputElement.id);
        if (isNaN(vectorBValue)) {
            displayValidationMessage(vectorBInputElement.id, "Vector b value must be a number.");
            isValidMatrix = false;
        }
        vectorB.push(vectorBValue);

        const initialGuessInputElement = document.getElementById(`jacobi-initial-guess-input-${i}`);
        const initialGuessValue = parseFloat(initialGuessInputElement.value);
        resetValidationMessage(initialGuessInputElement.id);
        if (isNaN(initialGuessValue)) {
            displayValidationMessage(initialGuessInputElement.id, "Initial guess value must be a number.");
            isValidMatrix = false;
        }
        initialGuess.push(initialGuessValue);
    }

    const tolerance = document.getElementById("jacobiTolerance").value;
    const maxIterations = document.getElementById("jacobiMaxIter").value;

    if (!isValidMatrix) return;

    try {
        const response = await fetch("/math/jacobi-solve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matrixA, vectorB, initialGuess, tolerance, maxIterations })
        });

        const data = await response.json();

        if (response.ok) {
            let solutionText = "";
            for (let i = 0; i < data.solution.length; i++) {
                solutionText += `x${i + 1}: ${data.solution[i]}, `;
            }
            document.getElementById("jacobiSolutionArea").innerText = solutionText.slice(0, -2);

            document.getElementById("jacobiIterations").innerText = data.iterations;
        } else {
            document.getElementById("jacobiSolutionArea").innerText = "Error: " + data.error;
            document.getElementById("jacobiIterations").innerText = "N/A";
        }

    } catch (error) {
        console.error("Error calling jacobi solve route:", error);
        document.getElementById("jacobiSolutionArea").innerText = "Error computing solution.";
        document.getElementById("jacobiIterations").innerText = "N/A";
    }
}


function computeTaylorSeriesValues() {
    const y_0_1 = taylorSeriesApprox(0.1);
    const y_0_2 = taylorSeriesApprox(0.2);

    document.getElementById('taylor_y_0_1').innerText = y_0_1.toFixed(6);
    document.getElementById('taylor_y_0_2').innerText = y_0_2.toFixed(6);
}

function computeSimpsons38Rule() {
    const a = 2;
    const b = 5;
    const n = 6;

    const approximateValue = simpsons38Rule(f_x_task8, a, b, n);
    const exactValue = 304.5;
    const absoluteError = Math.abs(exactValue - approximateValue);

    document.getElementById('simpson_approx_value').innerText = approximateValue.toFixed(6);
    document.getElementById('simpson_exact_value').innerText = exactValue.toFixed(6);
    document.getElementById('simpson_absolute_error').innerText = absoluteError.toFixed(6);
}