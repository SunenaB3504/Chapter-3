console.log("--- SIMPLIFIED Introduction script loaded! v2 ---"); // Add a version number

// --- Game Elements ---
// Declare with let, but don't assign yet
let visualEl = null;
let textEl = null;
let additionInput = null;
let multiplyInput = null;
let checkButton = null;
let newButton = null;
let feedbackEl = null;

// --- Game State ---
let groups, itemsPerGroup, totalItems;
let correctAdditionString, correctMultiplyString;
let attemptedIntro = false;

// --- Emojis for Visuals ---
const itemEmojis = ['🍎', '🍌', '🍇', '🍉', '🍓', '🍒'];

// --- Functions ---

function generateProblem() {
    console.log("[Intro Game] generateProblem function called.");
    // Ensure elements are assigned before using them
    if (!visualEl || !textEl) {
        console.error("[Intro Game] generateProblem called before elements were assigned!");
        return; // Exit if elements aren't ready
    }
    groups = window.getRandomInt(2, 5);
    itemsPerGroup = window.getRandomInt(2, 6);
    totalItems = groups * itemsPerGroup;

    // Generate visual representation
    let visual = "";
    const randomEmoji = itemEmojis[window.getRandomInt(0, itemEmojis.length - 1)];
    for (let i = 0; i < groups; i++) {
        visual += `<span>${randomEmoji.repeat(itemsPerGroup)}</span>` + (i < groups - 1 ? ' + ' : '');
    }
    console.log(`[Intro Game] Updating visualEl. Setting innerHTML to: ${visual}`);
    visualEl.innerHTML = visual; // Now uses the assigned global variable

    // Generate text description
    const problemDescription = `${groups} groups of ${itemsPerGroup}`;
    console.log(`[Intro Game] Updating textEl. Setting textContent to: ${problemDescription}`);
    textEl.textContent = problemDescription; // Now uses the assigned global variable

    // Generate correct answers
    correctAdditionString = Array(groups).fill(itemsPerGroup).join('+');
    correctMultiplyString = `${groups}x${itemsPerGroup}=${totalItems}`;

    // Clear inputs and feedback
    if (additionInput) additionInput.value = ''; else console.warn("[Intro Game] additionInput not found for clearing.");
    if (multiplyInput) multiplyInput.value = ''; else console.warn("[Intro Game] multiplyInput not found for clearing.");
    if (feedbackEl) feedbackEl.textContent = ''; else console.warn("[Intro Game] feedbackEl not found for clearing.");
    attemptedIntro = false;
    console.log(`[Intro Game] New problem generated. Correct Add: ${correctAdditionString}, Correct Mult: ${correctMultiplyString}`);
}

function normalizeInput(inputStr) {
    return inputStr.replace(/\s+/g, '').replace(/[*xX]/g, 'x');
}

function checkAnswer() {
    console.log(`[Intro Game] checkAnswer function called. Attempted: ${attemptedIntro}`);
     // Ensure elements are assigned before using them
    if (!additionInput || !multiplyInput || !feedbackEl) {
        console.error("[Intro Game] checkAnswer called before input/feedback elements were assigned!");
        return; // Exit if elements aren't ready
    }

    const userAddition = normalizeInput(additionInput.value);
    const userMultiply = normalizeInput(multiplyInput.value);
    const normalizedCorrectAddition = normalizeInput(correctAdditionString);
    const normalizedCorrectMultiply = normalizeInput(correctMultiplyString);

    let additionCorrect = (userAddition === normalizedCorrectAddition);
    let multiplyCorrect = (userMultiply === normalizedCorrectMultiply);
    let awardedPoints = 0;

    console.log(`User Add: '${userAddition}', Correct Add: '${normalizedCorrectAddition}' -> ${additionCorrect}`);
    console.log(`User Mult: '${userMultiply}', Correct Mult: '${normalizedCorrectMultiply}' -> ${multiplyCorrect}`);

    if (additionCorrect && multiplyCorrect) {
        if (!attemptedIntro) {
            awardedPoints = 5;
            console.log(`Correct first attempt! Awarding ${awardedPoints} points.`);
            if (typeof window.updateScore === 'function') {
                window.updateScore(awardedPoints);
            } else {
                console.error("window.updateScore function is NOT available!");
            }
            feedbackEl.textContent = `Perfect! You understand repeated addition and multiplication! (+${awardedPoints} points!)`;
        } else {
            console.log("Correct, but not the first attempt.");
            feedbackEl.textContent = 'Perfect! You understand repeated addition and multiplication!';
        }
        feedbackEl.className = 'feedback-message feedback-correct';
        attemptedIntro = true;
    } else {
        let errorMsg = "Not quite right. ";
        if (!additionCorrect && multiplyCorrect) {
            errorMsg += `Check the addition. It should be ${correctAdditionString}.`;
        } else if (additionCorrect && !multiplyCorrect) {
            errorMsg += `Check the multiplication. It should be ${correctMultiplyString}.`;
        } else {
            errorMsg += `Check both the addition (should be ${correctAdditionString}) and the multiplication (should be ${correctMultiplyString}).`;
        }
        feedbackEl.textContent = errorMsg + " 🤔";
        feedbackEl.className = 'feedback-message feedback-incorrect';
        if (!attemptedIntro) {
            attemptedIntro = true;
            console.log("Incorrect first attempt. Setting attemptedIntro to true.");
        }
    }
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Introduction page DOM loaded");

    // Assign elements to the global 'let' variables
    visualEl = document.getElementById('intro-problem-visual');
    textEl = document.getElementById('intro-problem-text');
    additionInput = document.getElementById('intro-addition-answer');
    multiplyInput = document.getElementById('intro-multiply-answer');
    checkButton = document.getElementById('intro-check-button'); // Assign to global checkButton
    newButton = document.getElementById('intro-new-problem-button');   // Assign to global newButton
    feedbackEl = document.getElementById('intro-feedback');

    console.log("Global element variables assigned inside DOMContentLoaded:", {
        visualEl: !!visualEl,
        textEl: !!textEl,
        additionInput: !!additionInput,
        multiplyInput: !!multiplyInput,
        checkButton: !!checkButton,
        newButton: !!newButton,
        feedbackEl: !!feedbackEl
    });

    // Attach listeners using the now assigned global variables
    if (checkButton) {
        console.log("Attaching listener to Check button (intro-check-button)");
        checkButton.addEventListener('click', checkAnswer);
    } else {
        console.error("Check button (intro-check-button) not found!");
    }

    if (newButton) {
        console.log("Attaching listener to New Problem button (intro-new-problem-button)");
        newButton.addEventListener('click', generateProblem);
    } else {
        console.error("New Problem button (intro-new-problem-button) not found!");
    }

    if (multiplyInput) {
        console.log("Attaching keypress listener to multiply input (intro-multiply-answer)");
        multiplyInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                console.log("[Intro Game] Enter key pressed in multiply input.");
                event.preventDefault();
                checkAnswer();
            }
        });
    } else {
         console.warn("Multiply input (intro-multiply-answer) not found for Enter key listener.");
    }

    // Generate initial problem only if essential elements were successfully assigned
    if (visualEl && textEl && additionInput && multiplyInput && checkButton && newButton && feedbackEl) {
         console.log("All essential elements assigned, generating initial problem...");
         generateProblem();
    } else {
        console.error("One or more essential elements for the introduction game could not be assigned! Cannot generate initial problem.");
    }
});

console.log("--- SIMPLIFIED Introduction script finished! v2 ---");
