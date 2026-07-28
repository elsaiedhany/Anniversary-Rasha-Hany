/* ==========================================================================
   MAIN APPLICATION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // 1. Preloader Handler
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        if (preloader) {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 600);
        }
    });

    // 2. Mouse Glow Cursor
    const mouseGlow = document.querySelector('.mouse-glow');
    if (mouseGlow) {
        window.addEventListener('mousemove', (e) => {
            mouseGlow.style.left = `${e.clientX}px`;
            mouseGlow.style.top = `${e.clientY}px`;
        });
    }

    // 3. Scroll Progress Bar & Back To Top & Nav Active State
    const progressBar = document.querySelector('.scroll-progress-bar');
    const backToTopBtn = document.querySelector('.back-to-top');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        if (backToTopBtn) {
            if (scrollTop > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Active section highlight
        let currentSection = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 150;
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

    // 4. Password Screen & Unlock Flow
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
            // Correct password
            if (passwordError) passwordError.classList.remove('visible');
            if (passwordScreen) passwordScreen.classList.add('unlocked');
            
            // Start Cinematic Intro
            setTimeout(() => {
                startCinematicIntro();
            }, 500);
        } else {
            // Wrong password
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

    // 5. Cinematic Intro Handler
    function startCinematicIntro() {
        if (!cinematicIntro) return;
        cinematicIntro.classList.add('active');

        // Start Audio background if available
        if (window.AnniversaryAudio) {
            window.AnniversaryAudio.start();
        }

        // Typed.js Animation for Intro Text
        if (typeof Typed !== 'undefined') {
            new Typed('#intro-typed-output', {
                strings: ['كل سنة وإنت حبيبي ❤️', '28 يوليو 2003... عهد حب أبدي ✨'],
                typeSpeed: 70,
                backSpeed: 40,
                startDelay: 300,
                backDelay: 1800,
                loop: false,
                showCursor: true,
                cursorChar: '❤️',
                onComplete: () => {
                    if (introContinueBtn) introContinueBtn.classList.add('show');
                }
            });
        } else {
            const output = document.getElementById('intro-typed-output');
            if (output) output.textContent = 'كل سنة وإنت حبيبي ❤️';
            if (introContinueBtn) introContinueBtn.classList.add('show');
        }
    }

    if (introContinueBtn) {
        introContinueBtn.addEventListener('click', () => {
            if (cinematicIntro) cinematicIntro.classList.remove('active');
            if (mainWrapper) mainWrapper.classList.add('visible');
            
            // Init AOS & GSAP after intro view
            initAnimations();
        });
    }

    // 6. AOS & GSAP Animations Initialization
    function initAnimations() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                easing: 'ease-out-cubic',
                once: true,
                offset: 120
            });
        }

        if (typeof gsap !== 'undefined') {
            gsap.from('.hero-badge', { opacity: 0, y: 30, duration: 1, delay: 0.2 });
            gsap.from('.hero-title', { opacity: 0, y: 40, duration: 1.2, delay: 0.4 });
            gsap.from('.hero-subtitle', { opacity: 0, y: 40, duration: 1.2, delay: 0.6 });
            gsap.from('.hero-cta-wrapper', { opacity: 0, scale: 0.9, duration: 1, delay: 0.8 });
        }
    }

    // 7. Lightbox Gallery Controller
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
        galleryData.push({ src: img.src, caption });

        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentGalleryIndex = index;
        const data = galleryData[currentGalleryIndex];
        if (!data || !lightboxModal) return;

        lightboxImg.src = data.src;
        lightboxCaption.textContent = data.caption;
        lightboxModal.classList.add('active');
    }

    function closeLightbox() {
        if (lightboxModal) lightboxModal.classList.remove('active');
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

    window.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') nextLightbox(); // RTL
            if (e.key === 'ArrowRight') prevLightbox(); // RTL
        }
        if (surpriseModal && surpriseModal.classList.contains('active')) {
            if (e.key === 'Escape') closeSurpriseModal();
        }
    });

    // 8. Surprise Trigger & Modal Handler
    const surpriseBtn = document.getElementById('surprise-btn');
    const surpriseModal = document.getElementById('surprise-modal');
    const surpriseClose = document.getElementById('surprise-close');

    if (surpriseBtn) {
        surpriseBtn.addEventListener('click', () => {
            // Trigger Fireworks & Confetti
            if (typeof window.triggerSurpriseFireworks === 'function') {
                window.triggerSurpriseFireworks();
            }

            // Open Surprise Modal
            setTimeout(() => {
                if (surpriseModal) surpriseModal.classList.add('active');
            }, 300);
        });
    }

    function closeSurpriseModal() {
        if (surpriseModal) surpriseModal.classList.remove('active');
    }

    if (surpriseClose) surpriseClose.addEventListener('click', closeSurpriseModal);
    if (surpriseModal) {
        surpriseModal.addEventListener('click', (e) => {
            if (e.target === surpriseModal) closeSurpriseModal();
        });
    }
});
