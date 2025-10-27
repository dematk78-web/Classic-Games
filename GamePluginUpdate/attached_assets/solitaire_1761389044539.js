/**
 * Solitaire (Klondike) Game v1.7.0
 */

class SolitaireGame extends GameCore {
    constructor(container) {
        super(container);
        this.board = container.querySelector('#solitaire-board');
        this.mode = this.board.dataset.mode || 'single';
        this.drawCount = this.mode === 'three' ? 3 : 1;
        
        this.stock = [];
        this.waste = [];
        this.foundations = [[], [], [], []];
        this.tableau = [[], [], [], [], [], [], []];
        
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
            newGameBtn.addEventListener('click', () => this.showModeModal());
        }
        
        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.undo());
            this.undoBtn = undoBtn;
            this.updateUndoButton();
        }
        
        if (autoPlayBtn) {
            autoPlayBtn.addEventListener('click', () => this.toggleAutoPlay());
        }
        
        if (soundToggle) {
            soundToggle.addEventListener('click', () => this.toggleSound(soundToggle));
        }
    }
    
    showModeModal() {
        if (!this.modal) {
            this.createModeModal();
        }
        this.modal.style.display = 'flex';
    }
    
    createModeModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'dlcg-modal';
        this.modal.innerHTML = `
            <div class="dlcg-modal-content">
                <h3>Choose Game Mode</h3>
                <p>Select how many cards to draw from the stock pile:</p>
                <div class="dlcg-modal-buttons">
                    <button class="dlcg-btn dlcg-modal-btn" data-mode="single">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/>
                        </svg>
                        <div>Single Card</div>
                        <small>Draw 1 card (Easier)</small>
                    </button>
                    <button class="dlcg-btn dlcg-modal-btn" data-mode="three">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2z"/>
                        </svg>
                        <div>3-Card Draw</div>
                        <small>Draw 3 cards (Harder)</small>
                    </button>
                </div>
                <button class="dlcg-btn dlcg-modal-close">Cancel</button>
            </div>
        `;
        
        const singleBtn = this.modal.querySelector('[data-mode="single"]');
        const threeBtn = this.modal.querySelector('[data-mode="three"]');
        const closeBtn = this.modal.querySelector('.dlcg-modal-close');
        
        singleBtn.addEventListener('click', () => {
            this.mode = 'single';
            this.drawCount = 1;
            this.board.dataset.mode = 'single';
            this.updateModeDisplay();
            this.modal.style.display = 'none';
            this.startNewGame();
        });
        
        threeBtn.addEventListener('click', () => {
            this.mode = 'three';
            this.drawCount = 3;
            this.board.dataset.mode = 'three';
            this.updateModeDisplay();
            this.modal.style.display = 'none';
            this.startNewGame();
        });
        
        closeBtn.addEventListener('click', () => {
            this.modal.style.display = 'none';
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.style.display = 'none';
            }
        });
        
        this.container.appendChild(this.modal);
    }
    
    updateModeDisplay() {
        const modeDisplay = this.container.querySelector('.dlcg-game-mode');
        if (modeDisplay) {
            modeDisplay.textContent = this.mode === 'three' ? '3-Card Draw' : 'Single Card';
        }
    }
    
    startNewGame() {
        this.newGame();
    }
    
    initGame() {
        this.renderBoard();
        this.startNewGame();
    }
    
    renderBoard() {
        this.board.innerHTML = '';
        this.board.className = 'dlcg-game-board';
        
        const layout = document.createElement('div');
        layout.className = 'solitaire-layout';
        
        const topRow = document.createElement('div');
        topRow.className = 'solitaire-top';
        
        const stockWaste = document.createElement('div');
        stockWaste.className = 'solitaire-stock-waste';
        
        const stockPile = this.createPile('stock');
        stockPile.addEventListener('click', () => this.drawFromStock());
        stockWaste.appendChild(stockPile);
        
        const wastePile = this.createPile('waste');
        stockWaste.appendChild(wastePile);
        
        topRow.appendChild(stockWaste);
        
        const foundationsDiv = document.createElement('div');
        foundationsDiv.className = 'solitaire-foundations';
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        for (let i = 0; i < 4; i++) {
            const foundation = this.createPile(`foundation-${i}`, 'foundation');
            foundation.dataset.suit = suits[i];
            foundation.dataset.index = i;
            foundationsDiv.appendChild(foundation);
        }
        topRow.appendChild(foundationsDiv);
        
        layout.appendChild(topRow);
        
        const tableauDiv = document.createElement('div');
        tableauDiv.className = 'solitaire-tableau';
        for (let i = 0; i < 7; i++) {
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
        
        const deck = new Deck();
        deck.shuffle();
        
        this.stock = deck.cards;
        this.waste = [];
        this.foundations = [[], [], [], []];
        this.tableau = [[], [], [], [], [], [], []];
        this.moves = 0;
        this.firstMove = true;
        
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                const card = this.stock.shift();
                if (i === j) {
                    card.faceUp = true;
                }
                this.tableau[j].push(card);
            }
        }
        
        this.saveCurrentState();
        this.render();
    }
    
    saveCurrentState() {
        const state = {
            stock: this.stock.map(c => ({suit: c.suit, rank: c.rank, faceUp: c.faceUp})),
            waste: this.waste.map(c => ({suit: c.suit, rank: c.rank, faceUp: c.faceUp})),
            foundations: this.foundations.map(f => f.map(c => ({suit: c.suit, rank: c.rank, faceUp: c.faceUp}))),
            tableau: this.tableau.map(t => t.map(c => ({suit: c.suit, rank: c.rank, faceUp: c.faceUp}))),
            moves: this.moves,
            seconds: this.seconds
        };
        this.saveState(state);
    }
    
    restoreState(state) {
        this.stock = state.stock.map(c => new Card(c.suit, c.rank, c.faceUp));
        this.waste = state.waste.map(c => new Card(c.suit, c.rank, c.faceUp));
        this.foundations = state.foundations.map(f => f.map(c => new Card(c.suit, c.rank, c.faceUp)));
        this.tableau = state.tableau.map(t => t.map(c => new Card(c.suit, c.rank, c.faceUp)));
        this.moves = state.moves;
        this.seconds = state.seconds;
        this.updateTimerDisplay();
        this.render();
    }
    
    render() {
        this.renderStock();
        this.renderWaste();
        this.renderFoundations();
        this.renderTableau();
        
        if (this.autoPlayEnabled) {
            setTimeout(() => this.performAutoPlay(), 100);
        }
    }
    
    renderStock() {
        const stockPile = document.getElementById('stock');
        stockPile.innerHTML = '';
        
        if (this.stock.length > 0) {
            const topCard = new Card('spades', 'A', false);
            const cardEl = topCard.createElement();
            stockPile.appendChild(cardEl);
        }
    }
    
    renderWaste() {
        const wastePile = document.getElementById('waste');
        wastePile.innerHTML = '';
        
        const startIndex = Math.max(0, this.waste.length - this.drawCount);
        for (let i = startIndex; i < this.waste.length; i++) {
            const card = this.waste[i];
            const cardEl = card.createElement();
            cardEl.style.position = 'absolute';
            cardEl.style.left = `${(i - startIndex) * 25}px`;
            cardEl.draggable = (i === this.waste.length - 1);
            
            if (i === this.waste.length - 1) {
                this.addCardListeners(cardEl, 'waste', this.waste.length - 1);
            }
            
            wastePile.appendChild(cardEl);
        }
    }
    
    renderFoundations() {
        for (let i = 0; i < 4; i++) {
            const foundationPile = document.querySelector(`#foundation-${i}`);
            foundationPile.innerHTML = '';
            
            const foundation = this.foundations[i];
            if (foundation.length > 0) {
                const topCard = foundation[foundation.length - 1];
                const cardEl = topCard.createElement();
                cardEl.draggable = true;
                this.addCardListeners(cardEl, 'foundation', i);
                foundationPile.appendChild(cardEl);
            }
            
            this.addDropZone(foundationPile, 'foundation', i);
        }
    }
    
    renderTableau() {
        for (let i = 0; i < 7; i++) {
            const tableauPile = document.querySelector(`#tableau-${i}`);
            tableauPile.innerHTML = '';
            
            const pile = this.tableau[i];
            pile.forEach((card, cardIndex) => {
                const cardEl = card.createElement();
                cardEl.style.position = 'absolute';
                cardEl.style.top = `${cardIndex * 30}px`;
                
                if (card.faceUp) {
                    cardEl.draggable = true;
                    this.addCardListeners(cardEl, 'tableau', i, cardIndex);
                }
                
                tableauPile.appendChild(cardEl);
            });
            
            this.addDropZone(tableauPile, 'tableau', i);
        }
    }
    
    addCardListeners(cardEl, source, ...indices) {
        cardEl.addEventListener('dragstart', (e) => this.onDragStart(e, source, ...indices));
        cardEl.addEventListener('click', () => this.onCardClick(source, ...indices));
        cardEl.addEventListener('dblclick', () => this.onCardDoubleClick(source, ...indices));
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
    
    onDragStart(e, source, ...indices) {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        this.dragSource = {source, indices};
        
        if (source === 'tableau') {
            const [pileIndex, cardIndex] = indices;
            this.draggedCards = this.tableau[pileIndex].slice(cardIndex);
        } else if (source === 'waste') {
            this.draggedCards = [this.waste[this.waste.length - 1]];
        } else if (source === 'foundation') {
            const [foundationIndex] = indices;
            this.draggedCards = [this.foundations[foundationIndex][this.foundations[foundationIndex].length - 1]];
        }
        
        e.dataTransfer.effectAllowed = 'move';
    }
    
    onDrop(target, index) {
        if (!this.draggedCards || !this.dragSource) return;
        
        let valid = false;
        const {source} = this.dragSource;
        
        if (source === target && source === 'foundation') {
            return;
        }
        
        if (target === 'foundation' && this.draggedCards.length === 1) {
            valid = this.canMoveToFoundation(this.draggedCards[0], index);
            if (valid) {
                this.moveToFoundation(index);
            }
        } else if (target === 'tableau') {
            valid = this.canMoveToTableau(this.draggedCards, index);
            if (valid) {
                this.moveToTableau(index);
            }
        }
        
        if (valid) {
            window.SoundManager.play('place');
        } else {
            window.SoundManager.play('invalid');
        }
        
        this.draggedCards = null;
        this.dragSource = null;
    }
    
    onCardClick(source, ...indices) {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        let card;
        if (source === 'waste') {
            card = this.waste[this.waste.length - 1];
        } else if (source === 'tableau') {
            const [pileIndex, cardIndex] = indices;
            if (cardIndex !== this.tableau[pileIndex].length - 1) return;
            card = this.tableau[pileIndex][cardIndex];
        } else if (source === 'foundation') {
            const [foundationIndex] = indices;
            card = this.foundations[foundationIndex][this.foundations[foundationIndex].length - 1];
        }
        
        if (!card) return;
        
        for (let i = 0; i < 4; i++) {
            if (this.canMoveToFoundation(card, i)) {
                this.draggedCards = [card];
                this.dragSource = {source, indices};
                this.moveToFoundation(i);
                window.SoundManager.play('place');
                return;
            }
        }
    }
    
    onCardDoubleClick(source, ...indices) {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        let card;
        if (source === 'waste') {
            card = this.waste[this.waste.length - 1];
        } else if (source === 'tableau') {
            const [pileIndex, cardIndex] = indices;
            if (cardIndex !== this.tableau[pileIndex].length - 1) return;
            card = this.tableau[pileIndex][cardIndex];
        } else if (source === 'foundation') {
            const [foundationIndex] = indices;
            card = this.foundations[foundationIndex][this.foundations[foundationIndex].length - 1];
            
            for (let i = 0; i < 7; i++) {
                if (this.canMoveToTableau([card], i)) {
                    this.draggedCards = [card];
                    this.dragSource = {source, indices};
                    this.moveToTableau(i);
                    window.SoundManager.play('place');
                    return;
                }
            }
            return;
        }
        
        if (!card) return;
        
        for (let i = 0; i < 7; i++) {
            if (this.canMoveToTableau([card], i)) {
                this.draggedCards = [card];
                this.dragSource = {source, indices};
                this.moveToTableau(i);
                window.SoundManager.play('place');
                return;
            }
        }
    }
    
    drawFromStock() {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        if (this.stock.length === 0) {
            this.stock = [...this.waste];
            this.waste = [];
            this.stock.forEach(card => card.faceUp = false);
        } else {
            for (let i = 0; i < this.drawCount && this.stock.length > 0; i++) {
                const card = this.stock.shift();
                card.faceUp = true;
                this.waste.push(card);
            }
        }
        
        window.SoundManager.play('flip');
        this.saveCurrentState();
        this.render();
    }
    
    canMoveToFoundation(card, foundationIndex) {
        const foundation = this.foundations[foundationIndex];
        
        if (foundation.length === 0) {
            return card.rank === 'A';
        }
        
        const topCard = foundation[foundation.length - 1];
        return card.suit === topCard.suit && card.rankValue === topCard.rankValue + 1;
    }
    
    canMoveToTableau(cards, tableauIndex) {
        const pile = this.tableau[tableauIndex];
        const card = cards[0];
        
        if (pile.length === 0) {
            return card.rank === 'K';
        }
        
        const topCard = pile[pile.length - 1];
        return card.color !== topCard.color && card.rankValue === topCard.rankValue - 1;
    }
    
    moveToFoundation(foundationIndex) {
        const {source, indices} = this.dragSource;
        
        if (source === 'waste') {
            const card = this.waste.pop();
            this.foundations[foundationIndex].push(card);
        } else if (source === 'tableau') {
            const [pileIndex, cardIndex] = indices;
            const card = this.tableau[pileIndex].pop();
            this.foundations[foundationIndex].push(card);
            
            if (this.tableau[pileIndex].length > 0) {
                const lastCard = this.tableau[pileIndex][this.tableau[pileIndex].length - 1];
                if (!lastCard.faceUp) {
                    lastCard.flip();
                    window.SoundManager.play('flip');
                }
            }
        } else if (source === 'foundation') {
            const [srcFoundationIndex] = indices;
            const card = this.foundations[srcFoundationIndex].pop();
            this.foundations[foundationIndex].push(card);
        }
        
        this.moves++;
        this.checkWin();
        this.saveCurrentState();
        this.render();
    }
    
    moveToTableau(tableauIndex) {
        const {source, indices} = this.dragSource;
        
        if (source === 'waste') {
            const card = this.waste.pop();
            this.tableau[tableauIndex].push(card);
        } else if (source === 'tableau') {
            const [pileIndex, cardIndex] = indices;
            const cards = this.tableau[pileIndex].splice(cardIndex);
            this.tableau[tableauIndex].push(...cards);
            
            if (this.tableau[pileIndex].length > 0) {
                const lastCard = this.tableau[pileIndex][this.tableau[pileIndex].length - 1];
                if (!lastCard.faceUp) {
                    lastCard.flip();
                    window.SoundManager.play('flip');
                }
            }
        } else if (source === 'foundation') {
            const [foundationIndex] = indices;
            const card = this.foundations[foundationIndex].pop();
            this.tableau[tableauIndex].push(card);
        }
        
        this.moves++;
        this.saveCurrentState();
        this.render();
    }
    
    performAutoPlay() {
        if (!this.autoPlayEnabled) return;
        
        let madeMoves = false;
        
        for (let i = 0; i < 7; i++) {
            const pile = this.tableau[i];
            if (pile.length > 0) {
                const card = pile[pile.length - 1];
                if (card.faceUp) {
                    for (let f = 0; f < 4; f++) {
                        if (this.canMoveToFoundation(card, f)) {
                            this.draggedCards = [card];
                            this.dragSource = {source: 'tableau', indices: [i, pile.length - 1]};
                            this.moveToFoundation(f);
                            window.SoundManager.play('place');
                            madeMoves = true;
                            break;
                        }
                    }
                }
            }
            if (madeMoves) break;
        }
        
        if (!madeMoves && this.waste.length > 0) {
            const card = this.waste[this.waste.length - 1];
            for (let f = 0; f < 4; f++) {
                if (this.canMoveToFoundation(card, f)) {
                    this.draggedCards = [card];
                    this.dragSource = {source: 'waste', indices: [this.waste.length - 1]};
                    this.moveToFoundation(f);
                    window.SoundManager.play('place');
                    madeMoves = true;
                    break;
                }
            }
        }
        
        if (madeMoves && this.autoPlayEnabled) {
            setTimeout(() => this.performAutoPlay(), 300);
        }
    }
    
    checkWin() {
        const allCardsInFoundation = this.foundations.every(f => f.length === 13);
        if (allCardsInFoundation) {
            const stars = this.calculateStars(this.seconds, this.moves);
            setTimeout(() => this.showWinScreen(stars, this.moves), 500);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const solitaireContainers = document.querySelectorAll('[data-game="solitaire"]');
    solitaireContainers.forEach(container => {
        new SolitaireGame(container);
    });
});
