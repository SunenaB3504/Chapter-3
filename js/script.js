// This file will contain JavaScript code for interactivity later.
console.log("Nia's Multiplication Adventure script loaded!");

// --- Global Variables ---
let currentScore = 0; // Initialize globally
let scormInitialized = false;
// Remove scoreDisplay/rewardMessageDisplay from global scope here, query them when needed

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
// Simplified for clarity - focus on localStorage first for score persistence

function initializeScormAndLoadScore() {
    const pagePath = window.location.pathname; // Get current page path for logging
    console.log(`--- [${pagePath}] Initializing Score ---`);
    let scoreLoaded = false;
    let loadedValue = null; // Variable to hold the loaded value for logging

    // ** Step 1: ALWAYS try loading from localStorage first **
    console.log(`[${pagePath}] Attempting to load score from localStorage...`);
    try {
        const savedScore = localStorage.getItem('niaAdventureScore');
        loadedValue = savedScore; // Store for logging
        if (savedScore !== null) {
            const parsedScore = parseInt(savedScore, 10);
            if (!isNaN(parsedScore)) {
                currentScore = parsedScore;
                scoreLoaded = true;
                console.log(`[${pagePath}] Score successfully loaded from localStorage: ${currentScore}`);
            } else {
                console.warn(`[${pagePath}] Invalid score value found in localStorage:`, savedScore, "- Resetting score and localStorage.");
                currentScore = 0;
                localStorage.setItem('niaAdventureScore', '0'); // Fix invalid value
            }
        } else {
            console.log(`[${pagePath}] No score found in localStorage. Initializing score to 0.`);
            currentScore = 0;
            localStorage.setItem('niaAdventureScore', '0'); // Initialize localStorage
        }
    } catch (error) {
        console.error(`[${pagePath}] Error reading score from localStorage:`, error, "- Initializing score to 0.");
        currentScore = 0;
    }
    console.log(`[${pagePath}] Score after localStorage check: ${currentScore} (Loaded value was: ${loadedValue})`);


    // ** Step 2: Update display **
    updateScoreDisplay();
    checkRewards();

    // ** Step 3: Try initializing SCORM (if available) for reporting **
    // (SCORM loading does NOT overwrite localStorage score in this logic)
    console.log(`[${pagePath}] Attempting SCORM Initialization (for reporting)...`);
    if (typeof scorm_Initialize === 'function' && scorm_Initialize() === "true") {
        scormInitialized = true;
        console.log(`[${pagePath}] SCORM Initialized Successfully.`);
        const lessonStatus = scorm_GetValue("cmi.core.lesson_status");
        console.log(`SCORM Status: ${lessonStatus}`);
        if (lessonStatus === "not attempted" || lessonStatus === "") {
            scorm_SetValue("cmi.core.lesson_status", "incomplete");
            console.log("Set SCORM lesson status to 'incomplete'.");
        }
        // Immediately report the loaded score to SCORM
        saveScoreToLMS(); // Report the definitive score to LMS
    } else {
        console.warn(`[${pagePath}] SCORM API not found or Initialization Failed.`);
        scormInitialized = false;
    }
    console.log(`[${pagePath}] --- Score Initialization Complete --- Final Score: ${currentScore}`);
}

// Renamed function for clarity
function saveScoreToLocalStorage() {
    try {
        const scoreToSave = currentScore; // Capture current value
        console.log(`Saving score ${scoreToSave} to localStorage...`);
        localStorage.setItem('niaAdventureScore', scoreToSave.toString());
        // Verification log: Read back immediately
        const savedValue = localStorage.getItem('niaAdventureScore');
        console.log(`localStorage save attempt finished. Value in localStorage: ${savedValue}`);
        if (savedValue !== scoreToSave.toString()) {
             console.error("!!! LOCALSTORAGE SAVE VERIFICATION FAILED !!!");
        }
    } catch (error) {
        console.error("Error saving score to localStorage:", error);
    }
}

