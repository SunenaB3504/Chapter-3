console.log("Facts script loaded!");


// Game Elements - Times Table Challenge
const factsProblemElement = document.getElementById('facts-problem-text');
console.log("factsProblemElement found:", factsProblemElement); // Log if the element is found
const factsAnswerInput = document.getElementById('facts-answer');
const factsCheckButton = document.getElementById('facts-check-button');
const factsNewProblemButton = document.getElementById('facts-new-problem-button');
const factsFeedbackElement = document.getElementById('facts-feedback');
// Add Hint Elements
const factsHintButton = document.getElementById('facts-hint-button');
const factsHintDisplay = document.getElementById('facts-hint-display');


let factor1 = 0;
let factor2 = 0;
let currentProduct = 0;
let factsProblemAttempted = false;
let hintUsed = false; // Track if hint was used for the current problem

// Function to generate and display a new multiplication fact problem
function generateFactsProblem() {
    console.log("generateFactsProblem called"); // Log when the function starts
    try {
        // Check if the function exists before calling
        if (typeof window.getRandomInt !== 'function') {
            console.error("window.getRandomInt is STILL not a function when generateFactsProblem is called!");
            // Optionally, display an error message to the user or try a fallback
            if(factsProblemElement) factsProblemElement.textContent = "Error!";
            return; // Stop execution if the function isn't available
        }

        // Call the explicitly global function
        factor1 = window.getRandomInt(1, 10);
        factor2 = window.getRandomInt(1, 10);
        currentProduct = factor1 * factor2;
        console.log(`Generated factors: ${factor1}, ${factor2}. Product: ${currentProduct}`); // Log the generated numbers

        // Ensure the element exists before updating
        if (factsProblemElement) {
            const newText = `${factor1} x ${factor2} = ?`;
            console.log("Attempting to set text:", newText); // Log the text we are trying to set
            factsProblemElement.textContent = newText;
            console.log("Text content after setting:", factsProblemElement.textContent); // Log the text content *after* trying to set it
        } else {
            console.error("Could not find the element with ID 'facts-problem-text' inside generateFactsProblem");
        }

        // Clear input and feedback
        if (factsAnswerInput) factsAnswerInput.value = '';
        if (factsFeedbackElement) {
            factsFeedbackElement.textContent = '';
            factsFeedbackElement.className = 'feedback-message'; // Reset class
        }
        if (factsAnswerInput) factsAnswerInput.classList.remove('feedback-correct', 'feedback-incorrect');
        factsProblemAttempted = false; // Reset attempt tracker

        // Reset Hint
        hintUsed = false;
        if (factsHintDisplay) factsHintDisplay.textContent = '';
        if (factsHintButton) factsHintButton.disabled = false; // Re-enable hint button

    } catch (error) {
        console.error("Error inside generateFactsProblem:", error); // Log any errors occurring within the function
    }
}

// Function to show a hint
function showHint() {
    if (hintUsed || !factsHintDisplay || factor1 === 0 || factor2 === 0) return; // Don't show if already used or factors not set

    // Create the repeated addition string as a hint
    // Show the smaller number added repeatedly
    let hintText = '';
    if (factor1 <= factor2) {
        hintText = `Hint: Add ${factor1}, ${factor2} times (${Array(factor2).fill(factor1).join(' + ')})`;
    } else {
        hintText = `Hint: Add ${factor2}, ${factor1} times (${Array(factor1).fill(factor2).join(' + ')})`;
    }

    factsHintDisplay.textContent = hintText;
    hintUsed = true;
    if (factsHintButton) factsHintButton.disabled = true; // Disable after use
}

// Function to check the user's answer
function checkFactsAnswer() {
    const userAnswer = parseInt(factsAnswerInput.value);
    let awardedPoints = 0;

    factsAnswerInput.classList.remove('feedback-correct', 'feedback-incorrect'); // Reset style first

    if (isNaN(userAnswer) && factsAnswerInput.value === '') {
         factsFeedbackElement.textContent = 'Please type your answer!';
         factsFeedbackElement.className = 'feedback-message feedback-incorrect';
         return; // Stop checking if no answer is entered
    }

    if (userAnswer === currentProduct) {
        if (!factsProblemAttempted) {
            awardedPoints = 5; // Award 5 points for correct answer on first try
            updateScore(awardedPoints); // Call global score update
            factsFeedbackElement.textContent = `Correct! 👍 (+${awardedPoints} points!)`; // Show points
        } else {
             factsFeedbackElement.textContent = 'Correct! 👍'; // No points on subsequent tries
        }
        factsFeedbackElement.className = 'feedback-message feedback-correct';
        factsAnswerInput.classList.add('feedback-correct');
    } else {
        factsFeedbackElement.textContent = `Not quite. The answer is ${currentProduct}. Keep trying! 😊`;
        factsFeedbackElement.className = 'feedback-message feedback-incorrect';
        factsAnswerInput.classList.add('feedback-incorrect');
    }

    factsProblemAttempted = true; // Mark as attempted after the first check
}

// --- Memory Match Game ---
console.log("Setting up Memory Match Game...");

const memoryGameBoard = document.getElementById('memory-game-board');
const memoryResetButton = document.getElementById('memory-reset-button');
const memoryMovesCounter = document.getElementById('memory-moves');

let memoryCardsData = []; // Will hold pairs like { question: '2x3', answer: '6', id: 1 }
let cards = []; // Will hold the shuffled card elements
let firstCard = null;
let secondCard = null;
let lockBoard = false; // Prevent clicking more than 2 cards
let moves = 0;
let matchedPairs = 0;
let totalPairs = 0;

