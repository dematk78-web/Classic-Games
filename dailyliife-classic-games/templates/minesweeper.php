<?php
if (!defined('ABSPATH')) {
    exit;
}
$mode = isset($atts['mode']) ? $atts['mode'] : 'emoji';
$difficulty = isset($atts['difficulty']) ? $atts['difficulty'] : 'medium';
?>
<div class="dlcg-game-container" data-game="minesweeper">
    <div class="dlcg-game-header">
        <div class="dlcg-game-title">
            <h2>Emoji Minesweeper</h2>
            <span class="dlcg-game-mode"><?php echo ucfirst($difficulty); ?></span>
        </div>
        <div class="dlcg-game-controls">
            <button class="dlcg-btn dlcg-new-game" title="New Game">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                </svg>
                New Game
            </button>
            <button class="dlcg-btn dlcg-undo" title="Undo">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/>
                    <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/>
                </svg>
                Undo
            </button>
            <button class="dlcg-btn dlcg-mode-toggle" title="Toggle Mode">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" class="mode-icon mode-classic">
                    <path d="M12.438 1.668V7.5h-6.25a1.875 1.875 0 0 0-1.875 1.875v.625h6.25v-1.25a.625.625 0 0 1 .625-.625h.625V.626a.626.626 0 0 1 .625-.626zM3.688 1.668h5.624v5.625H3.688V1.668zm5.625 7.5H3.688v5.624h5.625v-5.624zm1.25 5.624h5.624V9.168h-5.625v5.624z"/>
                </svg>
                <span class="mode-icon mode-emoji">😊</span>
            </button>
            <button class="dlcg-btn dlcg-sound-toggle" title="Toggle Sound">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                </svg>
            </button>
            <div class="dlcg-timer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z"/>
                    <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 1.5v-1a.5.5 0 0 1-.5-.5zM8 16A6 6 0 1 0 8 4a6 6 0 0 0 0 12z"/>
                </svg>
                <span class="dlcg-timer-display">00:00</span>
            </div>
            <button class="dlcg-fullscreen-btn" title="Toggle Fullscreen">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
                </svg>
            </button>
        </div>
    </div>
    <div class="dlcg-game-stats">
        <div class="dlcg-stat">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle;">
                <path d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm-.5 5a.5.5 0 0 1 1 0v1.5h1.5a.5.5 0 0 1 0 1H8.5V9a.5.5 0 0 1-1 0V7.5H6a.5.5 0 0 1 0-1h1.5V5z"/>
            </svg>
            Mines: <span id="mines-count">0</span>
        </div>
        <div class="dlcg-stat">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style="vertical-align: middle;">
                <path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001"/>
            </svg>
            Flags: <span id="flags-count">0</span>
        </div>
    </div>
    <div class="dlcg-game-board" id="minesweeper-board" data-mode="<?php echo esc_attr($mode); ?>" data-difficulty="<?php echo esc_attr($difficulty); ?>"></div>
</div>
