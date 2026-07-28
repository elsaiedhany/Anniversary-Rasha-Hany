/* ==========================================================================
   ROMANTIC AMBIENT AUDIO ENGINE (WEB AUDIO SYNTH & PLAYER - DEBUGGED)
   ========================================================================== */

(function () {
    'use strict';

    let audioCtx = null;
    let isPlaying = false;
    let masterGain = null;
    let timerId = null;
    let currentNoteIndex = 0;

    const musicBtn = document.getElementById('music-toggle-btn');
    const musicWidget = document.getElementById('music-widget');
    const playToggleBtn = document.getElementById('play-toggle-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const discIcon = document.querySelector('.disc-icon');
    const eqBars = document.querySelector('.equalizer-bars');

    const chords = [
        [349.23, 440.00, 523.25, 659.25], // F4, A4, C5, E5
        [261.63, 329.63, 392.00, 493.88], // C4, E4, G4, B4
        [220.00, 261.63, 329.63, 392.00], // A3, C4, E4, G4
        [196.00, 246.94, 293.66, 392.00]  // G3, B3, D4, G4
    ];

    function initAudio() {
        if (!audioCtx) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return false;
                audioCtx = new AudioContext();
                masterGain = audioCtx.createGain();
                masterGain.gain.value = parseFloat(volumeSlider ? volumeSlider.value : 0.4);
                masterGain.connect(audioCtx.destination);
            } catch (e) {
                return false;
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return true;
    }

    function playSoftNote(freq, duration = 3.5, timeOffset = 0) {
        if (!audioCtx || !isPlaying || audioCtx.state !== 'running') return;

        try {
            const osc = audioCtx.createOscillator();
            const noteGain = audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + timeOffset);

            const now = audioCtx.currentTime + timeOffset;
            noteGain.gain.setValueAtTime(0.0001, now);
            noteGain.gain.exponentialRampToValueAtTime(0.1, now + 0.3);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

            osc.connect(noteGain);
            noteGain.connect(masterGain);

            osc.start(now);
            osc.stop(now + duration + 0.1);
        } catch (e) {}
    }

    function playNextChordStep() {
        if (!isPlaying) return;

        const chord = chords[currentNoteIndex % chords.length];
        chord.forEach((freq, idx) => {
            playSoftNote(freq, 3.8, idx * 0.14);
        });

        currentNoteIndex++;
        timerId = setTimeout(playNextChordStep, 3100);
    }

    function startMusic() {
        if (!initAudio()) return;
        isPlaying = true;
        updateUI(true);
        if (timerId) clearTimeout(timerId);
        playNextChordStep();
    }

    function stopMusic() {
        isPlaying = false;
        if (timerId) clearTimeout(timerId);
        updateUI(false);
    }

    function toggleMusic() {
        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    function updateUI(active) {
        if (discIcon) discIcon.classList.toggle('playing', active);
        if (eqBars) eqBars.classList.toggle('playing', active);
        if (playToggleBtn) {
            playToggleBtn.innerHTML = active ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
        }
        if (musicBtn) {
            musicBtn.innerHTML = active ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-music"></i>';
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (musicWidget) musicWidget.classList.toggle('open');
        });
    }

    if (playToggleBtn) {
        playToggleBtn.addEventListener('click', toggleMusic);
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            if (masterGain && audioCtx) {
                masterGain.gain.setValueAtTime(val, audioCtx.currentTime);
            }
        });
    }

    window.AnniversaryAudio = {
        start: startMusic,
        stop: stopMusic,
        toggle: toggleMusic
    };
})();
