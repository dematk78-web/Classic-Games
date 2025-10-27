/**
 * FreeCell Game v1.7.3
 */

class FreeCellGame extends GameCore {
    constructor(container) {
        super(container);
        this.board = container.querySelector('#freecell-board');
        
        this.cells = [null, null, null, null];
        this.foundations = [[], [], [], []];
        this.tableau = [[], [], [], [], [], [], [], []];
        
        this.draggedCards = null;
        this.dragSource = null;
        this.moves = 0;
        this.firstMove = true;
        
        this.initGame();
    }
    
    initGame() {
        this.renderBoard();
        this.newGame();
    }
    
    renderBoard() {
        this.board.innerHTML = '';
        this.board.className = 'dlcg-game-board';
        
        const layout = document.createElement('div');
        layout.className = 'freecell-layout';
        
        const topRow = document.createElement('div');
        topRow.className = 'freecell-top';
        
        const cellsDiv = document.createElement('div');
        cellsDiv.className = 'freecell-cells';
        for (let i = 0; i < 4; i++) {
            const cell = this.createPile(`cell-${i}`, 'card-pile');
            cell.dataset.index = i;
            cellsDiv.appendChild(cell);
        }
        topRow.appendChild(cellsDiv);
        
        const foundationsDiv = document.createElement('div');
        foundationsDiv.className = 'freecell-foundations';
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
        tableauDiv.className = 'freecell-tableau';
        for (let i = 0; i < 8; i++) {
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
        
        this.cells = [null, null, null, null];
        this.foundations = [[], [], [], []];
        this.tableau = [[], [], [], [], [], [], [], []];
        this.moves = 0;
        this.firstMove = true;
        
        let cardIndex = 0;
        for (let i = 0; i < 52; i++) {
            const card = deck.cards[i];
            card.faceUp = true;
            this.tableau[cardIndex].push(card);
            cardIndex = (cardIndex + 1) % 8;
        }
        
        this.saveCurrentState();
        this.render();
    }
    
    saveCurrentState() {
        const state = {
            cells: this.cells.map(c => c ? {suit: c.suit, rank: c.rank, faceUp: c.faceUp} : null),
            foundations: this.foundations.map(f => f.map(c => ({suit: c.suit, rank: c.rank, faceUp: c.faceUp}))),
            tableau: this.tableau.map(t => t.map(c => ({suit: c.suit, rank: c.rank, faceUp: c.faceUp}))),
            moves: this.moves,
            seconds: this.seconds
        };
        this.saveState(state);
    }
    
    restoreState(state) {
        this.cells = state.cells.map(c => c ? new Card(c.suit, c.rank, c.faceUp) : null);
        this.foundations = state.foundations.map(f => f.map(c => new Card(c.suit, c.rank, c.faceUp)));
        this.tableau = state.tableau.map(t => t.map(c => new Card(c.suit, c.rank, c.faceUp)));
        this.moves = state.moves;
        this.seconds = state.seconds;
        this.updateTimerDisplay();
        this.render();
    }
    
    render() {
        this.renderCells();
        this.renderFoundations();
        this.renderTableau();
        
        if (this.autoPlayEnabled) {
            setTimeout(() => this.performAutoPlay(), 100);
        }
    }
    
    renderCells() {
        for (let i = 0; i < 4; i++) {
            const cellPile = document.querySelector(`#cell-${i}`);
            cellPile.innerHTML = '';
            
            if (this.cells[i]) {
                const card = this.cells[i];
                const cardEl = card.createElement();
                cardEl.draggable = true;
                this.addCardListeners(cardEl, 'cell', i);
                cellPile.appendChild(cardEl);
            }
            
            this.addDropZone(cellPile, 'cell', i);
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
        for (let i = 0; i < 8; i++) {
            const tableauPile = document.querySelector(`#tableau-${i}`);
            tableauPile.innerHTML = '';
            
            const pile = this.tableau[i];
            pile.forEach((card, cardIndex) => {
                const cardEl = card.createElement();
                cardEl.style.position = 'absolute';
                cardEl.style.top = `${cardIndex * 30}px`;
                cardEl.draggable = (cardIndex === pile.length - 1);
                
                if (cardIndex === pile.length - 1) {
                    this.addCardListeners(cardEl, 'tableau', i);
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
    
    onDragStart(e, source, index) {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        this.dragSource = {source, index};
        
        if (source === 'cell') {
            this.draggedCards = [this.cells[index]];
        } else if (source === 'tableau') {
            const pile = this.tableau[index];
            this.draggedCards = [pile[pile.length - 1]];
        } else if (source === 'foundation') {
            this.draggedCards = [this.foundations[index][this.foundations[index].length - 1]];
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
        
        if (target === 'foundation') {
            valid = this.canMoveToFoundation(this.draggedCards[0], index);
            if (valid) {
                this.moveCard(target, index);
            }
        } else if (target === 'cell') {
            valid = this.canMoveToCell(index);
            if (valid) {
                this.moveCard(target, index);
            }
        } else if (target === 'tableau') {
            valid = this.canMoveToTableau(this.draggedCards[0], index);
            if (valid) {
                this.moveCard(target, index);
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
    
    onCardClick(source, index) {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        let card;
        if (source === 'cell') {
            card = this.cells[index];
        } else if (source === 'tableau') {
            const pile = this.tableau[index];
            card = pile[pile.length - 1];
        } else if (source === 'foundation') {
            card = this.foundations[index][this.foundations[index].length - 1];
        }
        
        if (!card) return;
        
        for (let i = 0; i < 4; i++) {
            if (this.canMoveToFoundation(card, i)) {
                this.draggedCards = [card];
                this.dragSource = {source, index};
                this.moveCard('foundation', i);
                window.SoundManager.play('place');
                return;
            }
        }
    }
    
    onCardDoubleClick(source, index) {
        if (this.firstMove) {
            this.startTimer();
            this.firstMove = false;
        }
        
        let card;
        if (source === 'cell') {
            card = this.cells[index];
        } else if (source === 'tableau') {
            const pile = this.tableau[index];
            card = pile[pile.length - 1];
        } else if (source === 'foundation') {
            card = this.foundations[index][this.foundations[index].length - 1];
            
            for (let i = 0; i < 8; i++) {
                if (this.canMoveToTableau(card, i)) {
                    this.draggedCards = [card];
                    this.dragSource = {source, index};
                    this.moveCard('tableau', i);
                    window.SoundManager.play('place');
                    return;
                }
            }
            
            for (let i = 0; i < 4; i++) {
                if (this.canMoveToCell(i)) {
                    this.draggedCards = [card];
                    this.dragSource = {source, index};
                    this.moveCard('cell', i);
                    window.SoundManager.play('place');
                    return;
                }
            }
            return;
        }
        
        if (!card) return;
        
        for (let i = 0; i < 8; i++) {
            if (this.canMoveToTableau(card, i)) {
                this.draggedCards = [card];
                this.dragSource = {source, index};
                this.moveCard('tableau', i);
                window.SoundManager.play('place');
                return;
            }
        }
        
        for (let i = 0; i < 4; i++) {
            if (this.canMoveToCell(i)) {
                this.draggedCards = [card];
                this.dragSource = {source, index};
                this.moveCard('cell', i);
                window.SoundManager.play('place');
                return;
            }
        }
    }
    
    canMoveToFoundation(card, foundationIndex) {
        const foundation = this.foundations[foundationIndex];
        
        if (foundation.length === 0) {
            return card.rank === 'A';
        }
        
        const topCard = foundation[foundation.length - 1];
        return card.suit === topCard.suit && card.rankValue === topCard.rankValue + 1;
    }
    
    canMoveToCell(cellIndex) {
        return this.cells[cellIndex] === null;
    }
    
    canMoveToTableau(card, tableauIndex) {
        const pile = this.tableau[tableauIndex];
        
        if (pile.length === 0) {
            return true;
        }
        
        const topCard = pile[pile.length - 1];
        return card.color !== topCard.color && card.rankValue === topCard.rankValue - 1;
    }
    
    moveCard(target, index) {
        const {source, index: sourceIndex} = this.dragSource;
        const card = this.draggedCards[0];
        
        if (source === 'cell') {
            this.cells[sourceIndex] = null;
        } else if (source === 'tableau') {
            this.tableau[sourceIndex].pop();
        } else if (source === 'foundation') {
            this.foundations[sourceIndex].pop();
        }
        
        if (target === 'foundation') {
            this.foundations[index].push(card);
        } else if (target === 'cell') {
            this.cells[index] = card;
        } else if (target === 'tableau') {
            this.tableau[index].push(card);
        }
        
        this.moves++;
        this.checkWin();
        this.saveCurrentState();
        this.render();
    }
    
    performAutoPlay() {
        if (!this.autoPlayEnabled) return;
        
        let madeMoves = false;
        
        for (let i = 0; i < 8; i++) {
            const pile = this.tableau[i];
            if (pile.length > 0) {
                const card = pile[pile.length - 1];
                for (let f = 0; f < 4; f++) {
                    if (this.canMoveToFoundation(card, f)) {
                        this.draggedCards = [card];
                        this.dragSource = {source: 'tableau', index: i};
                        this.moveCard('foundation', f);
                        window.SoundManager.play('place');
                        madeMoves = true;
                        break;
                    }
                }
            }
            if (madeMoves) break;
        }
        
        if (!madeMoves) {
            for (let i = 0; i < 4; i++) {
                const card = this.cells[i];
                if (card) {
                    for (let f = 0; f < 4; f++) {
                        if (this.canMoveToFoundation(card, f)) {
                            this.draggedCards = [card];
                            this.dragSource = {source: 'cell', index: i};
                            this.moveCard('foundation', f);
                            window.SoundManager.play('place');
                            madeMoves = true;
                            break;
                        }
                    }
                }
                if (madeMoves) break;
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
    const freecellContainers = document.querySelectorAll('[data-game="freecell"]');
    freecellContainers.forEach(container => {
        new FreeCellGame(container);
    });
});
