<?php
/**
 * Plugin Name: DailyLiife Classic Games
 * Plugin URI: https://dailyliifeclassicgames.com
 * Description: Four classic games: Solitaire, FreeCell, Spider Solitaire, and Emoji Minesweeper with smooth gameplay, timers, and sound effects.
 * Version: 1.72
 * Author: DailyLiife Games
 * Author URI: https://dailyliifeclassicgames.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: dailyliife-classic-games
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

define('DLCG_VERSION', '1.72');
define('DLCG_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DLCG_PLUGIN_URL', plugin_dir_url(__FILE__));

class DailyLiife_Classic_Games {
    
    private static $instance = null;
    
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    private function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        
        $this->register_shortcodes();
    }
    
    public function enqueue_scripts() {
        wp_enqueue_style('dlcg-main-style', DLCG_PLUGIN_URL . 'assets/css/main.css', array(), DLCG_VERSION);
        wp_enqueue_style('dlcg-games-style', DLCG_PLUGIN_URL . 'assets/css/games.css', array(), DLCG_VERSION);
        
        wp_enqueue_script('dlcg-game-core', DLCG_PLUGIN_URL . 'assets/js/game-core.js', array(), DLCG_VERSION, true);
        wp_enqueue_script('dlcg-sound-manager', DLCG_PLUGIN_URL . 'assets/js/sound-manager.js', array('dlcg-game-core'), DLCG_VERSION, true);
        wp_enqueue_script('dlcg-solitaire', DLCG_PLUGIN_URL . 'assets/js/solitaire.js', array('dlcg-game-core'), DLCG_VERSION, true);
        wp_enqueue_script('dlcg-freecell', DLCG_PLUGIN_URL . 'assets/js/freecell.js', array('dlcg-game-core'), DLCG_VERSION, true);
        wp_enqueue_script('dlcg-spider', DLCG_PLUGIN_URL . 'assets/js/spider.js', array('dlcg-game-core'), DLCG_VERSION, true);
        wp_enqueue_script('dlcg-minesweeper', DLCG_PLUGIN_URL . 'assets/js/minesweeper.js', array('dlcg-game-core'), DLCG_VERSION, true);
    }
    
    public function enqueue_admin_scripts($hook) {
        if ('toplevel_page_dailyliife-classic-games' !== $hook) {
            return;
        }
        wp_enqueue_style('dlcg-admin-style', DLCG_PLUGIN_URL . 'assets/css/admin.css', array(), DLCG_VERSION);
    }
    
    public function add_admin_menu() {
        add_menu_page(
            'DailyLiife Classic Games',
            'Classic Games',
            'manage_options',
            'dailyliife-classic-games',
            array($this, 'render_admin_page'),
            'dashicons-games',
            30
        );
    }
    
    public function render_admin_page() {
        include DLCG_PLUGIN_DIR . 'admin/admin-page.php';
    }
    
    private function register_shortcodes() {
        add_shortcode('dailyliife_solitaire', array($this, 'solitaire_shortcode'));
        add_shortcode('dailyliife_freecell', array($this, 'freecell_shortcode'));
        add_shortcode('dailyliife_spider', array($this, 'spider_shortcode'));
        add_shortcode('dailyliife_minesweeper', array($this, 'minesweeper_shortcode'));
    }
    
    public function solitaire_shortcode($atts) {
        $atts = shortcode_atts(array(
            'mode' => 'single',
        ), $atts);
        
        ob_start();
        include DLCG_PLUGIN_DIR . 'templates/solitaire.php';
        return ob_get_clean();
    }
    
    public function freecell_shortcode($atts) {
        ob_start();
        include DLCG_PLUGIN_DIR . 'templates/freecell.php';
        return ob_get_clean();
    }
    
    public function spider_shortcode($atts) {
        $atts = shortcode_atts(array(
            'suits' => '1',
        ), $atts);
        
        ob_start();
        include DLCG_PLUGIN_DIR . 'templates/spider.php';
        return ob_get_clean();
    }
    
    public function minesweeper_shortcode($atts) {
        $atts = shortcode_atts(array(
            'mode' => 'emoji',
            'difficulty' => 'medium',
        ), $atts);
        
        ob_start();
        include DLCG_PLUGIN_DIR . 'templates/minesweeper.php';
        return ob_get_clean();
    }
}

function dlcg_init() {
    return DailyLiife_Classic_Games::get_instance();
}

add_action('plugins_loaded', 'dlcg_init');
