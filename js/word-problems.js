console.log("Word Problems script loaded!");

// --- Helper ---
if (typeof window.getRandomInt !== 'function') {
    console.error("getRandomInt function not found on window object!");
    window.getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Game Elements ---
const problemTextEl = document.getElementById('word-problem-text');
const answerInput = document.getElementById('word-answer');
const checkButton = document.getElementById('word-check-button');
const newButton = document.getElementById('word-new-problem-button');
const feedbackEl = document.getElementById('word-feedback');
// const hintButton = document.getElementById('word-hint-button'); // Optional
// const hintDisplayEl = document.getElementById('word-hint-display'); // Optional

// --- Word Problem Data ---
// Structure: { text: "Problem text with {num1} and {num2}", num1: range, num2: range, unit: "plural unit name" }
const wordProblems = [
    { text: "Nia bought {num1} packs of stickers. Each pack has {num2} stickers. How many stickers does Nia have in total?", num1: [3, 9], num2: [4, 12], unit: "stickers" },
    { text: "There are {num1} rows of chairs in the classroom. Each row has {num2} chairs. How many chairs are there in all?", num1: [2, 6], num2: [5, 10], unit: "chairs" },
    { text: "A baker makes {num1} trays of cookies. Each tray holds {num2} cookies. How many cookies did the baker make?", num1: [4, 8], num2: [6, 12], unit: "cookies" },
    { text: "If one box contains {num2} crayons, how many crayons are there in {num1} boxes?", num1: [3, 10], num2: [8, 24], unit: "crayons" },
    { text: "A bus ticket costs ${num2}. If {num1} friends buy tickets, how much do they spend altogether?", num1: [2, 5], num2: [3, 7], unit: "dollars", isCurrency: true },
    { text: "Each flower has {num2} petals. If there are {num1} flowers, how many petals are there in total?", num1: [5, 12], num2: [5, 8], unit: "petals" },
    { text: "A library shelf holds {num2} books. If there are {num1} shelves just like it, how many books are there?", num1: [4, 9], num2: [10, 30], unit: "books" }
];

// --- Game State ---
let currentProblem = null;
let num1 = 0, num2 = 0;
let correctAnswer = 0;
let attempted = false;

// --- Functions ---

function generateProblem() {
    // Select a random problem template
    const templateIndex = window.getRandomInt(0, wordProblems.length - 1);
    currentProblem = wordProblems[templateIndex];

    // Generate random numbers within the specified ranges
    num1 = window.getRandomInt(currentProblem.num1[0], currentProblem.num1[1]);
    num2 = window.getRandomInt(currentProblem.num2[0], currentProblem.num2[1]);

    correctAnswer = num1 * num2;

    // Format the problem text
    let problemDisplayText = currentProblem.text.replace("{num1}", num1).replace("{num2}", num2);

    // Display problem
    if(problemTextEl) problemTextEl.textContent = problemDisplayText;

    // Clear inputs and feedback
    if(answerInput) answerInput.value = '';
    if(feedbackEl) feedbackEl.textContent = '';
    // if(hintDisplayEl) hintDisplayEl.textContent = ''; // Optional hint reset
    attempted = false;
    // if(hintButton) hintButton.disabled = false; // Optional hint reset
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
            awardedPoints = 10; // Points for word problems
            updateScore(awardedPoints);
            feedbackEl.textContent = `Correct! The answer is ${correctAnswer}${currentProblem.isCurrency ? '' : ' ' + currentProblem.unit}! 👍 (+${awardedPoints} points!)`;
        } else {
            feedbackEl.textContent = `Correct! The answer is ${correctAnswer}${currentProblem.isCurrency ? '' : ' ' + currentProblem.unit}! 👍`;
        }
        feedbackEl.className = 'feedback-message feedback-correct';
    } else {
        feedbackEl.textContent = `Not quite. Think: ${num1} groups of ${num2}. The correct answer is ${correctAnswer}${currentProblem.isCurrency ? '' : ' ' + currentProblem.unit}. 😊`;
        feedbackEl.className = 'feedback-message feedback-incorrect';
    }
    attempted = true;
}

/* // Optional Hint Function
function showHint() {
    if (!currentProblem || !hintDisplayEl) return;
    hintDisplayEl.textContent = `Hint: You need to calculate ${num1} x ${num2}.`;
    if(hintButton) hintButton.disabled = true;
}
*/

// --- Event Listeners ---
if(checkButton) checkButton.addEventListener('click', checkAnswer);
if(newButton) newButton.addEventListener('click', generateProblem);
// if(hintButton) hintButton.addEventListener('click', showHint); // Optional
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
    console.log("Word Problems page DOM loaded");
    generateProblem();
});
