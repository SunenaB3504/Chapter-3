console.log("Lattice script loaded!");

 // --- Helper ---
if (typeof window.getRandomInt !== 'function') {
    console.error("getRandomInt function not found on window object!");
    window.getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Game Elements --- UPDATED Selectors/IDs
// Numbers
const num1d1El = document.getElementById('lattice-num1-d1');
const num1d2El = document.getElementById('lattice-num1-d2');
const num2d1El = document.getElementById('lattice-num2-d1'); // ID matches HTML
const num2d2El = document.getElementById('lattice-num2-d2'); // ID matches HTML
// Cell Inputs (Tens and Ones) - IDs remain the same
const cellInputs = {};
for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 2; c++) {
        cellInputs[`${r}-${c}-t`] = document.getElementById(`cell-${r}-${c}-t`);
        cellInputs[`${r}-${c}-o`] = document.getElementById(`cell-${r}-${c}-o`);
    }
}
// Diagonal Sum Inputs - IDs remain the same
const diagSumInputs = [
    document.getElementById('diag-sum-0'), // bottom-right
    document.getElementById('diag-sum-1'),
    document.getElementById('diag-sum-2'),
    document.getElementById('diag-sum-3')  // top-left
];
// Final Answer - ID remains the same
const finalAnswerInput = document.getElementById('final-answer-lattice');
// Buttons & Feedback - IDs remain the same
const checkButton = document.getElementById('check-lattice-button');
const newButton = document.getElementById('new-lattice-button');
const feedbackEl = document.getElementById('feedback-lattice');
// Hint Elements - IDs remain the same
const showHintButton = document.getElementById('show-hint-lattice-button');
const prevHintButton = document.getElementById('prev-hint-lattice-button');
const nextHintButton = document.getElementById('next-hint-lattice-button');
const hintArea = document.getElementById('hint-area-lattice');
const hintTextEl = document.getElementById('hint-text-lattice');

// --- Game State ---
let num1 = 0, num2 = 0;
let n1d1 = 0, n1d2 = 0, n2d1 = 0, n2d2 = 0; // Digits
let cellProducts = {}; // Store correct { tens: t, ones: o } for each cell
let diagSumsCorrect = []; // Store correct diagonal sums (digits only, after carry)
let finalAnswerCorrect = 0;
let hints = [];
let currentHintStep = -1;
let attempted = false;

// --- Functions ---

