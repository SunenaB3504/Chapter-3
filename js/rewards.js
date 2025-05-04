console.log("Rewards script loaded!");

function displayRewardsPageDetails() {
    const score = getScore(); // Get score from script.js
    const scoreDisplay = document.getElementById('rewards-page-score');
    const rewardsList = document.getElementById('rewards-list-details');

    if (scoreDisplay) {
        scoreDisplay.textContent = score;
    }

    if (rewardsList) {
        const rewardItems = rewardsList.querySelectorAll('li');
        rewardItems.forEach(item => {
            const requiredScore = parseInt(item.getAttribute('data-score'));
            const placeholder = item.querySelector('.trade-button-placeholder');
            placeholder.innerHTML = ''; // Clear previous button/text

            if (!isNaN(requiredScore) && score >= requiredScore) {
                item.classList.add('achieved');

                // Check if already traded (using a data attribute)
                if (item.getAttribute('data-traded') !== 'true') {
                    const tradeButton = document.createElement('button');
                    tradeButton.textContent = 'Trade In!';
                    tradeButton.classList.add('trade-button');
                    tradeButton.onclick = () => handleTrade(item, requiredScore);
                    placeholder.appendChild(tradeButton);
                } else {
                    placeholder.textContent = ' (Traded!)';
                    placeholder.style.fontWeight = 'normal';
                    placeholder.style.color = 'grey';
                }

            } else {
                item.classList.remove('achieved');
                item.removeAttribute('data-traded'); // Reset traded status if score drops below threshold
            }
        });
    }
}

function handleTrade(listItem, pointsValue) {
    // Confirmation dialog for parent
    const confirmationMessage = `Parent Confirmation:\n\nTrade ${pointsValue} points for this reward?\n\n(Points will be deducted)`;
    if (confirm(confirmationMessage)) {
        // Parent confirmed
        deductScore(pointsValue); // Call function from script.js

        // Mark as traded visually and prevent further trading
        listItem.setAttribute('data-traded', 'true'); // Mark item as traded

        // Update the display immediately
        displayRewardsPageDetails(); // Refresh the list to show changes
        displayScore(); // Refresh score in header (already done by deductScore, but safe to call)
        checkRewards(); // Refresh reward message in header (already done by deductScore, but safe to call)

        // Update the main score display on this page too
        const scoreDisplay = document.getElementById('rewards-page-score');
         if (scoreDisplay) {
            scoreDisplay.textContent = getScore();
        }

    } else {
        // Parent cancelled
        console.log("Trade cancelled by parent.");
    }
}

// Run when the DOM is loaded, after the main script has initialized the score display
document.addEventListener('DOMContentLoaded', displayRewardsPageDetails);
