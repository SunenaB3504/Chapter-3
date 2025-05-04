console.log("Problems script loaded!");

// --- Helper ---
if (typeof window.getRandomInt !== 'function') {
    console.error("getRandomInt function not found on window object!");
    window.getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Game Elements ---
const problemTextEl = document.getElementById('practice-problem-text');
const answerInput = document.getElementById('practice-answer');
const checkButton = document.getElementById('practice-check-button');
const newButton = document.getElementById('practice-new-problem-button');
const feedbackEl = document.getElementById('practice-feedback');
// const hintDisplayEl = document.getElementById('practice-hint-display'); // Optional hint element

// --- Game State ---
let num1 = 0, num2 = 0;
let correctAnswer = 0;
let attempted = false;

// --- Functions ---

function generateProblem() {
    const problemType = window.getRandomInt(1, 5); // Choose a type of problem

    switch (problemType) {
        case 1: // Simple facts (e.g., 7 x 8)
            num1 = window.getRandomInt(2, 12);
            num2 = window.getRandomInt(2, 12);
            break;
        case 2: // Multiply by 10/100/1000 (e.g., 45 x 100)
            num1 = window.getRandomInt(1, 99);
            num2 = Math.pow(10, window.getRandomInt(1, 3)); // 10, 100, or 1000
            break;
        case 3: // Multiply by multiples of 10 (e.g., 6 x 700)
            num1 = window.getRandomInt(2, 9);
            num2 = window.getRandomInt(2, 9) * Math.pow(10, window.getRandomInt(1, 3));
            break;
        case 4: // 2-digit x 1-digit (e.g., 53 x 6)
            num1 = window.getRandomInt(10, 99);
            num2 = window.getRandomInt(2, 9);
            break;
        case 5: // 2-digit x 2-digit (e.g., 34 x 28) - Make less frequent?
             if (Math.random() < 0.4) { // 40% chance of 2-digit x 2-digit
                num1 = window.getRandomInt(10, 99);
                num2 = window.getRandomInt(10, 99);
            } else { // Otherwise generate a simpler type again
                generateProblem(); // Re-roll
                return; // Exit current call
            }
            break;
        default: // Fallback to simple facts
            num1 = window.getRandomInt(2, 12);
            num2 = window.getRandomInt(2, 12);
            break;
    }

    // Randomly swap numbers sometimes for variety (commutative property)
    if (Math.random() < 0.5) {
        [num1, num2] = [num2, num1];
    }

    correctAnswer = num1 * num2;

    // Display problem
    if(problemTextEl) problemTextEl.textContent = `${num1} x ${num2} = ?`;

    // Clear inputs and feedback
    if(answerInput) answerInput.value = '';
    if(feedbackEl) feedbackEl.textContent = '';
    // if(hintDisplayEl) hintDisplayEl.textContent = ''; // Optional hint
    attempted = false;
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    let awardedPoints = 0;

    if (isNaN(userAnswer)) {
        feedbackEl.textContent = 'Please enter a number.';
        feedbackEl.className = 'feedback-message feedback-incorrect';
        return;
    }

    if (userAnswer === correctAnswer) {
        if (!attempted) {
            // Award points based on difficulty? (Simple example: 5 points)
            awardedPoints = 7; // Slightly more for mixed practice
            updateScore(awardedPoints);
            feedbackEl.textContent = `Correct! Great job! 👍 (+${awardedPoints} points!)`;
        } else {
            feedbackEl.textContent = 'Correct! Great job! 👍';
        }
        feedbackEl.className = 'feedback-message feedback-correct';
    } else {
        feedbackEl.textContent = `Not quite. The correct answer is ${correctAnswer}. Keep practicing! 😊`;
        feedbackEl.className = 'feedback-message feedback-incorrect';
    }
    attempted = true;
}

// --- Event Listeners ---
if(checkButton) checkButton.addEventListener('click', checkAnswer);
if(newButton) newButton.addEventListener('click', generateProblem);
// Optional: Allow Enter key
if(answerInput) {
    answerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkAnswer();
        }
    });
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Problems page DOM loaded");
    generateProblem();
});
