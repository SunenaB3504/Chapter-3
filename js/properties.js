console.log("Properties script loaded!");

let attemptedCommutative = false; // Flag for commutative game

// --- Helper ---
// Ensure getRandomInt is available (it should be from script.js)
if (typeof window.getRandomInt !== 'function') {
    console.error("getRandomInt function not found on window object!");
    // Define a fallback if needed, though this indicates a loading issue
    window.getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Commutative Property Game ---
const commEq1Lhs = document.getElementById('comm-eq1-lhs');
const commEq1Rhs = document.getElementById('comm-eq1-rhs');
const commEq2Lhs = document.getElementById('comm-eq2-lhs');
const commAnswerInput = document.getElementById('comm-answer');
const commCheckButton = document.getElementById('comm-check-button');
const commNewButton = document.getElementById('comm-new-button');
const commFeedback = document.getElementById('comm-feedback');
let commNum1 = 0, commNum2 = 0, commProduct = 0;
let commAttempted = false;

function generateCommProblem() {
    console.log("--- [Commutative] NEW PROBLEM ---");
    commNum1 = window.getRandomInt(2, 9);
    commNum2 = window.getRandomInt(2, 9);
    // Ensure numbers are different for clarity
    while (commNum1 === commNum2) {
        commNum2 = window.getRandomInt(2, 9);
    }
    commProduct = commNum1 * commNum2;

    // Display problem
    if(commEq1Lhs) commEq1Lhs.textContent = `${commNum1} x ${commNum2}`;
    if(commEq1Rhs) commEq1Rhs.textContent = commProduct;
    if(commEq2Lhs) commEq2Lhs.textContent = `${commNum2} x ${commNum1}`;
    if(commAnswerInput) commAnswerInput.value = '';
    if(commFeedback) commFeedback.textContent = '';

    // *** Force reset the flag ***
    commAttempted = false;
    console.log(`[Commutative] Flag 'attemptedCommutative' RESET to: ${commAttempted}`);
}

function checkCommAnswer() {
    console.log(`[Commutative] CHECKING answer. Flag 'attemptedCommutative' is currently: ${commAttempted}`);
    const userAnswer = parseInt(commAnswerInput.value);
    let awardedPoints = 0;
    if (isNaN(userAnswer)) {
        commFeedback.textContent = 'Please enter a number.';
        commFeedback.className = 'feedback-message feedback-incorrect';
        return;
    }

    // Check if the answer is correct
    if (userAnswer === commProduct) {
        console.log("[Commutative] Answer is CORRECT.");
        // Award points only if it's the first attempt *for this specific problem*
        if (!commAttempted) {
            awardedPoints = 5; // Points for commutative property
            console.log(`[Commutative] First correct attempt! Awarding ${awardedPoints} points.`);

            // *** Explicitly check if updateScore exists before calling ***
            if (typeof window.updateScore === 'function') {
                console.log("[Commutative] Calling window.updateScore...");
                try {
                    window.updateScore(awardedPoints);
                    console.log("[Commutative] window.updateScore call completed.");
                } catch (e) {
                    console.error("[Commutative] Error calling window.updateScore:", e);
                }
            } else {
                console.error("[Commutative] window.updateScore function NOT FOUND!");
            }

            commFeedback.textContent = `Correct! 🎉 Both ways give the same answer! (+${awardedPoints} points!)`;
            // *** Set the flag immediately after successful first attempt processing ***
            commAttempted = true;
            console.log(`[Commutative] Flag 'attemptedCommutative' SET to: ${commAttempted}`);

        } else {
            // Correct answer, but not the first attempt for this problem
            console.log("[Commutative] Correct, but flag 'attemptedCommutative' is true. No points awarded.");
            commFeedback.textContent = 'Correct! 🎉 Both ways give the same answer!';
        }
        commFeedback.className = 'feedback-message feedback-correct';
    } else {
        // Incorrect answer
        console.log("[Commutative] Answer is INCORRECT.");
        commFeedback.textContent = `Not quite. Remember, ${commNum1} x ${commNum2} is the same as ${commNum2} x ${commNum1}. The answer is ${commProduct}. 😊`;
        commFeedback.className = 'feedback-message feedback-incorrect';

        // Set the flag if it was the first attempt (even if wrong)
        if (!commAttempted) {
            commAttempted = true;
            console.log(`[Commutative] Incorrect first attempt. Flag 'attemptedCommutative' SET to: ${commAttempted}`);
        }
    }
}

if(commCheckButton) commCheckButton.addEventListener('click', checkCommAnswer);
if(commNewButton) commNewButton.addEventListener('click', generateCommProblem);

// --- Associative Property Game ---
const assocA1 = document.getElementById('assoc-a1');
const assocB1 = document.getElementById('assoc-b1');
const assocC1 = document.getElementById('assoc-c1');
const assocA2 = document.getElementById('assoc-a2');
const assocB2 = document.getElementById('assoc-b2');
const assocC2 = document.getElementById('assoc-c2');
const assocAnswer1 = document.getElementById('assoc-answer1');
const assocAnswer2 = document.getElementById('assoc-answer2');
const assocCheckButton = document.getElementById('assoc-check-button');
const assocNewButton = document.getElementById('assoc-new-button');
const assocFeedback = document.getElementById('assoc-feedback');
let assocNumA = 0, assocNumB = 0, assocNumC = 0, assocProduct = 0;
let assocAttempted = false;

function generateAssocProblem() {
    assocNumA = window.getRandomInt(1, 5); // Keep numbers small
    assocNumB = window.getRandomInt(1, 5);
    assocNumC = window.getRandomInt(1, 5);
    assocProduct = assocNumA * assocNumB * assocNumC;

    if(assocA1) assocA1.textContent = assocNumA;
    if(assocB1) assocB1.textContent = assocNumB;
    if(assocC1) assocC1.textContent = assocNumC;
    if(assocA2) assocA2.textContent = assocNumA;
    if(assocB2) assocB2.textContent = assocNumB;
    if(assocC2) assocC2.textContent = assocNumC;
    if(assocAnswer1) assocAnswer1.value = '';
    if(assocAnswer2) assocAnswer2.value = '';
    if(assocFeedback) assocFeedback.textContent = '';
    assocAttempted = false;
}

function checkAssocAnswer() {
    const userAnswer1 = parseInt(assocAnswer1.value);
    const userAnswer2 = parseInt(assocAnswer2.value);
    let awardedPoints = 0;
    let correct1 = false;
    let correct2 = false;

    if (!isNaN(userAnswer1) && userAnswer1 === assocProduct) correct1 = true;
    if (!isNaN(userAnswer2) && userAnswer2 === assocProduct) correct2 = true;

    if (correct1 && correct2) {
         if (!assocAttempted) {
            awardedPoints = 10; // More points for this one
            updateScore(awardedPoints);
            assocFeedback.textContent = `Perfect! Both sides equal ${assocProduct}! ✨ (+${awardedPoints} points!)`;
        } else {
            assocFeedback.textContent = `Perfect! Both sides equal ${assocProduct}! ✨`;
        }
        assocFeedback.className = 'feedback-message feedback-correct';
    } else if (correct1 || correct2) {
        assocFeedback.textContent = 'One side is right! Keep trying on the other. The answer is ' + assocProduct;
        assocFeedback.className = 'feedback-message feedback-incorrect';
    } else {
         assocFeedback.textContent = 'Not quite. Both sides should equal ' + assocProduct;
         assocFeedback.className = 'feedback-message feedback-incorrect';
    }
    assocAttempted = true;
}

if(assocCheckButton) assocCheckButton.addEventListener('click', checkAssocAnswer);
if(assocNewButton) assocNewButton.addEventListener('click', generateAssocProblem);


// --- Zero Property Game ---
const zeroNum = document.getElementById('zero-num');
const zeroAnswerInput = document.getElementById('zero-answer');
const zeroCheckButton = document.getElementById('zero-check-button');
const zeroNewButton = document.getElementById('zero-new-button');
const zeroFeedback = document.getElementById('zero-feedback');
let zeroNumVal = 0;
let zeroAttempted = false;

function generateZeroProblem() {
    zeroNumVal = window.getRandomInt(1, 100);
    if(zeroNum) zeroNum.textContent = zeroNumVal;
    if(zeroAnswerInput) zeroAnswerInput.value = '';
    if(zeroFeedback) zeroFeedback.textContent = '';
    zeroAttempted = false;
}

function checkZeroAnswer() {
    const userAnswer = parseInt(zeroAnswerInput.value);
    let awardedPoints = 0;
     if (isNaN(userAnswer) && zeroAnswerInput.value !== '0') { // Allow '0' as input
        zeroFeedback.textContent = 'Please enter a number.';
        zeroFeedback.className = 'feedback-message feedback-incorrect';
        return;
    }

    if (userAnswer === 0) {
        if (!zeroAttempted) {
            awardedPoints = 5;
            updateScore(awardedPoints);
            zeroFeedback.textContent = `That's right! Anything times 0 is 0! 👍 (+${awardedPoints} points!)`;
        } else {
             zeroFeedback.textContent = `That's right! Anything times 0 is 0! 👍`;
        }
        zeroFeedback.className = 'feedback-message feedback-correct';
    } else {
        zeroFeedback.textContent = 'Remember the Magic Zero Rule! The answer is 0.';
        zeroFeedback.className = 'feedback-message feedback-incorrect';
    }
    zeroAttempted = true;
}

if(zeroCheckButton) zeroCheckButton.addEventListener('click', checkZeroAnswer);
if(zeroNewButton) zeroNewButton.addEventListener('click', generateZeroProblem);


// --- Identity Property Game ---
const identityNum = document.getElementById('identity-num');
const identityAnswerInput = document.getElementById('identity-answer');
const identityCheckButton = document.getElementById('identity-check-button');
const identityNewButton = document.getElementById('identity-new-button');
const identityFeedback = document.getElementById('identity-feedback');
let identityNumVal = 0;
let identityAttempted = false;

function generateIdentityProblem() {
    identityNumVal = window.getRandomInt(1, 100);
    if(identityNum) identityNum.textContent = identityNumVal;
    if(identityAnswerInput) identityAnswerInput.value = '';
    if(identityFeedback) identityFeedback.textContent = '';
    identityAttempted = false;
}

function checkIdentityAnswer() {
    const userAnswer = parseInt(identityAnswerInput.value);
    let awardedPoints = 0;
    if (isNaN(userAnswer)) {
        identityFeedback.textContent = 'Please enter a number.';
        identityFeedback.className = 'feedback-message feedback-incorrect';
        return;
    }

    if (userAnswer === identityNumVal) {
         if (!identityAttempted) {
            awardedPoints = 5;
            updateScore(awardedPoints);
            identityFeedback.textContent = `Yes! Multiplying by 1 keeps the number the same! 👍 (+${awardedPoints} points!)`;
        } else {
            identityFeedback.textContent = `Yes! Multiplying by 1 keeps the number the same! 👍`;
        }
        identityFeedback.className = 'feedback-message feedback-correct';
    } else {
        identityFeedback.textContent = `Remember the Magic One Rule! The answer is ${identityNumVal}.`;
        identityFeedback.className = 'feedback-message feedback-incorrect';
    }
    identityAttempted = true;
}

if(identityCheckButton) identityCheckButton.addEventListener('click', checkIdentityAnswer);
if(identityNewButton) identityNewButton.addEventListener('click', generateIdentityProblem);


// --- Initial Setup ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Properties page DOM loaded");
    generateCommProblem();
    generateAssocProblem();
    generateZeroProblem();
    generateIdentityProblem();
});
