console.log("Introduction script loaded!");


// Game Elements
const problemTextElement = document.getElementById('problem-text');
const additionStringElement = document.getElementById('repeated-addition-string');
const multiplicationStringElement = document.getElementById('multiplication-string');
const additionAnswerInput = document.getElementById('addition-answer');
const multiplicationAnswerInput = document.getElementById('multiplication-answer');
const checkButton = document.getElementById('check-button');
const newProblemButton = document.getElementById('new-problem-button');
const feedbackElement = document.getElementById('feedback');

let currentCorrectAnswer = 0;
let groups = 0;
let itemsPerGroup = 0;
let problemAttempted = false; // Track if user tried to answer

// Function to generate a random number between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate and display a new problem
function generateProblem() {
    groups = getRandomInt(2, 7); // e.g., 2 to 7 groups/packets
    itemsPerGroup = getRandomInt(2, 10); // e.g., 2 to 10 items/beads per group
    currentCorrectAnswer = groups * itemsPerGroup;

    // Create problem text
    const items = ["apples", "beads", "stars", "cookies", "pencils"];
    const containers = ["packets", "baskets", "boxes", "jars", "bags"];
    const randomItem = items[getRandomInt(0, items.length - 1)];
    const randomContainer = containers[getRandomInt(0, containers.length - 1)];
    problemTextElement.textContent = `You have ${groups} ${randomContainer}. Each ${randomContainer.slice(0, -1)} has ${itemsPerGroup} ${randomItem}. How many ${randomItem} in total?`;

    // Create repeated addition string
    let additionString = Array(groups).fill(itemsPerGroup).join(' + ');
    additionStringElement.textContent = additionString;

    // Create multiplication string
    multiplicationStringElement.textContent = `${groups} x ${itemsPerGroup}`;

    // Reset attempt tracker

    // Clear inputs and feedback
    additionAnswerInput.value = '';
    multiplicationAnswerInput.value = '';
    feedbackElement.textContent = '';
    feedbackElement.className = 'feedback-message'; // Reset class
    additionAnswerInput.classList.remove('feedback-correct', 'feedback-incorrect');
    multiplicationAnswerInput.classList.remove('feedback-correct', 'feedback-incorrect');

}

// Function to check the user's answers
function checkAnswer() {
    const additionAnswer = parseInt(additionAnswerInput.value);
    const multiplicationAnswer = parseInt(multiplicationAnswerInput.value);
    let isAdditionCorrect = false;
    let isMultiplicationCorrect = false;
    let awardedPoints = 0; // Points awarded in this check

    // Reset input styles
    additionAnswerInput.classList.remove('feedback-correct', 'feedback-incorrect');
    multiplicationAnswerInput.classList.remove('feedback-correct', 'feedback-incorrect');


    if (!isNaN(additionAnswer) && additionAnswer === currentCorrectAnswer) {
        isAdditionCorrect = true;
        additionAnswerInput.classList.add('feedback-correct');
        if (!problemAttempted) awardedPoints += 5;
    } else if (additionAnswerInput.value !== '') {
         additionAnswerInput.classList.add('feedback-incorrect');
    }

     if (!isNaN(multiplicationAnswer) && multiplicationAnswer === currentCorrectAnswer) {
        isMultiplicationCorrect = true;
        multiplicationAnswerInput.classList.add('feedback-correct');
        if (!problemAttempted) awardedPoints += 5;
    } else if (multiplicationAnswerInput.value !== '') {
         multiplicationAnswerInput.classList.add('feedback-incorrect');
    }

    // Mark problem as attempted
    if (additionAnswerInput.value !== '' || multiplicationAnswerInput.value !== '') {
        problemAttempted = true;
    }

    // Update score if points were awarded
    if (awardedPoints > 0) {
        updateScore(awardedPoints); // Call the global score update function
    }

    // Provide overall feedback - UPDATED FEEDBACK MESSAGES
    if (isAdditionCorrect && isMultiplicationCorrect) {
        feedbackElement.textContent = `Correct! 🎉 Both ways give the same answer! (+${awardedPoints} points!)`; // Show points
        feedbackElement.className = 'feedback-message feedback-correct';
    } else if (isAdditionCorrect || isMultiplicationCorrect) {
         const correctMethodPoints = 5; // Points per correct method on first try
         const earnedText = awardedPoints > 0 ? ` (+${awardedPoints} points!)` : ''; // Show points only if earned this turn
         feedbackElement.textContent = `One is right! Keep trying on the other one. 🤔${earnedText}`;
         feedbackElement.className = 'feedback-message feedback-incorrect'; // Or a neutral color
    }
     else if (additionAnswerInput.value === '' && multiplicationAnswerInput.value === '') {
         feedbackElement.textContent = 'Please enter your answers first!';
         feedbackElement.className = 'feedback-message feedback-incorrect';
    }
    else {
        feedbackElement.textContent = 'Not quite right. Try again! You can do it! 💪';
        feedbackElement.className = 'feedback-message feedback-incorrect';
    }
}

// Event Listeners
checkButton.addEventListener('click', checkAnswer);
newProblemButton.addEventListener('click', generateProblem);

// Generate the first problem when the page loads
// generateProblem(); // This is called by the event listener in script.js now

// Note: initializeScore in script.js calls displayScore and checkRewards on load.
// generateProblem() should still be called to set up the first game state.
document.addEventListener('DOMContentLoaded', generateProblem);
