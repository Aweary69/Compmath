// homepage_ui.js - Functions related to user interface interactions and display

function generateMatrixInputFields(method) {
    let rowsInputId, colsInputId, containerId;
    if (method === 'inverse') {
        rowsInputId = "matrixRows_inverse";
        colsInputId = "matrixCols_inverse";
        containerId = "matrixInputAreaContainer_inverse";
    } else if (method === 'jacobi') {
        rowsInputId = "matrixRows_jacobi";
        colsInputId = "matrixCols_jacobi";
        containerId = "matrixInputAreaContainer_jacobi";
    } else {
        console.error("Invalid method for generateMatrixInputFields");
        return;
    }

    const rowsInput = document.getElementById(rowsInputId);
    const colsInput = document.getElementById(colsInputId);
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    resetValidationMessage(rowsInputId);
    resetValidationMessage(colsInputId);

    const rows = parseInt(rowsInput.value);
    const cols = parseInt(colsInput.value);

    if (isNaN(rows) || isNaN(cols)) {
        displayValidationMessage(rowsInputId, "Rows must be a number.");
        displayValidationMessage(colsInputId, "Columns must be a number.");
        return;
    }
    if (!Number.isInteger(rows) || !Number.isInteger(cols)) {
        displayValidationMessage(rowsInputId, "Rows must be an integer.");
        displayValidationMessage(colsInputId, "Columns must be an integer.");
        return;
    }
    if (rows < 1 || rows > 5 || cols < 1 || cols > 5) {
        displayValidationMessage(rowsInputId, "Rows must be between 1 and 5.");
        displayValidationMessage(colsInputId, "Columns must be between 1 and 5.");
        return;
    }

    let table = document.createElement('table');
    for (let i = 0; i < rows; i++) {
        let row = table.insertRow();
        for (let j = 0; j < cols; j++) {
            let cell = row.insertCell();
            let input = document.createElement('input');
            input.type = 'number';
            input.classList.add('matrix-input-cell');
            input.id = `${method}-matrix-input-${i}-${j}`;
            cell.appendChild(input);
        }
    }
    container.appendChild(table);

    if (method === 'jacobi') {
        generateVectorBInputFields(rows);
        generateInitialGuessInputFields(rows);
    }
}

function generateVectorBInputFields(size) {
    const container = document.getElementById("vectorBInputAreaContainer_jacobi");
    container.innerHTML = '';
    let table = document.createElement('table');
    let headerRow = table.insertRow();
    let headerCell = document.createElement('th');
    headerCell.textContent = 'Vector b:';
    headerRow.appendChild(headerCell);

    for (let i = 0; i < size; i++) {
        let row = table.insertRow();
        let cell = row.insertCell();
        let input = document.createElement('input');
        input.type = 'number';
        input.id = `jacobi-vector-b-input-${i}`;
        cell.appendChild(input);
    }
    container.appendChild(table);
}

function generateInitialGuessInputFields(size) {
    const container = document.getElementById("initialGuessInputArea_jacobi");
    container.innerHTML = '';
    let table = document.createElement('table');
    let headerRow = table.insertRow();
    let headerCell = document.createElement('th');
    headerCell.textContent = 'Initial Guess x₀:';
    headerRow.appendChild(headerCell);
    for (let i = 0; i < size; i++) {
        let row = table.insertRow();
        let cell = row.insertCell();
        let input = document.createElement('input');
        input.type = 'number';
        input.value = 0;
        input.id = `jacobi-initial-guess-input-${i}`;
        cell.appendChild(input);
    }
    container.appendChild(table);
}

function displayInverseMatrixAsTable(inverseMatrix) {
    const resultArea = document.getElementById("inverseResultArea");
    resultArea.innerHTML = '';
    if (!inverseMatrix || !Array.isArray(inverseMatrix) || inverseMatrix.length === 0) {
        resultArea.innerText = "No inverse matrix to display.";
        return;
    }

    let table = document.createElement('table');
    for (const row of inverseMatrix) {
        let tableRow = table.insertRow();
        for (const cellValue of row) {
            let tableCell = tableRow.insertCell();
            tableCell.textContent = cellValue.toFixed(4);
        }
    }
    resultArea.appendChild(table);
}

