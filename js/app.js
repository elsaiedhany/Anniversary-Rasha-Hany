/* ==========================================================================
   MAIN APPLICATION CONTROLLER (PRODUCTION DEBUGGED & OPTIMIZED)
   ========================================================================== */

(function () {
    'use strict';

    // 1. Preloader Handler - Robust timing fix
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader && !preloader.classList.contains('hidden')) {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 400);
        }
    }

    if (document.readyState === 'complete') {
        hidePreloader();
    } else {
        window.addEventListener('load', hidePreloader);
        // Fail-safe backup: hide preloader after max 2.5 seconds regardless
        setTimeout(hidePreloader, 2500);
    }

    document.addEventListener('DOMContentLoaded', () => {

        // 2. Initialize AOS immediately on DOM ready
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 900,
                easing: 'ease-out-cubic',
                once: true,
                offset: 60
            });
        }

        // 3. Mouse Glow Cursor
        const mouseGlow = document.querySelector('.mouse-glow');
        if (mouseGlow) {
            window.addEventListener('mousemove', (e) => {
                mouseGlow.style.left = `${e.clientX}px`;
                mouseGlow.style.top = `${e.clientY}px`;
            });
        }

        // 4. Scroll Progress Bar & Back To Top & Active Nav
        const progressBar = document.querySelector('.scroll-progress-bar');
        const backToTopBtn = document.querySelector('.back-to-top');
        const navLinks = document.querySelectorAll('.nav-links a');
        const sections = document.querySelectorAll('section[id]');

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

            if (progressBar) {
                progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
            }

            if (backToTopBtn) {
                if (scrollTop > 350) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            }

            // Active section highlight
            let currentSection = '';
            sections.forEach(sec => {
                const secTop = sec.offsetTop - 180;
                if (scrollTop >= secTop) {
                    currentSection = sec.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });

        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // 5. Password Screen & Unlock Logic
        const passwordScreen = document.getElementById('password-screen');
        const passwordInput = document.getElementById('password-input');
        const unlockBtn = document.getElementById('unlock-btn');
        const passwordError = document.getElementById('password-error');

        const cinematicIntro = document.getElementById('cinematic-intro');
        const mainWrapper = document.getElementById('main-wrapper');
        const introContinueBtn = document.getElementById('intro-continue-btn');

        function checkPassword() {
            const value = passwordInput ? passwordInput.value.trim() : '';
            if (value === '28072003') {
                // Correct Password
                if (passwordError) passwordError.classList.remove('visible');
                if (passwordScreen) passwordScreen.classList.add('unlocked');

                // Start audio on user interaction gesture
                if (window.AnniversaryAudio) {
                    window.AnniversaryAudio.start();
                }

                // Start Intro
                setTimeout(() => {
                    startCinematicIntro();
                }, 400);
            } else {
                // Wrong Password
                const card = document.querySelector('.password-card');
                if (card) {
                    card.classList.add('shake');
                    setTimeout(() => card.classList.remove('shake'), 500);
                }
                if (passwordError) {
                    passwordError.textContent = 'كلمة السر غير صحيحة، فكّري في تاريخ جوازكم 😉';
                    passwordError.classList.add('visible');
                }
            }
        }

        if (unlockBtn) {
            unlockBtn.addEventListener('click', checkPassword);
        }
        if (passwordInput) {
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') checkPassword();
            });
        }

        // 6. Cinematic Intro Handler
        function startCinematicIntro() {
            if (!cinematicIntro) return;
            cinematicIntro.classList.add('active');

            // Fail-safe: ensure continue button becomes visible after max 1.5 seconds
            setTimeout(() => {
                if (introContinueBtn) introContinueBtn.classList.add('show');
            }, 1500);

            // Typed.js Animation
            if (typeof Typed !== 'undefined') {
                try {
                    new Typed('#intro-typed-output', {
                        strings: ['كل سنة وإنت حبيبي ❤️', '28 يوليو 2003... عهد حب أبدي ✨'],
                        typeSpeed: 60,
                        backSpeed: 35,
                        startDelay: 200,
                        backDelay: 1600,
                        loop: false,
                        showCursor: true,
                        cursorChar: '❤️',
                        onComplete: () => {
                            if (introContinueBtn) introContinueBtn.classList.add('show');
                        }
                    });
                } catch (err) {
                    fallbackIntroText();
                }
            } else {
                fallbackIntroText();
            }
        }

        function fallbackIntroText() {
            const output = document.getElementById('intro-typed-output');
            if (output) output.textContent = 'كل سنة وإنت حبيبي ❤️';
            if (introContinueBtn) introContinueBtn.classList.add('show');
        }

        if (introContinueBtn) {
            introContinueBtn.addEventListener('click', () => {
                if (cinematicIntro) cinematicIntro.classList.remove('active');
                if (mainWrapper) mainWrapper.classList.add('visible');

                // Refresh AOS & GSAP Hero Animations
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }

                if (typeof gsap !== 'undefined') {
                    gsap.from('.hero-badge', { opacity: 0, y: 25, duration: 0.8, delay: 0.1 });
                    gsap.from('.hero-title', { opacity: 0, y: 35, duration: 1.0, delay: 0.3 });
                    gsap.from('.hero-subtitle', { opacity: 0, y: 35, duration: 1.0, delay: 0.5 });
                    gsap.from('.hero-cta-wrapper', { opacity: 0, scale: 0.9, duration: 0.8, delay: 0.7 });
                }
            });
        }

        // 7. Lightbox Gallery Controller with Body Scroll Lock
        const galleryItems = document.querySelectorAll('.gallery-item');
        const lightboxModal = document.getElementById('lightbox-modal');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');

        let currentGalleryIndex = 0;
        const galleryData = [];

        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const caption = item.querySelector('.gallery-caption')?.textContent || '';
            if (img) {
                galleryData.push({ src: img.src, caption });
                item.addEventListener('click', () => openLightbox(index));
            }
        });

        function openLightbox(index) {
            if (index < 0 || index >= galleryData.length) return;
            currentGalleryIndex = index;
            const data = galleryData[currentGalleryIndex];
            if (!data || !lightboxModal) return;

            lightboxImg.src = data.src;
            lightboxCaption.textContent = data.caption;
            lightboxModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            if (lightboxModal) {
                lightboxModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        function prevLightbox() {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
            openLightbox(currentGalleryIndex);
        }

        function nextLightbox() {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
            openLightbox(currentGalleryIndex);
        }

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', prevLightbox);
        if (lightboxNext) lightboxNext.addEventListener('click', nextLightbox);

        if (lightboxModal) {
            lightboxModal.addEventListener('click', (e) => {
                if (e.target === lightboxModal) closeLightbox();
            });
        }

        // 8. Surprise Trigger & Modal Handler
        const surpriseBtn = document.getElementById('surprise-btn');
        const surpriseModal = document.getElementById('surprise-modal');
        const surpriseClose = document.getElementById('surprise-close');

        if (surpriseBtn) {
            surpriseBtn.addEventListener('click', () => {
                if (typeof window.triggerSurpriseFireworks === 'function') {
                    window.triggerSurpriseFireworks();
                }
                setTimeout(() => {
                    if (surpriseModal) {
                        surpriseModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    }
                }, 300);
            });
        }

        function closeSurpriseModal() {
            if (surpriseModal) {
                surpriseModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        if (surpriseClose) surpriseClose.addEventListener('click', closeSurpriseModal);
        if (surpriseModal) {
            surpriseModal.addEventListener('click', (e) => {
                if (e.target === surpriseModal) closeSurpriseModal();
            });
        }

        // Keyboard Navigation (Escape, Left, Right)
        window.addEventListener('keydown', (e) => {
            if (lightboxModal && lightboxModal.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') nextLightbox();
                if (e.key === 'ArrowRight') prevLightbox();
            }
            if (surpriseModal && surpriseModal.classList.contains('active')) {
                if (e.key === 'Escape') closeSurpriseModal();
            }
        });
    });
})();
