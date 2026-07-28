/* ==========================================================================
   SURPRISE FIREWORKS & CONFETTI ENGINE
   ========================================================================== */

(function () {
    'use strict';

    window.triggerSurpriseFireworks = function () {
        // 1. Canvas Confetti Gold & Red Burst
        if (typeof confetti === 'function') {
            const count = 200;
            const defaults = {
                origin: { y: 0.7 }
            };

            function fire(particleRatio, opts) {
                confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                }));
            }

            fire(0.25, {
                spread: 26,
                startVelocity: 55,
                colors: ['#D4AF37', '#FFD700', '#FFFFFF']
            });
            fire(0.2, {
                spread: 60,
                colors: ['#D4AF37', '#E5C158', '#FF5E5E']
            });
            fire(0.35, {
                spread: 100,
                decay: 0.91,
                scalar: 0.8,
                colors: ['#D4AF37', '#FFD700', '#FFF0A5']
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 25,
                decay: 0.92,
                colors: ['#FFD700', '#FFFFFF']
            });
            fire(0.1, {
                spread: 120,
                startVelocity: 45,
                colors: ['#D4AF37', '#997A15']
            });

            // Second wave after 400ms
            setTimeout(() => {
                confetti({
                    particleCount: 100,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#D4AF37', '#FFD700', '#FFFFFF']
                });
                confetti({
                    particleCount: 100,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#D4AF37', '#FFD700', '#FFFFFF']
                });
            }, 400);
        }

        // 2. Fireworks Canvas Effect
        const fwCanvas = document.getElementById('fireworks-canvas');
        if (!fwCanvas) return;

        const ctx = fwCanvas.getContext('2d');
        let width = (fwCanvas.width = window.innerWidth);
        let height = (fwCanvas.height = window.innerHeight);

        let fwParticles = [];

        class FWParticle {
            constructor(x, y, color) {
                this.x = x;
                this.y = y;
                this.color = color;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 8 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.gravity = 0.12;
                this.alpha = 1;
                this.decay = Math.random() * 0.02 + 0.015;
            }

            update() {
                this.vx *= 0.96;
                this.vy *= 0.96;
                this.vy += this.gravity;
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.beginPath();
                ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.restore();
            }
        }

        function createBurst(x, y) {
            const colors = ['#D4AF37', '#FFD700', '#FFF0A5', '#FFFFFF', '#E6C665'];
            for (let i = 0; i < 70; i++) {
                const col = colors[Math.floor(Math.random() * colors.length)];
                fwParticles.push(new FWParticle(x, y, col));
            }
        }

        // Create 3 burst locations
        createBurst(width * 0.3, height * 0.3);
        createBurst(width * 0.7, height * 0.35);
        createBurst(width * 0.5, height * 0.25);

        let animFrame;
        function animateFW() {
            ctx.clearRect(0, 0, width, height);

            fwParticles.forEach((p, idx) => {
                p.update();
                p.draw();
                if (p.alpha <= 0) {
                    fwParticles.splice(idx, 1);
                }
            });

            if (fwParticles.length > 0) {
                animFrame = requestAnimationFrame(animateFW);
            } else {
                ctx.clearRect(0, 0, width, height);
                cancelAnimationFrame(animFrame);
            }
        }

        animateFW();
    };
})();