function showCalculationSection() {
    const selectedMethod = document.getElementById("methodSelector").value;
    const allSections = document.querySelectorAll('.method-section');
    allSections.forEach(section => section.classList.add('hidden-section'));

    if (selectedMethod) {
        const selectedSection = document.querySelector(`.method-section[data-method="${selectedMethod}"]`);
        if (selectedSection) {
            selectedSection.classList.remove('hidden-section');
            if (selectedMethod === "graphicalRoot") {
                plotFunctionGraph();
            }
        }
    }
}

function displayValidationMessage(inputId, message) {
    let errorSpanId = inputId + "-error";
    let errorSpan = document.getElementById(errorSpanId);
    if (!errorSpan) {
        errorSpan = document.createElement('span');
        errorSpan.id = errorSpanId;
        errorSpan.className = 'validation-error';
        document.getElementById(inputId).parentNode.insertBefore(errorSpan, document.getElementById(inputId).nextSibling);
    }
    errorSpan.innerText = " ❌ " + message;
}

function resetValidationMessage(inputId) {
    let errorSpanId = inputId + "-error";
    let errorSpan = document.getElementById(errorSpanId);
    if (errorSpan) {
        errorSpan.innerText = "";
    }
}

function plotFunctionGraph() {
    const canvas = document.getElementById('functionPlotCanvas');
    const ctx = canvas.getContext('2d');
    const functionInput = document.getElementById('graphicalFunctionInput').value;

    const xValuesForPlot = [];
    const yValuesForPlot = [];

    for (let i = 0; i <= 100; i++) {
        const x = 0 + (1 - 0) * (i / 100);
        let y;
        try {
            y = eval(functionInput.replace(/Math\./g, 'Math.'));
            if (typeof y !== 'number' || isNaN(y)) {
                y = NaN;
            }
        } catch (error) {
            console.error("Function evaluation error:", error);
            y = NaN;
        }
        xValuesForPlot.push(x);
        yValuesForPlot.push(y);
    }

    if (window.functionChart) {
        window.functionChart.destroy();
    }

    window.functionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValuesForPlot,
            datasets: [{
                label: 'f(x) = ' + functionInput,
                data: yValuesForPlot,
                borderColor: 'blue',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: { display: true, text: 'x' }
                },
                y: {
                    title: { display: true, text: 'f(x)' },
                    position: 'left',
                    beginAtZero: false
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false
                },
                zoom: {
                    zoom: {
                        wheel: { enabled: true },
                        pinch: { enabled: true },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    }
                }
            }
        }
    });
}

function displayIterationTable(tableId, iterationDetails) {
    const tableContainer = document.getElementById(tableId);
    tableContainer.innerHTML = '';

    if (!iterationDetails || iterationDetails.length === 0) {
        tableContainer.innerText = "No iteration details to display.";
        return;
    }

    const table = document.createElement('table');
    table.className = 'iteration-table';

    const headerRow = table.insertRow();
    headerRow.insertCell().textContent = 'Iteration';
    headerRow.insertCell().textContent = 'Root Approx.';
    headerRow.insertCell().textContent = 'f(Root Approx.)';
    headerRow.insertCell().textContent = 'Relative Error';

    iterationDetails.forEach(iterData => {
        const dataRow = table.insertRow();
        dataRow.insertCell().textContent = iterData.iteration;
        dataRow.insertCell().textContent = iterData.rootApprox.toFixed(6);
        dataRow.insertCell().textContent = iterData.fValue.toFixed(6);
        dataRow.insertCell().textContent = iterData.relativeError.toFixed(6);
    });

    tableContainer.appendChild(table);
}