// Renamed function for clarity
function saveScoreToLMS() {
    if (!scormInitialized) return; // Only proceed if SCORM is active

    console.log("Saving Score to LMS...");
    // Save score as suspend data (for potential re-load by SCORM if localStorage fails?)
    scorm_SetValue("cmi.suspend_data", currentScore.toString());

    // Set raw score (scaled 0-100)
    const maxPossibleScore = 10000; // Keep consistent
    const scaledScore = Math.min(100, Math.max(0, Math.round((currentScore / maxPossibleScore) * 100)));
    scorm_SetValue("cmi.core.score.raw", scaledScore.toString());
    scorm_SetValue("cmi.core.score.min", "0");
    scorm_SetValue("cmi.core.score.max", "100");
    console.log(`Set LMS raw score: ${scaledScore} (Scaled from ${currentScore})`);

    // Set lesson status (optional)
    if (currentScore > 0 && scorm_GetValue("cmi.core.lesson_status") === "incomplete") {
         scorm_SetValue("cmi.core.lesson_status", "completed");
         console.log("Set LMS lesson status to 'completed'.");
    }

    if (scorm_Commit() === "true") {
        console.log("LMS Data Committed Successfully.");
    } else {
        console.error("LMS Commit Failed.");
    }
}

function terminateScormConnection() {
    // Save score one last time before trying to terminate
    saveScoreToLocalStorage();
    saveScoreToLMS(); // Attempt LMS save too

    if (!scormInitialized) return;
    console.log("Terminating SCORM Connection...");
    scorm_SetValue("cmi.core.exit", "suspend");
    if (scorm_Terminate() === "true") {
        console.log("SCORM Terminated Successfully.");
        scormInitialized = false;
    } else {
        console.error("SCORM Termination Failed.");
    }
}

// --- Core Functions ---

// Make updateScore global if not already
window.updateScore = function(points) {
    if (isNaN(points)) {
        console.error("Invalid points value passed to updateScore:", points);
        return;
    }
    const oldScore = currentScore;
    currentScore += points;
    if (currentScore < 0) currentScore = 0; // Prevent negative score
    console.log(`Score updated by ${points}. Old: ${oldScore}, New: ${currentScore}`);

    // Update displays
    updateScoreDisplay(); // Update header
    checkRewards();     // Update header reward message

    // Save score immediately
    saveScoreToLocalStorage(); // Save to local storage
    saveScoreToLMS();          // Attempt to save to LMS
}

// Make updateScoreDisplay more robust by querying elements each time
function updateScoreDisplay() {
    const scoreDisplayElem = document.getElementById('current-score');
    if (scoreDisplayElem) {
        scoreDisplayElem.textContent = currentScore;
    } else {
        console.warn("Header score display element ('current-score') not found when trying to update.");
    }
    // Also update score on rewards page if that element exists
    const rewardsScoreDisplayElem = document.getElementById('rewards-score-display');
     if (rewardsScoreDisplayElem) {
        rewardsScoreDisplayElem.textContent = currentScore;
    }
}

// Make checkRewards more robust
function checkRewards() {
    let message = "";
    // ... (logic to determine message based on currentScore) ...
    if (currentScore >= 150) { message = "🌟 Super Star! 🌟"; }
    else if (currentScore >= 75) { message = "🚀 Math Rocket! 🚀"; }
    else if (currentScore >= 30) { message = "👍 Keep it up! 👍"; }

    const rewardMsgElem = document.getElementById('reward-message');
     if (rewardMsgElem) {
        rewardMsgElem.textContent = message;
    } else {
         console.warn("Header reward message display element ('reward-message') not found.");
    }
     // Also update reward level on rewards page if that element exists
    const rewardsLevelDisplayElem = document.getElementById('rewards-level-display'); // If you still have this element
    if (rewardsLevelDisplayElem) {
        rewardsLevelDisplayElem.textContent = message || "Just Starting!";
    }
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    const pagePath = window.location.pathname;
    console.log(`[${pagePath}] DOMContentLoaded event fired.`);
    initializeScormAndLoadScore(); // Load score and init SCORM
    registerServiceWorker();       // Register SW
});

window.addEventListener('pagehide', () => {
    const pagePath = window.location.pathname;
    console.log(`[${pagePath}] 'pagehide' event triggered. Attempting final save... Current Score: ${currentScore}`);
    // Only save, don't try to terminate SCORM fully here
    saveScoreToLocalStorage();
    saveScoreToLMS();
    console.log(`[${pagePath}] 'pagehide' save attempts finished.`);
});

// --- Utility Functions ---
// Ensure getRandomInt is available globally
if (typeof window.getRandomInt === 'undefined') {
    console.log("Defining window.getRandomInt...");
    window.getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }; // Added semicolon for good practice
    console.log("window.getRandomInt defined:", typeof window.getRandomInt);
} else {
     // Ensure there's no stray code or incorrect syntax within this else block
     console.log("window.getRandomInt already defined.");
} // Ensure this closing brace correctly matches the 'if' statement

console.log("--- script.js execution finished ---");
