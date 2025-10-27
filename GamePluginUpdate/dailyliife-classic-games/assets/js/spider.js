/**
 * Spider Solitaire Game v1.7.3
 */

class SpiderGame extends GameCore {
    constructor(container) {
        super(container);
        this.board = container.querySelector('#spider-board');
        this.numSuits = parseInt(this.board.dataset.suits) || 1;
        
        this.stock = [];
        this.tableau = [[], [], [], [], [], [], [], [], [], []];
        this.completed = 0;
        
        this.draggedCards = null;
        this.dragSource = null;
        this.moves = 0;
        this.firstMove = true;
        
        this.initGame();
    }
    
    initControls() {
        const newGameBtn = this.container.querySelector('.dlcg-new-game');
        const undoBtn = this.container.querySelector('.dlcg-undo');
        const autoPlayBtn = this.container.querySelector('.dlcg-auto-play');
        const soundToggle = this.container.querySelector('.dlcg-sound-toggle');
        
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.showDifficultyModal());
        }
        
        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.undo());
            this.undoBtn = undoBtn;
            this.updateUndoButton();
        }
        
        if (autoPlayBtn) {
            autoPlayBtn.addEventListener('click', () => this.toggleAutoPlay());
            this.autoPlayBtn = autoPlayBtn;
        }
        
        if (soundToggle) {
            soundToggle.addEventListener('click', () => this.toggleSound());
            this.soundToggle = soundToggle;
        }
    }
    
    showDifficultyModal() {
        if (!this.difficultyModal) {
            this.createDifficultyModal();
        }
        this.difficultyModal.style.display = 'flex';
    }
    
    createDifficultyModal() {
        this.difficultyModal = document.createElement('div');
        this.difficultyModal.className = 'dlcg-modal';
        this.difficultyModal.innerHTML = `
            <div class="dlcg-modal-content">
                <h3>Choose Difficulty</h3>
                <p>Select the number of suits to use:</p>
                <div class="dlcg-modal-buttons">
                    <button class="dlcg-btn dlcg-modal-btn" data-suits="1">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0z"/>
                        </svg>
                        <div>Single Suit</div>
                        <small>1 Suit (Easy)</small>
                    </button>
                    <button class="dlcg-btn dlcg-modal-btn" data-suits="2">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        <div>2 Suits</div>
                        <small>2 Suits (Medium)</small>
                    </button>
                    <button class="dlcg-btn dlcg-modal-btn" data-suits="4">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M4 11.794V8.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v3.294l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L4 11.794zM10.5 4a.5.5 0 0 0-.5.5v3.294L8.854 6.647a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L11 7.794V4.5a.5.5 0 0 0-.5-.5z"/>
                        </svg>
                        <div>4 Suits</div>
                        <small>4 Suits (Hard)</small>
                    </button>
                </div>
                <button class="dlcg-btn dlcg-modal-close">Cancel</button>
            </div>
        `;
        
        const singleBtn = this.difficultyModal.querySelector('[data-suits="1"]');
        const twoBtn = this.difficultyModal.querySelector('[data-suits="2"]');
        const fourBtn = this.difficultyModal.querySelector('[data-suits="4"]');
        const closeBtn = this.difficultyModal.querySelector('.dlcg-modal-close');
        
        singleBtn.addEventListener('click', () => {
            this.numSuits = 1;
            this.board.dataset.suits = '1';
            this.updateDifficultyDisplay();
            this.difficultyModal.style.display = 'none';
            this.startNewGame();
        });
        
        twoBtn.addEventListener('click', () => {
            this.numSuits = 2;
            this.board.dataset.suits = '2';
            this.updateDifficultyDisplay();
            this.difficultyModal.style.display = 'none';
            this.startNewGame();
        });
        
        fourBtn.addEventListener('click', () => {
            this.numSuits = 4;
            this.board.dataset.suits = '4';
            this.updateDifficultyDisplay();
            this.difficultyModal.style.display = 'none';
            this.startNewGame();
        });
        
        closeBtn.addEventListener('click', () => {
            this.difficultyModal.style.display = 'none';
        });
        
        this.difficultyModal.addEventListener('click', (e) => {
            if (e.target === this.difficultyModal) {
                this.difficultyModal.style.display = 'none';
            }
        });
        
        this.container.appendChild(this.difficultyModal);
    }
    
    updateDifficultyDisplay() {
        const modeDisplay = this.container.querySelector('.dlcg-game-mode');
        if (modeDisplay) {
            const difficulty = this.numSuits === 1 ? 'Easy' : (this.numSuits === 2 ? 'Medium' : 'Hard');
            modeDisplay.textContent = `${this.numSuits} Suit${this.numSuits !== 1 ? 's' : ''} (${difficulty})`;
        }
    }
    
    startNewGame() {
        this.newGame();
    }
    
    initGame() {
        this.renderBoard();
        this.newGame();
    }
    
    renderBoard() {
        this.board.innerHTML = '';
        this.board.className = 'dlcg-game-board';
        
        const layout = document.createElement('div');
        layout.className = 'spider-layout';
        
        const controls = document.createElement('div');
        controls.className = 'spider-controls';
        
        const stockDiv = document.createElement('div');
        stockDiv.className = 'spider-stock';
        
        for (let i = 0; i < 5; i++) {
            const stockPile = this.createPile(`stock-${i}`);
            stockPile.addEventListener('click', () => this.dealFromStock());
            stockDiv.appendChild(stockPile);
        }
        
        controls.appendChild(stockDiv);
        
        const completedDiv = document.createElement('div');
        completedDiv.className = 'dlcg-stat';
        completedDiv.innerHTML = '✅ Completed: <span id="completed-count">0</span> / 8';
        controls.appendChild(completedDiv);
        
        layout.appendChild(controls);
        
        const tableauDiv = document.createElement('div');
        tableauDiv.className = 'spider-tableau';
        for (let i = 0; i < 10; i++) {
            const pile = this.createPile(`tableau-${i}`, 'tableau-pile');
            pile.dataset.index = i;
            tableauDiv.appendChild(pile);
        }
        layout.appendChild(tableauDiv);
        
        this.board.appendChild(layout);
    }
    
    createPile(id, className = 'card-pile') {
        const pile = document.createElement('div');
        pile.id = id;
        pile.className = className;
        pile.classList.add('card-pile');
        return pile;
    }
    
    newGame() {
        super.newGame();
        
        let suits;
        let numDecks;
        if (this.numSuits === 1) {
            suits = ['spades'];
            numDecks = 8;
        } else if (this.numSuits === 2) {
            suits = ['spades', 'hearts'];
            numDecks = 4;
        } else {
            suits = ['spades', 'hearts', 'diamonds', 'clubs'];
            numDecks = 2;
        }
        
        const deck = new Deck(numDecks, suits);
        deck.shuffle();
        
        this.stock = [];
        this.tableau = [[], [], [], [], [], [], [], [], [], []];
        this.completed = 0;
        this.moves = 0;
        this.firstMove = true;
        
        for (let i = 0; i < 54; i++) {
            const card = deck.deal(1)[0];
            const pileIndex = i % 10;
            if (i >= 44) {
                card.faceUp = true;
            }
            this.tableau[pileIndex].push(card);
        }
        
        this.stock = deck.cards;
        
        this.saveCurrentState();
        this.render();
    }
    
    saveCurrentState() {
        const state = {
            stock: this.stock.map(c => ({suit: c.suit, rank: c.rank, faceUp: c.faceUp})),
            tableau: this.tableau.map(t => t.map(c => ({suit: c.suit, rank: c.rank, faceUp: c.faceUp}))),
            completed: this.completed,
            moves: this.moves,
            seconds: this.seconds
        };
        this.saveState(state);
    }
    
    restoreState(state) {
        this.stock = state.stock.map(c => new Card(c.suit, c.rank, c.faceUp));
        this.tableau = state.tableau.map(t => t.map(c => new Card(c.suit, c.rank, c.faceUp)));
        this.completed = state.completed;
        this.moves = state.moves;
        this.seconds = state.seconds;
        this.updateTimerDisplay();
        this.render();
    }
    
    render() {
        this.renderStock();
        this.renderTableau();
        document.getElementById('completed-count').textContent = this.completed;
        this.checkForCompletedSuits();
        
        if (this.autoPlayEnabled) {
            setTimeout(() => this.performAutoPlay(), 100);
        }
    }
    
    renderStock() {
        const stocksRemaining = Math.ceil(this.stock.length / 10);
        for (let i = 0; i < 5; i++) {
            const stockPile = document.getElementById(`stock-${i}`);
            stockPile.innerHTML = '';
            
            if (i < stocksRemaining) {
                const card = new Card('spades', 'A', false);
                const cardEl = card.createElement();
                stockPile.appendChild(cardEl);
            }
        }
    }
    
    renderTableau() {
        for (let i = 0; i < 10; i++) {
            const tableauPile = document.querySelector(`#tableau-${i}`);
            tableauPile.innerHTML = '';
            
            const pile = this.tableau[i];
            pile.forEach((card, cardIndex) => {
                const cardEl = card.createElement();
                cardEl.style.position = 'absolute';
                cardEl.style.top = `${cardIndex * 25}px`;
                
                if (card.faceUp) {
                    cardEl.draggable = true;
                    this.addCardListeners(cardEl, 'tableau', i, cardIndex);
                }
                
                tableauPile.appendChild(cardEl);
            });
            
            this.addDropZone(tableauPile, 'tableau', i);
        }
    }
    
    addCardListeners(cardEl, source, pileIndex, cardIndex) {
        cardEl.addEventListener('dragstart', (e) => this.onDragStart(e, source, pileIndex, cardIndex));
        cardEl.addEventListener('click', () => this.onCardClick(pileIndex, cardIndex));
        cardEl.addEventListener('dblclick', () => this.onCardDoubleClick(pileIndex, cardIndex));
    }
    
    addDropZone(element, target, index) {
        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            element.classList.add('highlight');
        });
        
        element.addEventListener('dragleave', () => {
            element.classList.remove('highlight');
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            element.classList.remove('highlight');
            this.onDrop(target, index);
        });
    }
    
    onDragStart(e, source, pileIndex, cardIndex) {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        const pile = this.tableau[pileIndex];
        const cards = pile.slice(cardIndex);
        
        if (!this.isValidSequence(cards)) {
            e.preventDefault();
            window.SoundManager.play('invalid');
            return;
        }
        
        this.draggedCards = cards;
        this.dragSource = {source, pileIndex, cardIndex};
        
        e.dataTransfer.effectAllowed = 'move';
    }
    
    onCardClick(pileIndex, cardIndex) {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        const pile = this.tableau[pileIndex];
        if (cardIndex !== pile.length - 1) return;
        
        const card = pile[cardIndex];
        
        for (let i = 0; i < 10; i++) {
            if (i !== pileIndex && this.canMoveToTableau([card], i)) {
                this.draggedCards = [card];
                this.dragSource = {source: 'tableau', pileIndex, cardIndex};
                this.moveToTableau(i);
                window.SoundManager.play('place');
                return;
            }
        }
    }
    
    onCardDoubleClick(pileIndex, cardIndex) {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        const pile = this.tableau[pileIndex];
        const cards = pile.slice(cardIndex);
        
        if (!this.isValidSequence(cards)) {
            window.SoundManager.play('invalid');
            return;
        }
        
        for (let i = 0; i < 10; i++) {
            if (i !== pileIndex && this.canMoveToTableau(cards, i)) {
                this.draggedCards = cards;
                this.dragSource = {source: 'tableau', pileIndex, cardIndex};
                this.moveToTableau(i);
                window.SoundManager.play('place');
                return;
            }
        }
    }
    
    isValidSequence(cards) {
        if (cards.length === 1) return true;
        
        for (let i = 0; i < cards.length - 1; i++) {
            if (cards[i].suit !== cards[i + 1].suit) return false;
            if (cards[i].rankValue !== cards[i + 1].rankValue + 1) return false;
        }
        return true;
    }
    
    onDrop(target, tableauIndex) {
        if (!this.draggedCards || !this.dragSource) return;
        
        const valid = this.canMoveToTableau(this.draggedCards, tableauIndex);
        
        if (valid) {
            this.moveToTableau(tableauIndex);
            window.SoundManager.play('place');
        } else {
            window.SoundManager.play('invalid');
        }
        
        this.draggedCards = null;
        this.dragSource = null;
    }
    
    canMoveToTableau(cards, tableauIndex) {
        const pile = this.tableau[tableauIndex];
        
        if (pile.length === 0) return true;
        
        const topCard = pile[pile.length - 1];
        const movingCard = cards[0];
        
        return movingCard.rankValue === topCard.rankValue - 1;
    }
    
    moveToTableau(tableauIndex) {
        const {pileIndex, cardIndex} = this.dragSource;
        
        if (pileIndex === tableauIndex) return;
        
        const cards = this.tableau[pileIndex].splice(cardIndex);
        this.tableau[tableauIndex].push(...cards);
        
        if (this.tableau[pileIndex].length > 0) {
            const lastCard = this.tableau[pileIndex][this.tableau[pileIndex].length - 1];
            if (!lastCard.faceUp) {
                lastCard.flip();
                window.SoundManager.play('flip');
            }
        }
        
        this.moves++;
        this.saveCurrentState();
        this.render();
    }
    
    dealFromStock() {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        if (this.stock.length === 0) {
            window.SoundManager.play('invalid');
            this.showMessage('No more cards in stock!', 'info');
            return;
        }
        
        const emptyPiles = [];
        this.tableau.forEach((pile, index) => {
            if (pile.length === 0) {
                emptyPiles.push(index + 1);
            }
        });
        
        if (emptyPiles.length > 0) {
            window.SoundManager.play('invalid');
            this.showMessage(
                `Cannot deal from stock!<br><br>Please fill empty tableau column${emptyPiles.length > 1 ? 's' : ''}: ${emptyPiles.join(', ')}`,
                'warning'
            );
            return;
        }
        
        for (let i = 0; i < 10; i++) {
            if (this.stock.length > 0) {
                const card = this.stock.shift();
                card.faceUp = true;
                this.tableau[i].push(card);
            }
        }
        
        window.SoundManager.play('flip');
        this.saveCurrentState();
        this.render();
    }
    
    checkForCompletedSuits() {
        for (let i = 0; i < 10; i++) {
            const pile = this.tableau[i];
            if (pile.length >= 13) {
                const last13 = pile.slice(-13);
                
                if (this.isCompleteSuit(last13)) {
                    this.animateCompletedStack(i, () => {
                        pile.splice(-13, 13);
                        this.completed++;
                        window.SoundManager.play('win');
                        
                        if (pile.length > 0) {
                            const lastCard = pile[pile.length - 1];
                            if (!lastCard.faceUp) {
                                lastCard.flip();
                            }
                        }
                        
                        this.render();
                        this.checkWin();
                    });
                }
            }
        }
    }
    
    animateCompletedStack(pileIndex, callback) {
        const tableauPile = document.querySelector(`#tableau-${pileIndex}`);
        const cards = Array.from(tableauPile.querySelectorAll('.playing-card')).slice(-13);
        
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease';
                card.style.transform = 'translateY(-20px) scale(1.1)';
                card.style.opacity = '0.8';
            }, index * 30);
        });
        
        setTimeout(() => {
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.transform = 'translateY(1000px) rotate(360deg)';
                    card.style.opacity = '0';
                }, index * 30);
            });
        }, 500);
        
        setTimeout(callback, 1500);
    }
    
    isCompleteSuit(cards) {
        if (cards.length !== 13) return false;
        
        const suit = cards[0].suit;
        const ranks = ['K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];
        
        for (let i = 0; i < 13; i++) {
            if (cards[i].suit !== suit || cards[i].rank !== ranks[i]) {
                return false;
            }
        }
        
        return true;
    }
    
    performAutoPlay() {
        if (!this.autoPlayEnabled) return;
        
        this.checkForCompletedSuits();
    }
    
    showMessage(message, type = 'info') {
        if (!this.messageModal) {
            this.messageModal = document.createElement('div');
            this.messageModal.className = 'dlcg-modal';
            this.container.appendChild(this.messageModal);
        }
        
        const iconSVG = type === 'warning' 
            ? '<svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor" style="color: #f59e0b;"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>'
            : '<svg width="48" height="48" viewBox="0 0 16 16" fill="currentColor" style="color: #0891b2;"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>';
        
        this.messageModal.innerHTML = `
            <div class="dlcg-modal-content">
                <div style="text-align: center; margin-bottom: 20px;">
                    ${iconSVG}
                </div>
                <p style="font-size: 18px; margin: 0;">${message}</p>
                <button class="dlcg-btn dlcg-modal-close" style="margin-top: 25px; width: 100%;">OK</button>
            </div>
        `;
        
        const closeBtn = this.messageModal.querySelector('.dlcg-modal-close');
        closeBtn.addEventListener('click', () => {
            this.messageModal.style.display = 'none';
        });
        
        this.messageModal.addEventListener('click', (e) => {
            if (e.target === this.messageModal) {
                this.messageModal.style.display = 'none';
            }
        });
        
        this.messageModal.style.display = 'flex';
    }
    
    checkWin() {
        if (this.completed === 8) {
            this.stopTimer();
            const stars = this.calculateStars(this.seconds, this.moves);
            setTimeout(() => this.showWinScreen(stars, this.moves), 500);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const spiderContainers = document.querySelectorAll('[data-game="spider"]');
    spiderContainers.forEach(container => {
        new SpiderGame(container);
    });
});
