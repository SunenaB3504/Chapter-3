// This file will contain JavaScript code for interactivity later.
console.log("Nia's Multiplication Adventure script loaded!");
console.log("--- script.js execution started ---");

// --- Utility Functions ---
console.log("Defining window.getRandomInt...");
window.getRandomInt = function(min, max) {
  // Add basic validation
  if (typeof min !== 'number' || typeof max !== 'number') {
      console.error('getRandomInt requires numbers as arguments');
      return 0; // Or handle error appropriately
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log("window.getRandomInt defined:", typeof window.getRandomInt);
// --- End Utility Functions ---

const SCORE_KEY = 'niaMultiplicationScore';
const scoreDisplayElementId = 'current-score'; // ID for the score display element
const rewardDisplayElementId = 'reward-message'; // ID for the reward display element

// --- Score Management ---
// Initialize score if it doesn't exist
function initializeScore() {
    console.log("initializeScore called"); // Add log
    if (localStorage.getItem(SCORE_KEY) === null) {
        localStorage.setItem(SCORE_KEY, '0');
    }
    displayScore();
    checkRewards(); // Check rewards on load
    console.log("initializeScore finished"); // Add log
}

// Get current score
function getScore() {
    return parseInt(localStorage.getItem(SCORE_KEY) || '0');
}

// Update score
function updateScore(points) {
    let currentScore = getScore();
    currentScore += points;
    localStorage.setItem(SCORE_KEY, currentScore.toString());
    displayScore();
    checkRewards(); // Check for new rewards after score update
}

// Deduct score after trading a reward
function deductScore(pointsToDeduct) {
    let currentScore = getScore();
    // Ensure score doesn't go below zero (optional, but good practice)
    currentScore = Math.max(0, currentScore - pointsToDeduct);
    localStorage.setItem(SCORE_KEY, currentScore.toString());
    displayScore(); // Update score display in header
    checkRewards(); // Update reward message in header
}

// Display score
function displayScore() {
    const scoreElement = document.getElementById(scoreDisplayElementId);
    if (scoreElement) {
        scoreElement.textContent = getScore();
    }
}
// --- End Score Management ---


// --- Reward Management ---
// Check and display rewards
function checkRewards() {
    const score = getScore();
    const rewardElement = document.getElementById(rewardDisplayElementId);
    let rewardMessage = '';

    // Define rewards in descending order of points
    const rewards = [
        { points: 10000, message: '🎁🧸 WOW! 10,000 Points! TOY TIME! 🧸🎁' },
        { points: 5000, message: '📚🥳 5,000 Points! New BOOK! 🥳📚' },
        { points: 4000, message: '🍕🍕 4,000 Points! PIZZA PARTY! 🍕🍕' },
        { points: 3000, message: '🍗🍗 3,000 Points! Fried CHICKEN! 🍗🍗' },
        { points: 2000, message: '🍔🍔 2,000 Points! BURGER Treat! 🍔🍔' },
        { points: 1000, message: '🍦🍦 1,000 Points! ICE CREAM! 🍦🍦' },
        { points: 500, message: '🍬🍬 500 Points! CANDY! 🍬🍬' },
        { points: 100, message: '🌟 Wow! 100 Points! Multiplication Master! 🌟' },
        { points: 50, message: '🎉 Great Job! 50 Points! Keep it up! 🎉' },
        { points: 20, message: '👍 Nice! 20 Points! You\'re learning fast! 👍' },
        { points: 5, message: '✨ Good Start! 5 Points! ✨' }
    ];

    // Find the highest reward achieved
    for (const reward of rewards) {
        if (score >= reward.points) {
            rewardMessage = reward.message;
            break; // Stop checking once the highest reward is found
        }
    }

    if (rewardElement) {
        rewardElement.textContent = rewardMessage;
        // Optional: Add animation or special styling for rewards
        if (rewardMessage) {
             rewardElement.style.color = 'purple'; // Or cycle through colors?
             rewardElement.style.fontWeight = 'bold';
             // Add a little animation maybe?
             rewardElement.animate([
                { transform: 'scale(1)' },
                { transform: 'scale(1.1)' },
                { transform: 'scale(1)' }
             ], {
                duration: 300,
                easing: 'ease-in-out'
             });
        } else {
             rewardElement.style.color = ''; // Reset style
             rewardElement.style.fontWeight = '';
        }
    }
}
// --- End Reward Management ---

// Example function (can be removed or kept for other uses)
function checkAnswer(inputId, correctAnswer) {
    const userAnswer = document.getElementById(inputId).value;
    if (userAnswer == correctAnswer) {
        alert("Correct! Great job!");
        updateScore(10); // Update score by 10 points for a correct answer
        // Add visual feedback (e.g., change border color)
    } else {
        alert("Not quite, try again!");
        // Add visual feedback
    }
}

// Initialize score when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired for script.js"); // Add log
    try {
        initializeScore();
    } catch (error) {
        console.error("Error during initializeScore:", error); // Catch errors here
    }
});

console.log("--- script.js execution finished ---");
