/* ==========================================================================
   SIMPLE LOVE LETTER APP CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const passwordScreen = document.getElementById('password-screen');
    const passwordInput = document.getElementById('password-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const errorMsg = document.getElementById('error-msg');
    const mainWrapper = document.getElementById('main-wrapper');

    function checkPassword() {
        const val = passwordInput ? passwordInput.value.trim() : '';
        if (val === '2872003') {
            if (errorMsg) errorMsg.textContent = '';
            if (passwordScreen) passwordScreen.classList.add('unlocked');
            if (mainWrapper) mainWrapper.classList.add('visible');
        } else {
            const card = document.querySelector('.password-card');
            if (card) {
                card.classList.add('shake');
                setTimeout(() => card.classList.remove('shake'), 400);
            }
            if (errorMsg) errorMsg.textContent = 'كلمة السر غير صحيحة، جربي تاني 😉';
        }
    }

    if (unlockBtn) unlockBtn.addEventListener('click', checkPassword);
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPassword();
        });
    }
});
