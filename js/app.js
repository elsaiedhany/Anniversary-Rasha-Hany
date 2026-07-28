/* ==========================================================================
   SIMPLE INTIMATE APP CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const passwordScreen = document.getElementById('password-screen');
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const errorMsg = document.getElementById('error-msg');
    const mainWrapper = document.getElementById('main-wrapper');

    const surpriseBtn = document.getElementById('surprise-btn');
    const surpriseModal = document.getElementById('surprise-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    function checkPassword() {
        const value = passwordInput ? passwordInput.value.trim() : '';
        if (value === '2872003') {
            if (errorMsg) errorMsg.textContent = '';
            if (passwordScreen) passwordScreen.classList.add('unlocked');
            if (mainWrapper) mainWrapper.classList.add('visible');

            // Start ambient music if Web Audio is initialized
            if (window.AnniversaryAudio) {
                window.AnniversaryAudio.start();
            }
        } else {
            const box = document.querySelector('.password-box');
            if (box) {
                box.classList.add('shake');
                setTimeout(() => box.classList.remove('shake'), 400);
            }
            if (errorMsg) {
                errorMsg.textContent = 'كلمة السر غير صحيحة، جربي تاني 😉';
            }
        }
    }

    if (unlockBtn) unlockBtn.addEventListener('click', checkPassword);
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPassword();
        });
    }

    // Surprise Button Click
    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', () => {
            // Trigger Fireworks & Floating Confetti
            if (typeof window.triggerSurpriseFireworks === 'function') {
                window.triggerSurpriseFireworks();
            }

            // Display Surprise Modal
            setTimeout(() => {
                if (surpriseModal) {
                    surpriseModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }, 300);
        });
    }

    function closeModal() {
        if (surpriseModal) {
            surpriseModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (surpriseModal) {
        surpriseModal.addEventListener('click', (e) => {
            if (e.target === surpriseModal) closeModal();
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});
