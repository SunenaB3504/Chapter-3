console.log("Rewards script loaded!");


// --- Reward Definitions ---
// Structure: id: { name: "Reward Name", cost: points, claimed: false }
const availableRewards = {
    reward1: { name: "✨ Sparkle Sticker Pack", cost: 30, claimed: false },
    reward2: { name: "🚀 Rocket Racer Badge", cost: 75, claimed: false },
    reward3: { name: "🌟 Super Star Certificate", cost: 150, claimed: false },
    reward4: { name: "🎨 Extra Drawing Colors", cost: 250, claimed: false },
    // Added new rewards
    reward5: { name: "🍬 Candy Treat", cost: 500, claimed: false },
    reward6: { name: "🍦 Ice Cream Cone", cost: 1000, claimed: false },
    reward7: { name: "🍔 Burger Bonus", cost: 2000, claimed: false },
    reward8: { name: "🍗 Fried Chicken Feast", cost: 3000, claimed: false },
    reward9: { name: "🍕 Pizza Party Slice", cost: 4000, claimed: false },
    reward10: { name: "📚 New Story Book", cost: 5000, claimed: false },
    reward11: { name: "🎁 Surprise Toy", cost: 10000, claimed: false }
};

// --- DOM Elements ---
let rewardsScoreDisplay = null;
let rewardsListElement = null;
let claimFeedbackElement = null;

// --- Functions ---

// Load claimed status from localStorage
function loadRewardStatus() {
    try {
        const claimedStatus = localStorage.getItem('niaAdventureClaimedRewards');
        if (claimedStatus) {
            const claimedData = JSON.parse(claimedStatus);
            for (const id in availableRewards) {
                if (claimedData[id] === true) {
                    availableRewards[id].claimed = true;
                }
            }
            console.log("Loaded claimed reward status:", availableRewards);
        } else {
            console.log("No claimed reward status found in localStorage.");
        }
    } catch (error) {
        console.error("Error loading claimed reward status:", error);
    }
}

// Save claimed status to localStorage
function saveRewardStatus() {
    try {
        const claimedData = {};
        for (const id in availableRewards) {
            if (availableRewards[id].claimed) {
                claimedData[id] = true;
            }
        }
        localStorage.setItem('niaAdventureClaimedRewards', JSON.stringify(claimedData));
        console.log("Saved claimed reward status:", claimedData);
    } catch (error) {
        console.error("Error saving claimed reward status:", error);
    }
}

// Render the list of rewards
function displayRewards() {
    if (!rewardsListElement) return;
    rewardsListElement.innerHTML = ''; // Clear loading message

    // Ensure currentScore is available (loaded by script.js)
    const score = (typeof currentScore !== 'undefined') ? currentScore : 0;

    for (const id in availableRewards) {
        const reward = availableRewards[id];
        const li = document.createElement('li');

        const infoDiv = document.createElement('div');
        infoDiv.className = 'reward-info';
        const nameSpan = document.createElement('span');
        nameSpan.textContent = reward.name;
        const costSpan = document.createElement('span');
        costSpan.className = 'cost';
        costSpan.textContent = `Cost: ${reward.cost} points`;
        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(costSpan);

        const claimButton = document.createElement('button');
        claimButton.dataset.rewardId = id; // Store reward ID on the button

        if (reward.claimed) {
            claimButton.textContent = 'Claimed ✔️';
            claimButton.disabled = true;
        } else if (score >= reward.cost) {
            claimButton.textContent = 'Claim';
            claimButton.disabled = false;
            claimButton.addEventListener('click', handleClaimReward);
        } else {
            claimButton.textContent = 'Need More Points';
            claimButton.disabled = true;
        }

        li.appendChild(infoDiv);
        li.appendChild(claimButton);
        rewardsListElement.appendChild(li);
    }
}

// Handle clicking the "Claim" button
function handleClaimReward(event) {
    const button = event.target;
    const rewardId = button.dataset.rewardId;
    const reward = availableRewards[rewardId];
    const score = (typeof currentScore !== 'undefined') ? currentScore : 0;

    if (claimFeedbackElement) claimFeedbackElement.textContent = ''; // Clear previous feedback

    if (reward && !reward.claimed && score >= reward.cost) {
        console.log(`Attempting to claim reward: ${rewardId}`);

        // 1. Deduct points (using a function that updates global score and saves)
        const pointsToDeduct = -reward.cost; // Negative value for deduction
        if (typeof updateScore === 'function') {
            updateScore(pointsToDeduct); // This function should handle saving score
        } else {
            console.error("updateScore function not found!");
            // Manual update as fallback (less ideal)
            currentScore += pointsToDeduct;
            if (typeof updateScoreDisplay === 'function') updateScoreDisplay();
            if (typeof saveScormData === 'function') saveScormData(); // Or just save localStorage part
            else localStorage.setItem('niaAdventureScore', currentScore.toString());
        }


        // 2. Mark as claimed
        reward.claimed = true;

        // 3. Save claimed status
        saveRewardStatus();

        // 4. Update UI
        updateScoreDisplayOnPage(); // Update score on this page
        displayRewards(); // Re-render the list to update button states

        // 5. Show feedback
        if (claimFeedbackElement) {
            claimFeedbackElement.textContent = `🎉 You claimed the ${reward.name}! 🎉`;
            claimFeedbackElement.className = 'feedback-message feedback-correct';
        }

    } else {
        console.warn(`Could not claim reward: ${rewardId}. Reward found: ${!!reward}, Claimed: ${reward?.claimed}, Score: ${score}, Cost: ${reward?.cost}`);
        if (claimFeedbackElement) {
            claimFeedbackElement.textContent = 'Cannot claim this reward right now.';
            claimFeedbackElement.className = 'feedback-message feedback-incorrect';
        }
    }
}

// Update the score display specifically on this rewards page
function updateScoreDisplayOnPage() {
     if (rewardsScoreDisplay) {
        const score = (typeof currentScore !== 'undefined') ? currentScore : 0;
        rewardsScoreDisplay.textContent = score;
    }
}


// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Rewards page DOM loaded.");

    // Get elements
    rewardsScoreDisplay = document.getElementById('rewards-score-display');
    rewardsListElement = document.getElementById('rewards-list');
    claimFeedbackElement = document.getElementById('claim-feedback');

    // Load status from storage
    loadRewardStatus();

    // Display current score (should be loaded by script.js)
    updateScoreDisplayOnPage();

    // Display the rewards list
    displayRewards();

});
