console.log("Shopping Math script loaded!");

if (typeof window.getRandomInt !== 'function') {
    console.error("getRandomInt function not found on window object!");
    window.getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatCurrency(value) {
    return value.toFixed(0); // Use toFixed(2) if you want paise
}

const problemTextEl = document.getElementById('shopping-problem-text');
const answerInput = document.getElementById('shopping-answer');
const checkButton = document.getElementById('shopping-check-button');
const newButton = document.getElementById('shopping-new-problem-button');
const feedbackEl = document.getElementById('shopping-feedback');
const hintButton = document.getElementById('shopping-hint-button');
const hintDisplayEl = document.getElementById('shopping-hint-display');

const shoppingProblems = [
    {
        text: "Nia buys {num1} notebooks. Each notebook costs ₹{price}. How much does she spend on notebooks?",
        setup: () => {
            const num1 = window.getRandomInt(2, 5);
            const price = window.getRandomInt(15, 50);
            const answer = num1 * price;
            const hint = `Multiply the number of notebooks (${num1}) by the price of each notebook (₹${price}). Calculation: ${num1} x ${price} = ?`;
            return { num1, price, answer, hint };
        }
    },
    {
        text: "Nia buys {num1} pencils for ₹{price1} each and {num2} erasers for ₹{price2} each. What is the total cost?",
        setup: () => {
            const num1 = window.getRandomInt(3, 6);
            const price1 = window.getRandomInt(5, 10);
            const num2 = window.getRandomInt(2, 4);
            const price2 = window.getRandomInt(3, 5);
            const cost1 = num1 * price1;
            const cost2 = num2 * price2;
            const answer = cost1 + cost2;
            const hint = `First, find the cost of the pencils (${num1} x ₹${price1}). Then, find the cost of the erasers (${num2} x ₹${price2}). Finally, add the two costs together. Calculation: (${num1} x ${price1}) + (${num2} x ${price2}) = ?`;
            return { num1, price1, num2, price2, answer, hint };
        }
    },
    {
        text: "Nia buys {num1} packets of biscuits for ₹{price} each. She pays with a ₹{payment} note. How much change should she get back?",
        setup: () => {
            const num1 = window.getRandomInt(2, 4);
            const price = window.getRandomInt(10, 25);
            const totalCost = num1 * price;
            const payment = (totalCost <= 40) ? 50 : (totalCost <= 80 ? 100 : (totalCost <= 180 ? 200 : 500));
            const answer = payment - totalCost;
            const hint = `First, find the total cost of the biscuits (${num1} x ₹${price}). Then, subtract the total cost from the amount Nia paid (₹${payment}). Calculation: ${payment} - (${num1} x ${price}) = ?`;
            return { num1, price, payment, answer, hint };
        }
    },
    {
        text: "Nia has ₹{startMoney}. She buys a storybook for ₹{price1} and a chocolate bar for ₹{price2}. How much money does she have left?",
        setup: () => {
            const price1 = window.getRandomInt(50, 150);
            const price2 = window.getRandomInt(10, 40);
            const totalSpent = price1 + price2;
            const startMoney = window.getRandomInt(totalSpent + 10, totalSpent + 100);
            const answer = startMoney - totalSpent;
            const hint = `First, find the total amount Nia spent by adding the price of the storybook (₹${price1}) and the chocolate (₹${price2}). Then, subtract the total spent from the money she started with (₹${startMoney}). Calculation: ${startMoney} - (${price1} + ${price2}) = ?`;
            return { startMoney, price1, price2, answer, hint };
        }
    }
];

let currentProblemData = null;
let correctAnswer = 0;
let currentHint = "";
let attempted = false;
let hintUsed = false;

function generateProblem() {
    const templateIndex = window.getRandomInt(0, shoppingProblems.length - 1);
    const problemTemplate = shoppingProblems[templateIndex];

    currentProblemData = problemTemplate.setup();
    correctAnswer = currentProblemData.answer;
    currentHint = currentProblemData.hint;

    let problemDisplayText = problemTemplate.text;
    for (const key in currentProblemData) {
        if (key !== 'answer' && key !== 'hint') {
            const value = currentProblemData[key];
            problemDisplayText = problemDisplayText.replace(`{${key}}`, value);
            problemDisplayText = problemDisplayText.replace(`₹{${key}}`, `₹${formatCurrency(value)}`);
        }
    }

    if(problemTextEl) problemTextEl.textContent = problemDisplayText;

    if(answerInput) answerInput.value = '';
    if(feedbackEl) feedbackEl.textContent = '';
    if(hintDisplayEl) hintDisplayEl.textContent = '';
    attempted = false;
    hintUsed = false;
    if(hintButton) hintButton.disabled = false;
}

function checkAnswer() {
    const userAnswer = parseInt(answerInput.value);
    let awardedPoints = 0;

    if (isNaN(userAnswer)) {
        feedbackEl.textContent = 'Please enter a valid number (e.g., 50 or 125).';
        feedbackEl.className = 'feedback-message feedback-incorrect';
        return;
    }

    if (userAnswer === correctAnswer) {
        if (!attempted) {
            awardedPoints = 12;
            updateScore(awardedPoints);
            feedbackEl.textContent = `Correct! The answer is ₹${formatCurrency(correctAnswer)}! 🛒 (+${awardedPoints} points!)`;
        } else {
            feedbackEl.textContent = `Correct! The answer is ₹${formatCurrency(correctAnswer)}! 🛒`;
        }
        feedbackEl.className = 'feedback-message feedback-correct';
    } else {
        feedbackEl.textContent = `Not quite. The correct answer is ₹${formatCurrency(correctAnswer)}. Try using the hint or check your steps! 😊`;
        feedbackEl.className = 'feedback-message feedback-incorrect';
    }
    attempted = true;
}

function showHint() {
    if (!currentHint || !hintDisplayEl || hintUsed) return;
    hintDisplayEl.textContent = currentHint;
    if(hintButton) hintButton.disabled = true;
    hintUsed = true;
}

if(checkButton) checkButton.addEventListener('click', checkAnswer);
if(newButton) newButton.addEventListener('click', generateProblem);
if(hintButton) hintButton.addEventListener('click', showHint);
if(answerInput) {
    answerInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            checkAnswer();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("Shopping Math page DOM loaded");
    generateProblem();
});
