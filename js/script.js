// This file will contain JavaScript code for interactivity later.
console.log("Nia's Multiplication Adventure script loaded!");
console.log("--- script.js execution started ---");

// --- Global Variables ---
let currentScore = 0;
const scoreDisplay = document.getElementById('current-score');
const rewardMessageDisplay = document.getElementById('reward-message');
let scormInitialized = false; // Flag to track SCORM initialization

// --- Service Worker Registration ---
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered successfully with scope:', registration.scope);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    } else {
        console.log('Service Worker is not supported by this browser.');
    }
}

// --- SCORM Integration Functions ---

// Initialize SCORM connection
function initializeScorm() {
    console.log("Attempting SCORM Initialization...");
    // Check if online first? navigator.onLine might be useful
    if (typeof scorm_Initialize !== 'undefined' && scorm_Initialize() === "true") { // Check if function exists
        scormInitialized = true;
        console.log("SCORM Initialized Successfully.");

        // Check lesson status and entry mode
        const lessonStatus = scorm_GetValue("cmi.core.lesson_status");
        const entryMode = scorm_GetValue("cmi.core.entry");
        console.log(`SCORM Status: ${lessonStatus}, Entry: ${entryMode}`);

        if (lessonStatus === "not attempted") {
            scorm_SetValue("cmi.core.lesson_status", "incomplete");
            console.log("Set lesson status to 'incomplete'.");
        }

        // Load suspend data (contains the score)
        const suspendData = scorm_GetValue("cmi.suspend_data");
        console.log("Suspend Data Loaded:", suspendData);
        if (suspendData && suspendData !== "" && !isNaN(parseInt(suspendData))) {
            currentScore = parseInt(suspendData);
            console.log("Score restored from suspend data:", currentScore);
        } else {
            // Maybe load score.raw if suspend_data is empty/invalid?
            const rawScore = scorm_GetValue("cmi.core.score.raw");
             if (rawScore && rawScore !== "" && !isNaN(parseInt(rawScore))) {
                 // Assuming rawScore is 0-100, we might need to scale *from* it if our internal score isn't 0-100
                 // For now, let's assume suspend_data is primary and raw_score is just for reporting
                 console.log("Loaded raw score (for info):", rawScore);
             } else {
                 console.log("No valid score found in suspend data or raw score. Starting fresh.");
                 currentScore = 0;
             }
        }
        updateScoreDisplay(); // Update display with loaded score
        scorm_Commit(); // Commit after initial load/status set
    } else {
        // SCORM failed or offline
        console.warn("SCORM Initialization Failed or Offline. Running in standalone mode.");
        scormInitialized = false; // Ensure flag is false
        // Load score from localStorage as a fallback
        const savedScore = localStorage.getItem('niaAdventureScore');
        if (savedScore !== null) {
            currentScore = parseInt(savedScore, 10);
            console.log("Score restored from localStorage:", currentScore);
        } else {
            currentScore = 0;
            console.log("No score found in localStorage. Starting fresh.");
        }
        updateScoreDisplay();
    }
}

// Save score and suspend data to SCORM
function saveScormData() {
    // Always save to localStorage for offline persistence
    localStorage.setItem('niaAdventureScore', currentScore.toString());
    console.log("Score saved to localStorage:", currentScore);

    if (!scormInitialized) {
        // console.log("Standalone mode: Score saved to localStorage.");
        return; // Don't attempt SCORM calls if not initialized
    }

    console.log("Saving SCORM Data...");
    // Save score as suspend data for persistence
    scorm_SetValue("cmi.suspend_data", currentScore.toString());
    console.log("Set suspend_data:", currentScore.toString());

    // Set raw score (0-100). We might need to scale `currentScore`.
    // Let's assume a max possible score for scaling, e.g., 500 points = 100%
    const maxPossibleScore = 500; // Adjust this based on your game's potential max score
    const scaledScore = Math.min(100, Math.max(0, Math.round((currentScore / maxPossibleScore) * 100)));
    scorm_SetValue("cmi.core.score.raw", scaledScore.toString());
    scorm_SetValue("cmi.core.score.min", "0");
    scorm_SetValue("cmi.core.score.max", "100");
    console.log(`Set raw score: ${scaledScore} (Scaled from ${currentScore})`);

    // Optionally set lesson status to completed/passed based on score or progress
    // Example: Mark as completed if score > 0
    if (currentScore > 0 && scorm_GetValue("cmi.core.lesson_status") === "incomplete") {
         scorm_SetValue("cmi.core.lesson_status", "completed");
         console.log("Set lesson status to 'completed'.");
         // Or set to 'passed' if a certain score threshold is met
         // if (scaledScore >= 80) { // Example passing score
         //    scorm_SetValue("cmi.core.lesson_status", "passed");
         //    console.log("Set lesson status to 'passed'.");
         // }
    }

    if (scorm_Commit() === "true") {
        console.log("SCORM Data Committed Successfully.");
    } else {
        console.error("SCORM Commit Failed.");
    }
}

// Terminate SCORM connection
function terminateScorm() {
    // Data is already saved to localStorage in saveScormData
    if (!scormInitialized) return;
    console.log("Terminating SCORM Connection...");
    // Set exit mode to suspend so data is saved for next time
    scorm_SetValue("cmi.core.exit", "suspend");
    saveScormData(); // Ensure data is saved before terminating
    if (scorm_Terminate() === "true") {
        console.log("SCORM Terminated Successfully.");
        scormInitialized = false;
    } else {
        console.error("SCORM Termination Failed.");
    }
}


// --- Core Functions (Modified) ---

// Function to update the score
function updateScore(points) {
    if (points === 0) return; // No change
    currentScore += points;
    console.log(`Score updated by ${points}. New score: ${currentScore}`);
    updateScoreDisplay();
    checkRewards();
    saveScormData(); // Save score to SCORM/localStorage immediately after update
}

// Function to update the score display
function updateScoreDisplay() {
    if (scoreDisplay) {
        scoreDisplay.textContent = currentScore;
    } else {
        console.warn("Score display element not found.");
    }
}

// Function to check and display rewards
function checkRewards() {
    let message = "";
    if (currentScore >= 100) {
        message = "🌟 Super Star! 🌟";
    } else if (currentScore >= 50) {
        message = "🚀 Math Rocket! 🚀";
    } else if (currentScore >= 20) {
        message = "👍 Keep it up! 👍";
    }
    if (rewardMessageDisplay) {
        rewardMessageDisplay.textContent = message;
    }
}

// Function to initialize score (Now calls SCORM init)
function initializeScore() {
    console.log("initializeScore called");
    // Initialize SCORM, which will load the score
    initializeScorm();
    // Display is updated within initializeScorm after loading
    checkRewards(); // Check rewards based on loaded score
    console.log("initializeScore finished");
}

// --- Event Listeners ---

// Initialize score and register SW when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired for script.js");
    initializeScore(); // Initializes score (loads from SCORM or localStorage)
    registerServiceWorker(); // Register the service worker
});

// Terminate SCORM when the window is closed/unloaded
window.addEventListener('beforeunload', terminateScorm);
// Some LMSs might require unload instead of beforeunload
// window.addEventListener('unload', terminateScorm);


// --- Utility Functions ---
// Ensure getRandomInt is available globally
if (typeof window.getRandomInt === 'undefined') {
    console.log("Defining window.getRandomInt...");
    window.getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    console.log("window.getRandomInt defined:", typeof window.getRandomInt);
} else {
     console.log("window.getRandomInt already defined.");
}

console.log("--- script.js execution finished ---");