// Function to generate multiplication pairs
function generateMemoryPairs(count) {
    const pairs = [];
    const usedFacts = new Set();
    let idCounter = 1;

    while (pairs.length < count) {
        const num1 = window.getRandomInt(1, 9); // Keep numbers small for a start
        const num2 = window.getRandomInt(1, 9);
        const question = `${num1} x ${num2}`;
        const answer = (num1 * num2).toString();
        const fact = `${Math.min(num1, num2)}x${Math.max(num1, num2)}`; // Unique key for the fact

        if (!usedFacts.has(fact)) {
            pairs.push({ question, answer, id: idCounter++ });
            usedFacts.add(fact);
        }
    }
    // Create the card data (question and answer cards separately)
    memoryCardsData = [];
    pairs.forEach(pair => {
        memoryCardsData.push({ type: 'question', value: pair.question, pairId: pair.id });
        memoryCardsData.push({ type: 'answer', value: pair.answer, pairId: pair.id });
    });
    totalPairs = pairs.length;
}

// Function to shuffle cards (Fisher-Yates Algorithm)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Function to create card HTML
function createCardElement(cardData) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.dataset.pairId = cardData.pairId; // Store pair ID for matching

    card.innerHTML = `
        <div class="card-face card-face-front">?</div>
        <div class="card-face card-face-back">${cardData.value}</div>
    `;

    card.addEventListener('click', handleCardClick);
    return card;
}

// Function to set up and display the game board
function setupMemoryGame() {
    console.log("Setting up memory game board...");
    generateMemoryPairs(8); // Generate 8 pairs (16 cards) - adjust as needed
    shuffle(memoryCardsData);

    memoryGameBoard.innerHTML = ''; // Clear previous board
    cards = []; // Clear card elements array
    memoryCardsData.forEach(data => {
        const cardElement = createCardElement(data);
        memoryGameBoard.appendChild(cardElement);
        cards.push(cardElement);
    });

    // Reset game state
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    moves = 0;
    matchedPairs = 0;
    memoryMovesCounter.textContent = moves;
    console.log("Memory game board setup complete.");
}

// Handle card click
function handleCardClick() {
    if (lockBoard) return; // Ignore clicks if board is locked
    if (this === firstCard) return; // Ignore clicking the same card twice
    if (this.classList.contains('is-matched')) return; // Ignore clicks on matched cards

    this.classList.add('is-flipped');

    if (!firstCard) {
        // First card flipped
        firstCard = this;
        return;
    }

    // Second card flipped
    secondCard = this;
    moves++;
    memoryMovesCounter.textContent = moves;
    lockBoard = true; // Lock board while checking

    checkForMatch();
}

// Check if the two flipped cards match
function checkForMatch() {
    const isMatch = firstCard.dataset.pairId === secondCard.dataset.pairId;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

// Disable matched cards
function disableCards() {
    console.log("Match found!");
    firstCard.classList.add('is-matched');
    secondCard.classList.add('is-matched');
    firstCard.removeEventListener('click', handleCardClick);
    secondCard.removeEventListener('click', handleCardClick);

    matchedPairs++;
    const pointsAwarded = 10; // Points per match
    updateScore(pointsAwarded); // Award 10 points per match

    // Temporarily show points awarded in the Times Table feedback area (or create a dedicated one)
    if (factsFeedbackElement) {
        factsFeedbackElement.textContent = `Match found! +${pointsAwarded} points! 🎉`;
        factsFeedbackElement.className = 'feedback-message feedback-correct';
        // Clear the message after a short delay
        setTimeout(() => {
            if (factsFeedbackElement.textContent === `Match found! +${pointsAwarded} points! 🎉`) {
                 factsFeedbackElement.textContent = '';
                 factsFeedbackElement.className = 'feedback-message';
            }
        }, 2000); // Clear after 2 seconds
    }


    resetBoardState();

    if (matchedPairs === totalPairs) {
        console.log("Game Over - All pairs matched!");
        // Optionally display a win message
        setTimeout(() => alert(`You matched all pairs in ${moves} moves! Great job! 🎉`), 500);
         // Clear feedback after win alert
         if (factsFeedbackElement) {
             factsFeedbackElement.textContent = '';
             factsFeedbackElement.className = 'feedback-message';
         }
    }
}

// Unflip non-matching cards
function unflipCards() {
    console.log("No match.");
    setTimeout(() => {
        firstCard.classList.remove('is-flipped');
        secondCard.classList.remove('is-flipped');
        resetBoardState();
    }, 1200); // Wait 1.2 seconds before flipping back
}

// Reset board state after a turn
function resetBoardState() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// Event Listener for Reset Button
if (memoryResetButton) {
    memoryResetButton.addEventListener('click', setupMemoryGame);
} else {
    console.error("Memory reset button not found");
}

// Optional: Initial setup on load (can be triggered by button)
// document.addEventListener('DOMContentLoaded', setupMemoryGame); // Or let the button trigger the first game

// --- End Memory Match Game ---

// Event Listeners
if (factsCheckButton) {
    factsCheckButton.addEventListener('click', checkFactsAnswer);
} else {
    console.error("factsCheckButton not found");
}

if (factsNewProblemButton) {
    factsNewProblemButton.addEventListener('click', generateFactsProblem);
} else {
    console.error("factsNewProblemButton not found");
}

// Optional: Allow pressing Enter to check answer
if (factsAnswerInput) {
    factsAnswerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission if it were in a form
            checkFactsAnswer();
        }
    });
} else {
    console.error("factsAnswerInput not found");
}

// Add Hint Button Listener
if (factsHintButton) {
    factsHintButton.addEventListener('click', showHint);
} else {
    console.error("factsHintButton not found");
}

// Generate the first problem when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired for facts.js"); // Log when the event fires
    // Use setTimeout to ensure script.js has likely finished executing
    setTimeout(generateFactsProblem, 0);
});