function generateProblem() {
    num1 = window.getRandomInt(10, 99); // Number for the TOP
    num2 = window.getRandomInt(10, 99); // Number for the RIGHT SIDE
    finalAnswerCorrect = num1 * num2;

    // Digits for TOP number (num1)
    n1d1 = Math.floor(num1 / 10);
    n1d2 = num1 % 10;
    // Digits for RIGHT SIDE number (num2)
    n2d1 = Math.floor(num2 / 10);
    n2d2 = num2 % 10;

    // Display numbers - Assign num1 digits to TOP, num2 digits to SIDE
    if(num1d1El) num1d1El.textContent = n1d1; // Top-Left
    if(num1d2El) num1d2El.textContent = n1d2; // Top-Right
    if(num2d1El) num2d1El.textContent = n2d1; // Side-Top
    if(num2d2El) num2d2El.textContent = n2d2; // Side-Bottom

    // Calculate correct cell products
    const productsRaw = [
        [n1d1 * n2d1, n1d2 * n2d1], // Row 0 (Top num * Top digit of bottom num)
        [n1d1 * n2d2, n1d2 * n2d2]  // Row 1 (Top num * Bottom digit of bottom num)
    ];
    cellProducts = {};
     for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
            const p = productsRaw[r][c];
            cellProducts[`${r}-${c}`] = { tens: Math.floor(p / 10), ones: p % 10 };
        }
    }

    // Calculate correct diagonal sums (with carry) - Let's re-verify this logic
    const sumsRaw = [0, 0, 0, 0]; // 4 diagonals from bottom-right to top-left
    sumsRaw[0] = cellProducts['1-1'].ones; // Diag 0 (Bottom-Right cell, ones digit)
    sumsRaw[1] = cellProducts['1-0'].ones + cellProducts['1-1'].tens + cellProducts['0-1'].ones; // Diag 1
    sumsRaw[2] = cellProducts['0-0'].ones + cellProducts['1-0'].tens + cellProducts['0-1'].tens; // Diag 2
    sumsRaw[3] = cellProducts['0-0'].tens; // Diag 3 (Top-Left cell, tens digit)

    diagSumsCorrect = []; // Stores the final digits written down for each diagonal sum
    let carry = 0;
    for (let i = 0; i < 4; i++) {
        const currentSum = sumsRaw[i] + carry;
        diagSumsCorrect.push(currentSum % 10); // Store the ones digit
        carry = Math.floor(currentSum / 10); // Calculate the carry for the next diagonal
    }
    // Note: The final answer might have more digits if the last carry is > 0.
    // diagSumsCorrect holds the digits [d0, d1, d2, d3] corresponding to the 4 input boxes.

    // Clear inputs
    for (const key in cellInputs) {
        if (cellInputs[key]) cellInputs[key].value = '';
    }
    diagSumInputs.forEach(input => { if(input) input.value = ''; });
    if(finalAnswerInput) finalAnswerInput.value = '';
    if(feedbackEl) feedbackEl.textContent = '';
    attempted = false;
    resetHint();

    // Define Hints - VERIFIED for SVG layout and placement
    hints = [
        `Step 1: Draw a 2x2 grid. Write the first number (${num1}) on top... Write the second number (${num2}) on the right side... Diagonals are drawn from top-right to bottom-left in each cell.`,
        `Step 2: Focus on the top-left cell. Multiply the digit above it (${n1d1}) by the digit to its right (${n2d1}). Product is ${n1d1 * n2d1}. Write the tens digit (${cellProducts['0-0'].tens}) in the **top-left** triangle and the ones digit (${cellProducts['0-0'].ones}) in the **bottom-right** triangle.`,
        `Step 3: Focus on the top-right cell. Multiply the digit above it (${n1d2}) by the digit to its right (${n2d1}). Product is ${n1d2 * n2d1}. Write tens (${cellProducts['0-1'].tens}) in the **top-left** triangle and ones (${cellProducts['0-1'].ones}) in the **bottom-right** triangle.`,
        `Step 4: Focus on the bottom-left cell. Multiply the digit above it (${n1d1}) by the digit to its right (${n2d2}). Product is ${n1d1 * n2d2}. Write tens (${cellProducts['1-0'].tens}) in the **top-left** triangle and ones (${cellProducts['1-0'].ones}) in the **bottom-right** triangle.`,
        `Step 5: Focus on the bottom-right cell. Multiply the digit above it (${n1d2}) by the digit to its right (${n2d2}). Product is ${n1d2 * n2d2}. Write tens (${cellProducts['1-1'].tens}) in the **top-left** triangle and ones (${cellProducts['1-1'].ones}) in the **bottom-right** triangle.`,
        `Step 6: Now, sum the diagonals, starting from the bottom right. The first diagonal only has the ones digit ${cellProducts['1-1'].ones}. Write this sum (${diagSumsCorrect[0]}) below the grid.`,
        `Step 7: Sum the next diagonal (going up and left): ${cellProducts['1-0'].ones} + ${cellProducts['1-1'].tens} + ${cellProducts['0-1'].ones} = ${sumsRaw[1]}. Write the ones digit (${diagSumsCorrect[1]}) and carry over the tens (${Math.floor(sumsRaw[1]/10)}).`,
        `Step 8: Sum the next diagonal: ${cellProducts['0-0'].ones} + ${cellProducts['1-0'].tens} + ${cellProducts['0-1'].tens} + (carry ${Math.floor(sumsRaw[1]/10)}) = ${sumsRaw[2] + Math.floor(sumsRaw[1]/10)}. Write the ones digit (${diagSumsCorrect[2]}) and carry over the tens (${Math.floor((sumsRaw[2] + Math.floor(sumsRaw[1]/10))/10)}).`,
        `Step 9: Sum the last diagonal (top left): ${cellProducts['0-0'].tens} + (carry ${Math.floor((sumsRaw[2] + Math.floor(sumsRaw[1]/10))/10)}) = ${sumsRaw[3] + Math.floor((sumsRaw[2] + Math.floor(sumsRaw[1]/10))/10)}. Write this sum (${diagSumsCorrect[3]}).`,
        `Step 10: Read the final answer from the diagonal sums, starting from the top-left sum and going down and right: ${finalAnswerCorrect}.`
    ];
}

