<?php
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap dlcg-admin-wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <div class="dlcg-admin-container">
        <div class="dlcg-admin-card">
            <h2>Welcome to DailyLiife Classic Games</h2>
            <p>Add any of these games to your WordPress pages or posts using the shortcodes below.</p>
        </div>
        
        <div class="dlcg-admin-card">
            <h2>Available Games & Shortcodes</h2>
            
            <div class="dlcg-shortcode-section">
                <h3>🃏 Solitaire (Klondike)</h3>
                <p>Classic Solitaire game with single-card or 3-card draw options.</p>
                <div class="dlcg-shortcode-box">
                    <code>[dailylife_solitaire]</code>
                    <button class="button button-small dlcg-copy-btn" data-shortcode="[dailylife_solitaire]">Copy</button>
                </div>
                <p class="description">Optional parameters:</p>
                <ul>
                    <li><code>mode="single"</code> - Single card draw (default)</li>
                    <li><code>mode="three"</code> - Three card draw</li>
                </ul>
                <p class="example"><strong>Example:</strong> <code>[dailylife_solitaire mode="three"]</code></p>
            </div>
            
            <div class="dlcg-shortcode-section">
                <h3>🎴 FreeCell</h3>
                <p>Strategic card game where all cards are visible from the start.</p>
                <div class="dlcg-shortcode-box">
                    <code>[dailylife_freecell]</code>
                    <button class="button button-small dlcg-copy-btn" data-shortcode="[dailylife_freecell]">Copy</button>
                </div>
            </div>
            
            <div class="dlcg-shortcode-section">
                <h3>🕷️ Spider Solitaire</h3>
                <p>Challenging solitaire variant with multiple difficulty levels.</p>
                <div class="dlcg-shortcode-box">
                    <code>[dailylife_spider]</code>
                    <button class="button button-small dlcg-copy-btn" data-shortcode="[dailylife_spider]">Copy</button>
                </div>
                <p class="description">Optional parameters:</p>
                <ul>
                    <li><code>suits="1"</code> - Single suit (easiest, default)</li>
                    <li><code>suits="2"</code> - Two suits (medium)</li>
                    <li><code>suits="4"</code> - Four suits (hardest)</li>
                </ul>
                <p class="example"><strong>Example:</strong> <code>[dailylife_spider suits="2"]</code></p>
            </div>
            
            <div class="dlcg-shortcode-section">
                <h3>💣 Emoji Minesweeper</h3>
                <p>Classic Minesweeper with animated emojis instead of numbers.</p>
                <div class="dlcg-shortcode-box">
                    <code>[dailylife_minesweeper]</code>
                    <button class="button button-small dlcg-copy-btn" data-shortcode="[dailylife_minesweeper]">Copy</button>
                </div>
                <p class="description">Optional parameters:</p>
                <ul>
                    <li><code>mode="emoji"</code> - Emoji mode (default)</li>
                    <li><code>mode="classic"</code> - Classic number mode</li>
                    <li><code>difficulty="easy"</code> - 8x8 grid, 10 mines</li>
                    <li><code>difficulty="medium"</code> - 16x16 grid, 40 mines (default)</li>
                    <li><code>difficulty="hard"</code> - 16x30 grid, 99 mines</li>
                </ul>
                <p class="example"><strong>Example:</strong> <code>[dailylife_minesweeper mode="classic" difficulty="hard"]</code></p>
            </div>
        </div>
        
        <div class="dlcg-admin-card">
            <h2>Game Features</h2>
            <ul class="dlcg-features-list">
                <li>⏱️ Built-in timer for all games</li>
                <li>🔊 Sound effects with mute/unmute toggle</li>
                <li>↩️ Undo button to reverse moves</li>
                <li>🎯 Auto-play feature for card games</li>
                <li>⭐ Star rating system based on performance</li>
                <li>🖱️ Smooth drag-and-drop or click-to-move controls</li>
                <li>🎨 Eye-catching colors and HD graphics</li>
                <li>📱 Responsive design for all devices</li>
            </ul>
        </div>
        
        <div class="dlcg-admin-card">
            <h2>How to Use</h2>
            <ol>
                <li>Copy the shortcode for the game you want to add</li>
                <li>Edit a page or post in WordPress</li>
                <li>Paste the shortcode where you want the game to appear</li>
                <li>Publish or update the page</li>
                <li>The game will be embedded and ready to play!</li>
            </ol>
        </div>
        
        <div class="dlcg-admin-card">
            <h2>Support & Documentation</h2>
            <p>For detailed game rules and instructions, check the "How to Play" guides included with the plugin:</p>
            <ul>
                <li>📄 how-to-play-solitaire.txt</li>
                <li>📄 how-to-play-freecell.txt</li>
                <li>📄 how-to-play-spider.txt</li>
                <li>📄 how-to-play-minesweeper.txt</li>
            </ul>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const copyButtons = document.querySelectorAll('.dlcg-copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const shortcode = this.getAttribute('data-shortcode');
            navigator.clipboard.writeText(shortcode).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.style.background = '#46b450';
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            });
        });
    });
});
</script>
