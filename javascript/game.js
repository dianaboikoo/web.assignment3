
const board = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const bestTimeDisplay = document.getElementById("bestTimeDisplay"); 
const scoreDisplay = document.getElementById("score");
const resetButton = document.getElementById("resetButton");

// Create an array of card values (8 pairs = 16 cards)
const cards = [];
for (let i = 1; i <= 8; i++) {
    cards.push(i, i);
}

// Shuffle the cards randomly
cards.sort(() => 0.5 - Math.random());


// Keys for permanent storage
const BEST_TIME_KEY = 'memoryGameBestTime'; 
// Key for Best Tries
const BEST_TRIES_KEY = 'memoryGameBestTries'; 

// Retrieve and initialize Best Time
let bestTime = localStorage.getItem(BEST_TIME_KEY);
bestTime = bestTime ? parseInt(bestTime) : Infinity; 

// Retrieve and initialize Best Tries (Lower is better)
let bestScoreTries = localStorage.getItem(BEST_TRIES_KEY);
bestScoreTries = bestScoreTries ? parseInt(bestScoreTries) : Infinity; 


// Game state variables
let firstCard = null;
let secondCard = null;
let pairsFound = 0; 
let tries = 0; 

let lockBoard = false;
let timer = 0;
let timerInterval;
let timerStarted = false;


bestTimeDisplay.textContent = formatTime(bestTime);

// Initialize the Score display with the Best Tries score
scoreDisplay.textContent = `Best Tries: ${formatTries(bestScoreTries)} | Current: ${tries}`; 


// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerDisplay.textContent = formatTime(timer);
    }, 1000);
}

// Format time as MM:SS (Handles Infinity for 'N/A' or initial display)
function formatTime(seconds) {
    if (seconds === Infinity) return 'N/A';
    
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
}

//  Function to format Tries display (Handles Infinity)
function formatTries(tries) {
    return tries === Infinity ? 'N/A' : tries;
}

// Function to check for win and update the score/record
function updateGameEndScore(isMatch) {
    // If a match was found, increment the pairs count
    if (isMatch) {
        pairsFound++; 
    }
    
    // Update the on-screen tries counter
    scoreDisplay.textContent = `Best Tries: ${formatTries(bestScoreTries)} | Current: ${tries}`; 

    // If all 8 pairs are matched, the game ends
    if (pairsFound === 8) {
        clearInterval(timerInterval);
        
        let winMessage = "You Win!";

        // Check for new best time record
        if (timer < bestTime) {
            bestTime = timer;
            localStorage.setItem(BEST_TIME_KEY, bestTime); 
            bestTimeDisplay.textContent = formatTime(bestTime);
            winMessage += " (New Time Record!)";
        }
        
        // Check for new best tries record
       
        if (tries < bestScoreTries) {
            bestScoreTries = tries; // Update the internal variable
            localStorage.setItem(BEST_TRIES_KEY, bestScoreTries); // Store permanently
            
            // Update the score display to show the new record prominently
            scoreDisplay.textContent = `NEW RECORD: ${tries} Tries!`;
            winMessage = "NEW BEST TRIES!"; // Prioritize the tries record message
        } else {
            // Ensure the score display is accurate at the end of the game
            scoreDisplay.textContent = `Best Tries: ${formatTries(bestScoreTries)} | Final: ${tries}`;
        }
        

        setTimeout(() => {
            // Display the final win/record message
            document.getElementById("score").textContent = winMessage;
        }, 500);
    }
}

//Card Click Handler (Game Logic)
function handleCardClick() {
    const card = this;

    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    if (lockBoard || card.src.includes("card")) return;

    card.src = `images/card${card.dataset.value}.png`;

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        lockBoard = true;
        
        // Increment the 'tries' count on the second card flip (completed turn)
        tries++; 
        
        if (firstCard.dataset.value === secondCard.dataset.value) {
            // Match found
            firstCard.removeEventListener("click", handleCardClick);
            secondCard.removeEventListener("click", handleCardClick);

            updateGameEndScore(true); 
            
            firstCard = null;
            secondCard = null;
            lockBoard = false;
        } else {
            
            updateGameEndScore(false); 

            setTimeout(() => {
                firstCard.src = "images/back.png";
                secondCard.src = "images/back.png";
                
                firstCard = null;
                secondCard = null;
                lockBoard = false;
            }, 1000);
        }
    }
}


// Function to Create and Display all Cards
function renderCards() {
    board.innerHTML = ""; 

    cards.sort(() => 0.5 - Math.random());

    cards.forEach((num, index) => {
        const card = document.createElement("img");
        card.src = "images/back.png";
        card.classList.add("card");
        card.dataset.index = index;
        card.dataset.value = num;
        board.appendChild(card);

        card.addEventListener("click", handleCardClick);
    });
}


//  Game Reset Function
function resetGame() {
    // 1. Stop and Reset the Timer
    clearInterval(timerInterval);
    timer = 0;
    timerStarted = false;
    timerDisplay.textContent = formatTime(0);

    // 2. Reset the Tries and Pairs Found counts
    pairsFound = 0; 
    tries = 0; 
    
    
    scoreDisplay.textContent = `Best Tries: ${formatTries(bestScoreTries)} | Current: 0`; 

    // 3. Reset Game State Variables
    firstCard = null;
    secondCard = null;
    lockBoard = false;

    // 4. Shuffle and Re-render the Cards
    renderCards();
}

renderCards();


resetButton.addEventListener("click", resetGame);