function checkAnswer() {
    let cellCorrectCount = 0;
    let diagCorrectCount = 0;
    let finalCorrect = false;
    let awardedPoints = 0;

    // --- Add Detailed Logging ---
    console.log("--- Checking Lattice Answer ---");
    console.log(`Problem: ${num1} x ${num2}`);
    console.log("Expected Cell Products:", cellProducts);
    console.log("Expected Diagonal Sum Digits (d0, d1, d2, d3):", diagSumsCorrect);
    console.log("Expected Final Answer:", finalAnswerCorrect);
    // --- End Logging ---

    // Check cell products
    for (let r = 0; r < 2; r++) {
        for (let c = 0; c < 2; c++) {
            const userT = parseInt(cellInputs[`${r}-${c}-t`].value);
            const userO = parseInt(cellInputs[`${r}-${c}-o`].value);
            const correct = cellProducts[`${r}-${c}`];
            if (userT === correct.tens && userO === correct.ones) {
                cellCorrectCount++;
            }
        }
    }
    console.log(`Cell Correct Count: ${cellCorrectCount}`); // Log count

    // Check diagonal sums (digits written down)
    console.log("Checking Diagonal Sums:"); // Log section start
    for (let i = 0; i < 4; i++) {
        const userInputElement = diagSumInputs[i];
        // Ensure element exists before accessing value
        if (!userInputElement) {
            console.error(`Diagonal sum input element ${i} not found!`);
            continue;
        }
        const userSumStr = userInputElement.value;
        const userSum = parseInt(userSumStr);
        const correctSumDigit = diagSumsCorrect[i];

        // Explicitly check for empty input which parseInt turns into NaN
        if (userSumStr.trim() === '') {
             console.log(`Diag[${i}]: User=EMPTY | Correct=${correctSumDigit} | Correct? false`);
        } else if (isNaN(userSum)) {
            console.log(`Diag[${i}]: User=NaN ('${userSumStr}') | Correct=${correctSumDigit} | Correct? false`);
        } else if (userSum === correctSumDigit) {
            console.log(`Diag[${i}]: User=${userSum} | Correct=${correctSumDigit} | Correct? true`);
            diagCorrectCount++;
        } else {
            console.log(`Diag[${i}]: User=${userSum} | Correct=${correctSumDigit} | Correct? false`);
        }
    }
    console.log(`Diagonal Correct Count: ${diagCorrectCount}`); // Log count

    // Check final answer
    const finalUser = parseInt(finalAnswerInput.value);
    finalCorrect = finalUser === finalAnswerCorrect;
    console.log(`Final Answer: User=${finalUser} | Correct=${finalAnswerCorrect} | Correct? ${finalCorrect}`); // Log final check

    // Feedback and Scoring
    if (cellCorrectCount === 4 && diagCorrectCount === 4 && finalCorrect) {
        if (!attempted) {
            awardedPoints = 20; // High points for getting everything right
            updateScore(awardedPoints);
            feedbackEl.textContent = `Amazing! Lattice Master! ✨ (+${awardedPoints} points!)`;
        } else {
            feedbackEl.textContent = 'Amazing! Lattice Master! ✨';
        }
        feedbackEl.className = 'feedback-message feedback-correct';
    } else {
        let message = 'Keep trying! ';
        if (cellCorrectCount < 4) message += `Check the products in the cells (${cellCorrectCount}/4 correct). `;
        // Give specific feedback if diagonals are wrong but final answer is right
        if (diagCorrectCount < 4 && finalCorrect) {
             message += `The final answer is right, but check the diagonal sums carefully (${diagCorrectCount}/4 correct). `;
        } else if (diagCorrectCount < 4) {
             message += `Check the diagonal sums (${diagCorrectCount}/4 correct). `;
        }
        if (!finalCorrect) message += `Check the final answer. `;
        feedbackEl.textContent = message + 'Maybe use the hint? 🤔';
        feedbackEl.className = 'feedback-message feedback-incorrect';
    }
    attempted = true;
}


