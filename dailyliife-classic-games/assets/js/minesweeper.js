/**
 * Emoji Minesweeper Game v1.7.3
 */

class MinesweeperGame extends GameCore {
    constructor(container) {
        super(container);
        this.board = container.querySelector('#minesweeper-board');
        this.mode = this.board.dataset.mode || 'emoji';
        this.difficulty = this.board.dataset.difficulty || 'medium';
        
        this.grid = [];
        this.revealed = [];
        this.flagged = [];
        this.mines = [];
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.totalMines = 0;
        this.flagCount = 0;
        
        this.setDifficulty();
        this.initGame();
    }
    
    setDifficulty() {
        const difficulties = {
            easy: { rows: 8, cols: 8, mines: 10 },
            medium: { rows: 16, cols: 16, mines: 40 },
            hard: { rows: 16, cols: 30, mines: 99 }
        };
        
        const config = difficulties[this.difficulty] || difficulties.medium;
        this.rows = config.rows;
        this.cols = config.cols;
        this.totalMines = config.mines;
    }
    
    initControls() {
        super.initControls();
        
        const newGameBtn = this.container.querySelector('.dlcg-new-game');
        if (newGameBtn) {
            newGameBtn.removeEventListener('click', this.newGame);
            newGameBtn.addEventListener('click', () => this.showDifficultyModal());
        }
    }
    
    initGame() {
        this.setupModeToggle();
        this.newGame();
    }
    
    setupModeToggle() {
        const modeToggle = this.container.querySelector('.dlcg-mode-toggle');
        if (modeToggle) {
            this.updateModeIndicator();
            
            modeToggle.addEventListener('click', () => {
                this.mode = this.mode === 'emoji' ? 'classic' : 'emoji';
                this.updateModeIndicator();
                this.renderBoard();
            });
        }
    }
    
    updateModeIndicator() {
        const modeToggle = this.container.querySelector('.dlcg-mode-toggle');
        if (!modeToggle) return;
        
        const emojiIcon = modeToggle.querySelector('.mode-emoji');
        const classicIcon = modeToggle.querySelector('.mode-classic');
        
        if (this.mode === 'emoji') {
            if (emojiIcon) {
                emojiIcon.style.display = 'inline';
                emojiIcon.style.fontSize = '18px';
            }
            if (classicIcon) classicIcon.style.display = 'none';
        } else {
            if (emojiIcon) emojiIcon.style.display = 'none';
            if (classicIcon) {
                classicIcon.style.display = 'inline';
            }
        }
    }
    
    showDifficultyModal() {
        if (!this.modal) {
            this.createDifficultyModal();
        }
        this.modal.style.display = 'flex';
    }
    
