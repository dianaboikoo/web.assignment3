document.addEventListener('DOMContentLoaded', () => {

    const gameBoard = document.getElementById('game-board');

    for (let i = 0; i < 16; i++) {
        
        const card = document.createElement('div');
        
        card.classList.add('card');

        card.innerHTML = `
            <div class="card-face card-back">?</div>
            <div class="card-face card-front"></div>
        `;
        
        gameBoard.appendChild(card);
    }

});