// --- Hint Functions (Copied and adapted from 2digit.js) ---
function resetHint() {
    currentHintStep = -1;
    if(hintArea) hintArea.style.display = 'none';
    if(hintTextEl) hintTextEl.textContent = '';
    if(showHintButton) showHintButton.style.display = 'inline-block';
    if(prevHintButton) prevHintButton.style.display = 'none';
    if(nextHintButton) nextHintButton.style.display = 'none';
}

function showHint() {
    if (!hints.length) return;
    currentHintStep = 0;
    displayHintStep();
    if(hintArea) hintArea.style.display = 'block';
    if(showHintButton) showHintButton.style.display = 'none';
    updateHintButtons();
}

function nextHintStep() {
    if (currentHintStep < hints.length - 1) {
        currentHintStep++;
        displayHintStep();
        updateHintButtons();
    }
}

function prevHintStep() {
     if (currentHintStep > 0) {
        currentHintStep--;
        displayHintStep();
        updateHintButtons();
    }
}

function displayHintStep() {
    if (hintTextEl && hints[currentHintStep]) {
        hintTextEl.textContent = `Hint ${currentHintStep + 1}/${hints.length}: ${hints[currentHintStep]}`;
    }
}

function updateHintButtons() {
    if(prevHintButton) prevHintButton.style.display = (currentHintStep > 0) ? 'inline-block' : 'none';
    if(nextHintButton) nextHintButton.style.display = (currentHintStep < hints.length - 1) ? 'inline-block' : 'none';
}

// --- Diagnostic Function (Optional - can be removed if visuals are correct) ---
function diagnoseLatticeStyles() {
    console.log("--- Diagnosing Lattice Styles ---");
    const interactiveCell = document.querySelector('.lattice-cell');
    const staticCell = document.querySelector('.static-lattice-cell');

    if (interactiveCell) {
        const svgLine = interactiveCell.querySelector('svg line');
        if (svgLine) {
            console.log("Interactive Cell SVG Line attributes:", { x1: svgLine.getAttribute('x1'), y1: svgLine.getAttribute('y1'), x2: svgLine.getAttribute('x2'), y2: svgLine.getAttribute('y2') });
        } else {
            console.warn("Could not find SVG line in interactive cell.");
        }
    } else {
        console.error("Could not find an element with class '.lattice-cell' for diagnosis.");
    }
     if (staticCell) {
        const svgLine = staticCell.querySelector('svg line');
        if (svgLine) {
            console.log("Static Cell SVG Line attributes:", { x1: svgLine.getAttribute('x1'), y1: svgLine.getAttribute('y1'), x2: svgLine.getAttribute('x2'), y2: svgLine.getAttribute('y2') });
        } else {
            console.warn("Could not find SVG line in static cell.");
        }
    } else {
        console.error("Could not find an element with class '.static-lattice-cell' for diagnosis.");
    }
    console.log("--- End Diagnosis ---");
}


// --- Event Listeners ---
if(checkButton) checkButton.addEventListener('click', checkAnswer);
if(newButton) newButton.addEventListener('click', generateProblem);
if(showHintButton) showHintButton.addEventListener('click', showHint);
if(nextHintButton) nextHintButton.addEventListener('click', nextHintStep);
if(prevHintButton) prevHintButton.addEventListener('click', prevHintStep);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Lattice page DOM loaded");
    try {
        generateProblem();
        // diagnoseLatticeStyles(); // Keep or remove diagnosis as needed
    } catch (error) {
        console.error("Error during initial setup:", error);
    }
});
