/**
 * Sound Manager for Snake Arena
 * Uses Web Audio API to generate synthetic sounds
 */

class SoundManager {
    private audioContext: AudioContext | null = null;
    private isMuted: boolean = false;

    constructor() {
        // Initialize on user interaction (required by browsers)
        this.initAudioContext();
    }

    private initAudioContext() {
        if (typeof window !== 'undefined' && 'AudioContext' in window) {
            this.audioContext = new AudioContext();
        }
    }

    private ensureAudioContext() {
        if (!this.audioContext) {
            this.initAudioContext();
        }
        // Resume if suspended (required by some browsers)
        if (this.audioContext?.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    /**
     * Play a tone with specified frequency and duration
     */
    private playTone(
        frequency: number,
        duration: number,
        type: OscillatorType = 'sine',
        volume: number = 0.3
    ) {
        if (this.isMuted || !this.audioContext) return;

        this.ensureAudioContext();
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    /**
     * Play multiple tones in sequence
     */
    private playSequence(
        notes: Array<{ frequency: number; duration: number; type?: OscillatorType }>,
        volume: number = 0.3
    ) {
        if (this.isMuted || !this.audioContext) return;

        this.ensureAudioContext();
        if (!this.audioContext) return;

        let currentTime = this.audioContext.currentTime;

        notes.forEach((note) => {
            const oscillator = this.audioContext!.createOscillator();
            const gainNode = this.audioContext!.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext!.destination);

            oscillator.type = note.type || 'sine';
            oscillator.frequency.value = note.frequency;

            gainNode.gain.setValueAtTime(volume, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                currentTime + note.duration
            );

            oscillator.start(currentTime);
            oscillator.stop(currentTime + note.duration);

            currentTime += note.duration;
        });
    }

    /**
     * Sound: Eating food (pleasant "nom" sound)
     */
    playEatSound() {
        // Quick ascending tone (nom!)
        this.playSequence([
            { frequency: 440, duration: 0.05, type: 'sine' },
            { frequency: 550, duration: 0.05, type: 'sine' },
        ], 0.2);
    }

    /**
     * Sound: Game Over (dramatic descending tones)
     */
    playGameOverSound() {
        // Descending dramatic sequence
        this.playSequence([
            { frequency: 440, duration: 0.15, type: 'sawtooth' },
            { frequency: 370, duration: 0.15, type: 'sawtooth' },
            { frequency: 294, duration: 0.15, type: 'sawtooth' },
            { frequency: 220, duration: 0.3, type: 'sawtooth' },
        ], 0.25);
    }

    /**
     * Sound: New high score (fanfare!)
     */
    playHighScoreSound() {
        // Triumphant ascending melody
        this.playSequence([
            { frequency: 523, duration: 0.1, type: 'square' }, // C
            { frequency: 659, duration: 0.1, type: 'square' }, // E
            { frequency: 784, duration: 0.1, type: 'square' }, // G
            { frequency: 1047, duration: 0.3, type: 'square' }, // C (high)
        ], 0.2);
    }

    /**
     * Sound: Start game (uplifting beep)
     */
    playStartSound() {
        this.playSequence([
            { frequency: 440, duration: 0.1, type: 'square' },
            { frequency: 554, duration: 0.15, type: 'square' },
        ], 0.2);
    }

    /**
     * RPG SOUNDS
     */

    /**
     * Sound: Hit enemy (impact sound)
     */
    playHitEnemySound() {
        // Sharp impact
        this.playTone(200, 0.08, 'square', 0.25);
    }

    /**
     * Sound: Take damage (hurt sound)
     */
    playTakeDamageSound() {
        // Descending hurt sound
        this.playSequence([
            { frequency: 300, duration: 0.08, type: 'sawtooth' },
            { frequency: 150, duration: 0.12, type: 'sawtooth' },
        ], 0.3);
    }

    /**
     * Sound: Level up (fanfare)
     */
    playLevelUpSound() {
        // Epic level up melody
        this.playSequence([
            { frequency: 523, duration: 0.12, type: 'square' }, // C
            { frequency: 659, duration: 0.12, type: 'square' }, // E
            { frequency: 784, duration: 0.12, type: 'square' }, // G
            { frequency: 1047, duration: 0.25, type: 'square' }, // C (high)
        ], 0.25);
    }

    /**
     * Sound: Enemy death (explosion)
     */
    playEnemyDeathSound() {
        // Explosion-like sound
        this.playSequence([
            { frequency: 100, duration: 0.05, type: 'sawtooth' },
            { frequency: 80, duration: 0.1, type: 'sawtooth' },
        ], 0.2);
    }

    /**
     * Sound: Collect gem (sparkle)
     */
    playCollectGemSound() {
        // Bright sparkle
        this.playSequence([
            { frequency: 880, duration: 0.06, type: 'sine' },
            { frequency: 1100, duration: 0.06, type: 'sine' },
            { frequency: 1320, duration: 0.08, type: 'sine' },
        ], 0.2);
    }

    /**
     * Sound: Collect star (special)
     */
    playCollectStarSound() {
        // Magical chime
        this.playSequence([
            { frequency: 1320, duration: 0.1, type: 'sine' },
            { frequency: 1568, duration: 0.1, type: 'sine' },
            { frequency: 2093, duration: 0.15, type: 'sine' },
        ], 0.25);
    }

    /**
     * Sound: Pause (single beep)
     */
    playPauseSound() {
        this.playTone(440, 0.1, 'sine', 0.2);
    }

    /**
     * Mute/unmute sounds
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('snake_sound_muted', JSON.stringify(this.isMuted));
        return this.isMuted;
    }

    /**
     * Get current mute state
     */
    getMuteState(): boolean {
        return this.isMuted;
    }

    /**
     * Initialize mute state from localStorage
     */
    initMuteState() {
        const saved = localStorage.getItem('snake_sound_muted');
        if (saved) {
            this.isMuted = JSON.parse(saved);
        }
    }
}

// Singleton instance
export const soundManager = new SoundManager();
soundManager.initMuteState();
