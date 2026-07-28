/* ==========================================================================
   SIMPLE ROMANTIC APP CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Password Verification
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
            initSlider();
        } else {
            const box = document.querySelector('.password-box');
            if (box) {
                box.classList.add('shake');
                setTimeout(() => box.classList.remove('shake'), 400);
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

    // 2. Photo Slider Controller
    let currentSlide = 0;
    let sliderInterval = null;

    function initSlider() {
        const slides = document.querySelectorAll('.slider-slide');
        const prevBtn = document.getElementById('slider-prev');
        const nextBtn = document.getElementById('slider-next');

        if (!slides.length) return;

        function showSlide(index) {
            slides.forEach((s, idx) => {
                s.classList.toggle('active', idx === index);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        // Auto slide every 3.5 seconds
        if (!sliderInterval) {
            sliderInterval = setInterval(nextSlide, 3500);
        }
    }

    // 3. Surprise Button (Confetti + Floating Hearts + Centered Message)
    const surpriseBtn = document.getElementById('surprise-btn');
    const surpriseModal = document.getElementById('surprise-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', () => {
            // Launch Confetti
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 120,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#D4AF37', '#FFD700', '#FFFFFF', '#FF5E5E']
                });
            }

            // Launch Floating Hearts
            if (typeof window.triggerFloatingHearts === 'function') {
                window.triggerFloatingHearts();
            }

            // Show Centered Modal Message
            setTimeout(() => {
                if (surpriseModal) surpriseModal.classList.add('active');
            }, 300);
        });
    }

    function closeModal() {
        if (surpriseModal) surpriseModal.classList.remove('active');
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (surpriseModal) {
        surpriseModal.addEventListener('click', (e) => {
            if (e.target === surpriseModal) closeModal();
        });
    }
});
