console.log("2-digit multiplication script loaded!");

// --- Helper ---
if (typeof window.getRandomInt !== 'function') {
    console.error("getRandomInt function not found on window object!");
    window.getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Game Elements ---
const problemNum1El = document.getElementById('problem-num1');
const problemNum2El = document.getElementById('problem-num2');
const step1LabelEl = document.getElementById('step1-label');
const step2LabelEl = document.getElementById('step2-label');
const step1AnswerInput = document.getElementById('step1-answer');
const step2AnswerInput = document.getElementById('step2-answer');
const finalAnswerInput = document.getElementById('final-answer');
const checkButton = document.getElementById('check-2digit-button');
const newButton = document.getElementById('new-2digit-button');
const feedbackEl = document.getElementById('feedback-2digit');

// Hint Elements
const showHintButton = document.getElementById('show-hint-button');
const prevHintButton = document.getElementById('prev-hint-button');
const nextHintButton = document.getElementById('next-hint-button');
const hintArea = document.getElementById('hint-area');
const hintTextEl = document.getElementById('hint-text');

// --- Game State ---
let num1 = 0, num2 = 0;
let onesDigit = 0, tensDigit = 0;
let step1Correct = 0, step2Correct = 0, finalCorrect = 0;
let hints = [];
let currentHintStep = -1; // -1 means hint not shown
let attempted = false;

// --- Functions ---

function generateProblem() {
    num1 = window.getRandomInt(11, 99); // e.g., 2-digit
    num2 = window.getRandomInt(11, 99); // e.g., 2-digit

    onesDigit = num2 % 10;
    tensDigit = Math.floor(num2 / 10);

    step1Correct = num1 * onesDigit;
    step2Correct = num1 * tensDigit * 10; // Remember the zero!
    finalCorrect = step1Correct + step2Correct;

    // Display problem
    if(problemNum1El) problemNum1El.textContent = num1;
    if(problemNum2El) problemNum2El.textContent = num2;
    if(step1LabelEl) step1LabelEl.textContent = num1;
    if(step2LabelEl) step2LabelEl.textContent = num1;

    // Clear inputs and feedback
    if(step1AnswerInput) step1AnswerInput.value = '';
    if(step2AnswerInput) step2AnswerInput.value = '';
    if(finalAnswerInput) finalAnswerInput.value = '';
    if(feedbackEl) feedbackEl.textContent = '';
    attempted = false;

    // Reset and hide hint
    resetHint();

    // Define hints for this problem
    hints = [
        `Step 1: Multiply the top number (${num1}) by the ones digit of the bottom number (${onesDigit}).`,
        `Calculate ${num1} x ${onesDigit}.`,
        `The result for Step 1 is ${step1Correct}. Write this down.`,
        `Step 2: Multiply the top number (${num1}) by the tens digit of the bottom number (${tensDigit}). Remember this is actually ${tensDigit}0!`,
        `So, calculate ${num1} x ${tensDigit}0. (Hint: Do ${num1} x ${tensDigit}, then add a 0).`,
        `The result for Step 2 is ${step2Correct}. Write this below the first result, making sure the numbers line up correctly.`,
        `Step 3: Add the results from Step 1 and Step 2 together.`,
        `Calculate ${step1Correct} + ${step2Correct}.`,
        `The final answer is ${finalCorrect}.`
    ];
}

function checkAnswer() {
    const step1User = parseInt(step1AnswerInput.value);
    const step2User = parseInt(step2AnswerInput.value);
    const finalUser = parseInt(finalAnswerInput.value);

    let correctCount = 0;
    let awardedPoints = 0;

    // Basic validation
    if (isNaN(step1User) || isNaN(step2User) || isNaN(finalUser)) {
        feedbackEl.textContent = 'Please fill in all steps.';
        feedbackEl.className = 'feedback-message feedback-incorrect';
        return;
    }

    // Check each step
    if (step1User === step1Correct) correctCount++;
    if (step2User === step2Correct) correctCount++;
    if (finalUser === finalCorrect) correctCount++;

    // Provide feedback and score
    if (correctCount === 3) {
        if (!attempted) {
            awardedPoints = 15; // More points for getting all steps right first time
            updateScore(awardedPoints);
            feedbackEl.textContent = `Excellent! All steps correct! 🎉 (+${awardedPoints} points!)`;
        } else {
            feedbackEl.textContent = 'Excellent! All steps correct! 🎉';
        }
        feedbackEl.className = 'feedback-message feedback-correct';
    } else if (correctCount > 0) {
        feedbackEl.textContent = `You got ${correctCount} out of 3 steps right. Keep trying! 🤔`;
        feedbackEl.className = 'feedback-message feedback-incorrect';
    } else {
        feedbackEl.textContent = 'None of the steps are quite right. Maybe use the hint? 💪';
        feedbackEl.className = 'feedback-message feedback-incorrect';
    }
    attempted = true;
}

// --- Hint Functions ---
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


// --- Event Listeners ---
if(checkButton) checkButton.addEventListener('click', checkAnswer);
if(newButton) newButton.addEventListener('click', generateProblem);
if(showHintButton) showHintButton.addEventListener('click', showHint);
if(nextHintButton) nextHintButton.addEventListener('click', nextHintStep);
if(prevHintButton) prevHintButton.addEventListener('click', prevHintStep);

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("2-digit page DOM loaded");
    generateProblem();
});
