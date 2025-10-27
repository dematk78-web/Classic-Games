/**
 * DailyLiife Classic Games - Core Game Framework v1.72
 */

class GameCore {
    constructor(container) {
        this.container = container;
        this.gameType = container.dataset.game;
        this.timer = null;
        this.seconds = 0;
        this.timerInterval = null;
        this.history = [];
        this.autoPlayEnabled = false;
        this.soundEnabled = true;
        this.gameInstance = null;
        
        this.initControls();
        this.initTouchSupport();
    }
    
    registerGameInstance(instance) {
        this.gameInstance = instance;
    }
    
    initControls() {
        const newGameBtn = this.container.querySelector('.dlcg-new-game');
        const undoBtn = this.container.querySelector('.dlcg-undo');
        const autoPlayBtn = this.container.querySelector('.dlcg-auto-play');
        const soundToggle = this.container.querySelector('.dlcg-sound-toggle');
        const fullscreenBtn = this.container.querySelector('.dlcg-fullscreen-btn');
        
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => this.newGame());
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
        
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }
    }
    
    initTouchSupport() {
        this.selectedForTouch = null;
        this.touchDragClone = null;
        
        this.container.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            
            if (!target) return;
            
            const card = target.closest('.playing-card');
            if (card && !card.classList.contains('face-down')) {
                this.selectedForTouch = card;
                card.classList.add('touch-selected');
            }
        }, {passive: true});
        
        this.container.addEventListener('touchend', (e) => {
            if (!this.selectedForTouch) return;
            
            const touch = e.changedTouches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            
            this.selectedForTouch.classList.remove('touch-selected');
            
            if (target && target !== this.selectedForTouch) {
                const targetPile = target.closest('.card-pile, .tableau-pile, .freecell-pile, .foundation-pile');
                const sourcePile = this.selectedForTouch.closest('.card-pile, .tableau-pile, .freecell-pile, .foundation-pile');
                
                if (targetPile && targetPile !== sourcePile) {
                    const clickEvent = new MouseEvent('dblclick', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    this.selectedForTouch.dispatchEvent(clickEvent);
                }
            }
            
            this.selectedForTouch = null;
        }, {passive: false});
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (this.container.requestFullscreen) {
                this.container.requestFullscreen();
            } else if (this.container.webkitRequestFullscreen) {
                this.container.webkitRequestFullscreen();
            } else if (this.container.msRequestFullscreen) {
                this.container.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
    
    startTimer() {
        this.seconds = 0;
        this.updateTimerDisplay();
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.timerInterval = setInterval(() => {
            this.seconds++;
            this.updateTimerDisplay();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    resetTimer() {
        this.stopTimer();
        this.seconds = 0;
        this.updateTimerDisplay();
    }
    
    updateTimerDisplay() {
        const display = this.container.querySelector('.dlcg-timer-display');
        if (display) {
            const minutes = Math.floor(this.seconds / 60);
            const secs = this.seconds % 60;
            display.textContent = `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }
    
    saveState(state) {
        this.history.push(JSON.parse(JSON.stringify(state)));
        if (this.history.length > 50) {
            this.history.shift();
        }
        this.updateUndoButton();
    }
    
    undo() {
        if (this.history.length > 1) {
            this.history.pop();
            const previousState = this.history[this.history.length - 1];
            this.restoreState(previousState);
            this.updateUndoButton();
            if (window.SoundManager) {
                window.SoundManager.play('move');
            }
        }
    }
    
    updateUndoButton() {
        if (this.undoBtn) {
            this.undoBtn.disabled = this.history.length <= 1;
        }
    }
    
    toggleAutoPlay() {
        this.autoPlayEnabled = !this.autoPlayEnabled;
        if (this.autoPlayBtn) {
            const textNode = Array.from(this.autoPlayBtn.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
            if (this.autoPlayEnabled) {
                this.autoPlayBtn.classList.add('active');
                if (textNode) {
                    textNode.textContent = 'Auto: ON';
                }
            } else {
                this.autoPlayBtn.classList.remove('active');
                if (textNode) {
                    textNode.textContent = 'Auto';
                }
            }
        }
        if (this.autoPlayEnabled && this.performAutoPlay) {
            this.performAutoPlay();
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (this.soundToggle) {
            if (this.soundEnabled) {
                this.soundToggle.classList.remove('muted');
            } else {
                this.soundToggle.classList.add('muted');
            }
        }
        if (window.SoundManager) {
            window.SoundManager.setEnabled(this.soundEnabled);
        }
    }
    
    showWinScreen(stars, moves = 0) {
        this.stopTimer();
        
        const winScreen = document.createElement('div');
        winScreen.className = 'dlcg-win-screen';
        
        const starDisplay = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
        
        const messages = [
            'Congratulations!',
            'You Did It!',
            'Victory!',
            'Amazing!',
            'Fantastic!'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        
        winScreen.innerHTML = `
            <div class="dlcg-win-content">
                <div class="dlcg-win-title">${randomMessage}</div>
                <div class="dlcg-win-stars">${starDisplay}</div>
                <div class="dlcg-win-time">Time: ${this.formatTime(this.seconds)}</div>
                ${moves > 0 ? `<div class="dlcg-win-message">Moves: ${moves}</div>` : ''}
                <div class="dlcg-win-message">You've completed ${this.gameType}!</div>
                <div class="dlcg-win-buttons">
                    <button class="dlcg-btn" onclick="this.closest('.dlcg-win-screen').remove()">Close</button>
                    <button class="dlcg-btn" onclick="this.closest('.dlcg-win-screen').remove(); document.querySelector('.dlcg-new-game').click()">New Game</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(winScreen);
        
        if (window.SoundManager) {
            window.SoundManager.play('win');
        }
        
        this.animateWinCards();
    }
    
    animateWinCards() {
        const cards = this.container.querySelectorAll('.playing-card:not(.face-down)');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = `cardFall ${2 + Math.random()}s ease-in forwards`;
                card.style.animationDelay = `${index * 0.1}s`;
            }, index * 100);
        });
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, '0')}`;
    }
    
    calculateStars(seconds, moves = 0) {
        if (this.gameType === 'solitaire' || this.gameType === 'freecell') {
            if (seconds < 120) return 3;
            if (seconds < 300) return 2;
            return 1;
        } else if (this.gameType === 'spider') {
            if (seconds < 300 && moves < 150) return 3;
            if (seconds < 600 && moves < 250) return 2;
            return 1;
        } else if (this.gameType === 'minesweeper') {
            if (seconds < 60) return 3;
            if (seconds < 180) return 2;
            return 1;
        }
        return 1;
    }
    
    newGame() {
        this.history = [];
        this.resetTimer();
        this.updateUndoButton();
    }
    
    restoreState(state) {
        console.log('Restore state should be implemented by subclass');
    }
}

class Card {
    constructor(suit, rank, faceUp = false) {
        this.suit = suit;
        this.rank = rank;
        this.faceUp = faceUp;
        this.element = null;
    }
    
    get color() {
        return (this.suit === 'hearts' || this.suit === 'diamonds') ? 'red' : 'black';
    }
    
    get rankValue() {
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        return ranks.indexOf(this.rank) + 1;
    }
    
    get suitSymbol() {
        const symbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return symbols[this.suit];
    }
    
    createElement() {
        const card = document.createElement('div');
        card.className = `playing-card ${this.color}`;
        card.dataset.suit = this.suit;
        card.dataset.rank = this.rank;
        
        if (!this.faceUp) {
            card.classList.add('face-down');
        } else {
            card.innerHTML = `
                <div class="card-rank">${this.rank}</div>
                <div class="card-center">${this.suitSymbol}</div>
                <div class="card-suit">${this.suitSymbol}</div>
            `;
        }
        
        this.element = card;
        return card;
    }
    
    flip() {
        this.faceUp = !this.faceUp;
        if (this.element) {
            if (this.faceUp) {
                this.element.classList.remove('face-down');
                this.element.innerHTML = `
                    <div class="card-rank">${this.rank}</div>
                    <div class="card-center">${this.suitSymbol}</div>
                    <div class="card-suit">${this.suitSymbol}</div>
                `;
            } else {
                this.element.classList.add('face-down');
                this.element.innerHTML = '';
            }
        }
    }
}

class Deck {
    constructor(numDecks = 1, suits = ['hearts', 'diamonds', 'clubs', 'spades']) {
        this.cards = [];
        this.createDeck(numDecks, suits);
    }
    
    createDeck(numDecks, suits) {
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let d = 0; d < numDecks; d++) {
            for (let suit of suits) {
                for (let rank of ranks) {
                    this.cards.push(new Card(suit, rank));
                }
            }
        }
    }
    
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return this;
    }
    
    deal(count = 1) {
        return this.cards.splice(0, count);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GameCore, Card, Deck };
}