    createDifficultyModal() {
        this.modal = document.createElement('div');
        this.modal.className = 'dlcg-modal';
        this.modal.innerHTML = `
            <div class="dlcg-modal-content">
                <h3>Choose Difficulty</h3>
                <p>Select the grid size and number of mines:</p>
                <div class="dlcg-modal-buttons">
                    <button class="dlcg-btn dlcg-modal-btn" data-difficulty="easy">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <div>Easy</div>
                        <small>8x8 grid, 10 mines</small>
                    </button>
                    <button class="dlcg-btn dlcg-modal-btn" data-difficulty="medium">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
                        </svg>
                        <div>Medium</div>
                        <small>16x16 grid, 40 mines</small>
                    </button>
                    <button class="dlcg-btn dlcg-modal-btn" data-difficulty="hard">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032z"/>
                        </svg>
                        <div>Hard</div>
                        <small>16x30 grid, 99 mines</small>
                    </button>
                </div>
                <button class="dlcg-btn dlcg-modal-close">Cancel</button>
            </div>
        `;
        
        const buttons = this.modal.querySelectorAll('[data-difficulty]');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.difficulty = btn.dataset.difficulty;
                this.board.dataset.difficulty = this.difficulty;
                this.setDifficulty();
                this.updateDifficultyDisplay();
                this.modal.style.display = 'none';
                this.newGame();
            });
        });
        
        const closeBtn = this.modal.querySelector('.dlcg-modal-close');
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
    
    updateDifficultyDisplay() {
        const modeDisplay = this.container.querySelector('.dlcg-game-mode');
        if (modeDisplay) {
            modeDisplay.textContent = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
        }
    }
    
    newGame() {
        super.newGame();
        
        this.grid = [];
        this.revealed = [];
        this.flagged = [];
        this.mines = [];
        this.gameOver = false;
        this.gameWon = false;
        this.firstClick = true;
        this.flagCount = 0;
        
        for (let r = 0; r < this.rows; r++) {
            this.grid[r] = [];
            this.revealed[r] = [];
            this.flagged[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.grid[r][c] = 0;
                this.revealed[r][c] = false;
                this.flagged[r][c] = false;
            }
        }
        
        this.updateStats();
        this.renderBoard();
    }
    
    placeMines(excludeRow, excludeCol) {
        this.mines = [];
        let placed = 0;
        
        while (placed < this.totalMines) {
            const r = Math.floor(Math.random() * this.rows);
            const c = Math.floor(Math.random() * this.cols);
            
            if (Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1) {
                continue;
            }
            
            if (this.grid[r][c] !== -1) {
                this.grid[r][c] = -1;
                this.mines.push({r, c});
                placed++;
                
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const nr = r + dr;
                        const nc = c + dc;
                        if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                            if (this.grid[nr][nc] !== -1) {
                                this.grid[nr][nc]++;
                            }
                        }
                    }
                }
            }
        }
    }
    
    renderBoard() {
        this.board.innerHTML = '';
        
        const gridEl = document.createElement('div');
        gridEl.className = 'minesweeper-grid';
        gridEl.style.gridTemplateColumns = `repeat(${this.cols}, 40px)`;
        gridEl.style.gridTemplateRows = `repeat(${this.rows}, 40px)`;
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'minesweeper-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                if (this.revealed[r][c]) {
                    cell.classList.add('revealed');
                    if (this.grid[r][c] === -1) {
                        cell.classList.add('mine');
                        cell.textContent = '💣';
                    } else if (this.grid[r][c] > 0) {
                        cell.textContent = this.getCellContent(this.grid[r][c]);
                        cell.classList.add(`mine-count-${this.grid[r][c]}`);
                    }
                } else if (this.flagged[r][c]) {
                    cell.classList.add('flagged');
                    cell.textContent = '🚩';
                } else {
                    cell.addEventListener('click', () => this.onCellClick(r, c));
                    cell.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                        this.onCellRightClick(r, c);
                    });
                }
                
                gridEl.appendChild(cell);
            }
        }
        
        this.board.appendChild(gridEl);
    }
    
    getCellContent(count) {
        if (this.mode === 'classic') {
            return count.toString();
        }
        
        const emojiMap = {
            1: '😊',
            2: '😀',
            3: '😃',
            4: '😄',
            5: '😁',
            6: '😆',
            7: '😅',
            8: '😂'
        };
        
        return emojiMap[count] || count.toString();
    }
    
    onCellClick(r, c) {
        if (this.gameOver || this.gameWon || this.flagged[r][c]) return;
        
        if (this.firstClick) {
            this.placeMines(r, c);
            this.firstClick = false;
            this.startTimer();
        }
        
        if (this.grid[r][c] === -1) {
            this.saveCurrentState();
            
            this.gameOver = true;
            this.revealMines();
            this.stopTimer();
            window.SoundManager.play('explode');
            
            const cell = this.board.querySelector(`[data-row="${r}"][data-col="${c}"]`);
            if (cell) {
                cell.classList.add('exploded');
            }
            
            setTimeout(() => {
                this.showMineHitPopup();
            }, 500);
            return;
        }
        
        this.revealCell(r, c);
        window.SoundManager.play('reveal');
        this.saveCurrentState();
        this.checkWin();
    }
    
    onCellRightClick(r, c) {
        if (this.gameOver || this.gameWon || this.revealed[r][c]) return;
        
        if (this.firstClick) {
            this.firstClick = false;
            this.startTimer();
        }
        
        this.flagged[r][c] = !this.flagged[r][c];
        this.flagCount += this.flagged[r][c] ? 1 : -1;
        
        window.SoundManager.play('flag');
        this.updateStats();
        this.renderBoard();
        this.saveCurrentState();
    }
    
    revealCell(r, c) {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return;
        if (this.revealed[r][c] || this.flagged[r][c]) return;
        
        this.revealed[r][c] = true;
        
        if (this.grid[r][c] === 0) {
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    if (dr !== 0 || dc !== 0) {
                        this.revealCell(r + dr, c + dc);
                    }
                }
            }
        }
        
        this.renderBoard();
    }
    
    revealMines() {
        for (const {r, c} of this.mines) {
            this.revealed[r][c] = true;
        }
        this.renderBoard();
    }
    
    checkWin() {
        let revealedCount = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.revealed[r][c]) revealedCount++;
            }
        }
        
        const totalCells = this.rows * this.cols;
        if (revealedCount === totalCells - this.totalMines) {
            this.gameWon = true;
            this.stopTimer();
            const stars = this.calculateStars(this.seconds);
            setTimeout(() => this.showWinScreen(stars), 500);
        }
    }
    
    updateStats() {
        const minesDisplay = document.getElementById('mines-count');
        const flagsDisplay = document.getElementById('flags-count');
        
        if (minesDisplay) minesDisplay.textContent = this.totalMines;
        if (flagsDisplay) flagsDisplay.textContent = this.flagCount;
    }
    
    saveCurrentState() {
        const state = {
            grid: this.grid.map(row => [...row]),
            revealed: this.revealed.map(row => [...row]),
            flagged: this.flagged.map(row => [...row]),
            mines: this.mines.map(m => ({...m})),
            gameOver: this.gameOver,
            gameWon: this.gameWon,
            firstClick: this.firstClick,
            flagCount: this.flagCount,
            seconds: this.seconds
        };
        this.saveState(state);
    }
    
    restoreState(state) {
        this.grid = state.grid.map(row => [...row]);
        this.revealed = state.revealed.map(row => [...row]);
        this.flagged = state.flagged.map(row => [...row]);
        this.mines = state.mines.map(m => ({...m}));
        this.gameOver = state.gameOver;
        this.gameWon = state.gameWon;
        this.firstClick = state.firstClick;
        this.flagCount = state.flagCount;
        this.seconds = state.seconds;
        this.updateTimerDisplay();
        this.updateStats();
        this.renderBoard();
    }
    
    showMineHitPopup() {
        if (!this.mineModal) {
            this.mineModal = document.createElement('div');
            this.mineModal.className = 'dlcg-modal';
            this.container.appendChild(this.mineModal);
        }
        
        this.mineModal.innerHTML = `
            <div class="dlcg-modal-content">
                <div style="text-align: center; margin-bottom: 20px;">
                    <svg width="64" height="64" viewBox="0 0 16 16" fill="currentColor" style="color: #dc2626;">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                    </svg>
                </div>
                <h3 style="margin: 0 0 15px 0; color: #dc2626; font-size: 26px; text-align: center;">Oops! Mine Hit!</h3>
                <p style="font-size: 17px; margin: 0 0 25px 0; text-align: center;">
                    You clicked on a mine! Would you like to continue playing or end the game?
                </p>
                <div class="dlcg-modal-buttons">
                    <button class="dlcg-btn dlcg-modal-btn mine-continue" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                        </svg>
                        <div>Continue</div>
                        <small>Undo last move</small>
                    </button>
                    <button class="dlcg-btn dlcg-modal-btn mine-gameover" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                        </svg>
                        <div>Game Over</div>
                        <small>End the game</small>
                    </button>
                </div>
            </div>
        `;
        
        const continueBtn = this.mineModal.querySelector('.mine-continue');
        const gameoverBtn = this.mineModal.querySelector('.mine-gameover');
        
        continueBtn.addEventListener('click', () => {
            this.undo();
            this.mineModal.style.display = 'none';
        });
        
        gameoverBtn.addEventListener('click', () => {
            this.mineModal.style.display = 'none';
        });
        
        this.mineModal.addEventListener('click', (e) => {
            if (e.target === this.mineModal) {
                this.mineModal.style.display = 'none';
            }
        });
        
        this.mineModal.style.display = 'flex';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const minesweeperContainers = document.querySelectorAll('[data-game="minesweeper"]');
    minesweeperContainers.forEach(container => {
        new MinesweeperGame(container);
    });
});
