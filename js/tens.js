console.log("Tens script loaded!");

// --- Helper ---
if (typeof window.getRandomInt !== 'function') {
    console.error("getRandomInt function not found on window object!");
    window.getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Generic Check Function ---
function checkTensAnswer(userInput, correctAnswer, feedbackElement, points = 5) {
    const userAnswer = parseInt(userInput.value);
    let awardedPoints = 0;
    let isCorrect = false;

    if (isNaN(userAnswer)) {
        feedbackElement.textContent = 'Please enter a number.';
        feedbackElement.className = 'feedback-message feedback-incorrect';
        return false; // Indicate incorrect
    }

    if (userAnswer === correctAnswer) {
        awardedPoints = points; // Award points
        feedbackElement.textContent = `Correct! 👍 (+${awardedPoints} points!)`;
        feedbackElement.className = 'feedback-message feedback-correct';
        isCorrect = true;
    } else {
        feedbackElement.textContent = `Not quite. The answer is ${correctAnswer}. Remember the zero rule!`;
        feedbackElement.className = 'feedback-message feedback-incorrect';
    }
    return { correct: isCorrect, points: awardedPoints };
}


// --- Multiply by 10 Game ---
const tens10NumEl = document.getElementById('tens10-num');
const tens10AnswerInput = document.getElementById('tens10-answer');
const tens10CheckButton = document.getElementById('tens10-check-button');
const tens10NewButton = document.getElementById('tens10-new-button');
const tens10FeedbackEl = document.getElementById('tens10-feedback');
let tens10Num = 0, tens10CorrectAnswer = 0;
let tens10Attempted = false;

function generateTens10Problem() {
    tens10Num = window.getRandomInt(1, 99);
    tens10CorrectAnswer = tens10Num * 10;
    if(tens10NumEl) tens10NumEl.textContent = tens10Num;
    if(tens10AnswerInput) tens10AnswerInput.value = '';
    if(tens10FeedbackEl) tens10FeedbackEl.textContent = '';
    tens10Attempted = false;
}

function checkTens10() {
    const result = checkTensAnswer(tens10AnswerInput, tens10CorrectAnswer, tens10FeedbackEl);
    if (result.correct && !tens10Attempted) {
        updateScore(result.points);
    }
    tens10Attempted = true;
}

if(tens10CheckButton) tens10CheckButton.addEventListener('click', checkTens10);
if(tens10NewButton) tens10NewButton.addEventListener('click', generateTens10Problem);


// --- Multiply by 100 Game ---
const tens100NumEl = document.getElementById('tens100-num');
const tens100AnswerInput = document.getElementById('tens100-answer');
const tens100CheckButton = document.getElementById('tens100-check-button');
const tens100NewButton = document.getElementById('tens100-new-button');
const tens100FeedbackEl = document.getElementById('tens100-feedback');
let tens100Num = 0, tens100CorrectAnswer = 0;
let tens100Attempted = false;

function generateTens100Problem() {
    tens100Num = window.getRandomInt(1, 99);
    tens100CorrectAnswer = tens100Num * 100;
    if(tens100NumEl) tens100NumEl.textContent = tens100Num;
    if(tens100AnswerInput) tens100AnswerInput.value = '';
    if(tens100FeedbackEl) tens100FeedbackEl.textContent = '';
    tens100Attempted = false;
}

function checkTens100() {
    const result = checkTensAnswer(tens100AnswerInput, tens100CorrectAnswer, tens100FeedbackEl);
     if (result.correct && !tens100Attempted) {
        updateScore(result.points);
    }
    tens100Attempted = true;
}

if(tens100CheckButton) tens100CheckButton.addEventListener('click', checkTens100);
if(tens100NewButton) tens100NewButton.addEventListener('click', generateTens100Problem);


// --- Multiply by 1000 Game ---
const tens1000NumEl = document.getElementById('tens1000-num');
const tens1000AnswerInput = document.getElementById('tens1000-answer');
const tens1000CheckButton = document.getElementById('tens1000-check-button');
const tens1000NewButton = document.getElementById('tens1000-new-button');
const tens1000FeedbackEl = document.getElementById('tens1000-feedback');
let tens1000Num = 0, tens1000CorrectAnswer = 0;
let tens1000Attempted = false;

function generateTens1000Problem() {
    tens1000Num = window.getRandomInt(1, 99);
    tens1000CorrectAnswer = tens1000Num * 1000;
    if(tens1000NumEl) tens1000NumEl.textContent = tens1000Num;
    if(tens1000AnswerInput) tens1000AnswerInput.value = '';
    if(tens1000FeedbackEl) tens1000FeedbackEl.textContent = '';
    tens1000Attempted = false;
}

function checkTens1000() {
    const result = checkTensAnswer(tens1000AnswerInput, tens1000CorrectAnswer, tens1000FeedbackEl);
     if (result.correct && !tens1000Attempted) {
        updateScore(result.points);
    }
    tens1000Attempted = true;
}

if(tens1000CheckButton) tens1000CheckButton.addEventListener('click', checkTens1000);
if(tens1000NewButton) tens1000NewButton.addEventListener('click', generateTens1000Problem);


// --- Multiply by Multiples Game ---
const tensMNum1El = document.getElementById('tensM-num1');
const tensMNum2El = document.getElementById('tensM-num2');
const tensMAnswerInput = document.getElementById('tensM-answer');
const tensMCheckButton = document.getElementById('tensM-check-button');
const tensMNewButton = document.getElementById('tensM-new-button');
const tensMFeedbackEl = document.getElementById('tensM-feedback');
// Add Hint Elements
const tensMHintButton = document.getElementById('tensM-hint-button');
const tensMHintDisplay = document.getElementById('tensM-hint-display');

let tensMNum1 = 0, tensMNum2 = 0, tensMCorrectAnswer = 0;
let tensMBase1 = 0, tensMBase2 = 0; // Store the non-zero parts
let tensMTotalZeros = 0; // Store the total number of zeros
let tensMAttempted = false;
let tensMHintUsed = false; // Track hint usage

function generateTensMProblem() {
    tensMBase1 = window.getRandomInt(1, 9);
    tensMBase2 = window.getRandomInt(1, 9);
    const zeros1Count = window.getRandomInt(0, 3); // 0 to 3 zeros
    const zeros2Count = window.getRandomInt(0, 3); // 0 to 3 zeros

    // Ensure at least one number has zeros for this game section
    if (zeros1Count === 0 && zeros2Count === 0) {
        // If both have 0 zeros, force at least one to have zeros
        if (Math.random() < 0.5) {
            tensMNum1 = tensMBase1 * Math.pow(10, window.getRandomInt(1, 3));
            tensMNum2 = tensMBase2;
            tensMTotalZeros = Math.log10(tensMNum1 / tensMBase1);
        } else {
            tensMNum1 = tensMBase1;
            tensMNum2 = tensMBase2 * Math.pow(10, window.getRandomInt(1, 3));
            tensMTotalZeros = Math.log10(tensMNum2 / tensMBase2);
        }
    } else {
        tensMNum1 = tensMBase1 * Math.pow(10, zeros1Count);
        tensMNum2 = tensMBase2 * Math.pow(10, zeros2Count);
        tensMTotalZeros = zeros1Count + zeros2Count;
    }


    tensMCorrectAnswer = tensMNum1 * tensMNum2;
    if(tensMNum1El) tensMNum1El.textContent = tensMNum1;
    if(tensMNum2El) tensMNum2El.textContent = tensMNum2;
    if(tensMAnswerInput) tensMAnswerInput.value = '';
    if(tensMFeedbackEl) tensMFeedbackEl.textContent = '';
    tensMAttempted = false;

    // Reset Hint
    tensMHintUsed = false;
    if (tensMHintDisplay) tensMHintDisplay.textContent = '';
    if (tensMHintButton) tensMHintButton.disabled = false;
}

// Function to show hint for Multiples game
function showTensMHint() {
    if (tensMHintUsed || !tensMHintDisplay || tensMBase1 === 0 || tensMBase2 === 0) return;

    const baseProduct = tensMBase1 * tensMBase2;
    let hintText = `Hint: First multiply ${tensMBase1} x ${tensMBase2} = ${baseProduct}. `;
    hintText += `Then, count the total zeros in ${tensMNum1} and ${tensMNum2} (there are ${tensMTotalZeros} zeros). Add those zeros to ${baseProduct}.`;

    tensMHintDisplay.textContent = hintText;
    tensMHintUsed = true;
    if (tensMHintButton) tensMHintButton.disabled = true;
}


function checkTensM() {
    // Use the generic checker, maybe award more points?
    const result = checkTensAnswer(tensMAnswerInput, tensMCorrectAnswer, tensMFeedbackEl, 7); // Award 7 points
     if (result.correct && !tensMAttempted) {
        updateScore(result.points);
    }
    tensMAttempted = true;
}

if(tensMCheckButton) tensMCheckButton.addEventListener('click', checkTensM);
if(tensMNewButton) tensMNewButton.addEventListener('click', generateTensMProblem);
// Add Hint Button Listener
if (tensMHintButton) {
    tensMHintButton.addEventListener('click', showTensMHint);
} else {
    console.error("tensMHintButton not found");
}


// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Tens page DOM loaded");
    generateTens10Problem();
    generateTens100Problem();
    generateTens1000Problem();
    generateTensMProblem();
});
