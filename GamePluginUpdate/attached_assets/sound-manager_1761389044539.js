/**
 * Sound Manager - Generates and plays game sound effects
 */

class SoundManager {
    constructor() {
        this.enabled = true;
        this.audioContext = null;
        this.sounds = {};
        
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initSounds();
        }
    }
    
    initSounds() {
        this.sounds = {
            move: () => this.playCardMove(),
            flip: () => this.playCardFlip(),
            place: () => this.playCardPlace(),
            invalid: () => this.playInvalid(),
            win: () => this.playWin(),
            click: () => this.playClick(),
            flag: () => this.playFlag(),
            reveal: () => this.playReveal(),
            explode: () => this.playExplode()
        };
    }
    
    play(soundName) {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            if (this.sounds[soundName]) {
                this.sounds[soundName]();
            }
        } catch (e) {
            console.error('Sound play error:', e);
        }
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    playCardMove() {
        this.playTone(220, 0.1, 'sine', 0.15);
    }
    
    playCardFlip() {
        this.playTone(330, 0.08, 'triangle', 0.1);
        setTimeout(() => this.playTone(440, 0.08, 'triangle', 0.1), 50);
    }
    
    playCardPlace() {
        this.playTone(440, 0.15, 'sine', 0.2);
    }
    
    playInvalid() {
        this.playTone(150, 0.2, 'sawtooth', 0.15);
    }
    
    playClick() {
        this.playTone(800, 0.05, 'square', 0.1);
    }
    
    playFlag() {
        this.playTone(600, 0.1, 'sine', 0.15);
    }
    
    playReveal() {
        this.playTone(500, 0.08, 'triangle', 0.12);
    }
    
    playExplode() {
        const ctx = this.audioContext;
        const duration = 0.5;
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + duration);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    }
    
    playWin() {
        const notes = [523.25, 587.33, 659.25, 783.99];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'sine', 0.25);
            }, i * 150);
        });
    }
    
    playTone(frequency, duration, type = 'sine', volume = 0.2) {
        if (!this.audioContext) return;
        
        const ctx = this.audioContext;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    }
}

window.SoundManager = new SoundManager();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundManager;
}
