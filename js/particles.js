/* ==========================================================================
   PARTICLES & FLOATING HEARTS CANVAS ENGINE (DEBUGGED & RESPONSIVE)
   ========================================================================== */

(function () {
    'use strict';

    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth || 1200);
        let height = (canvas.height = window.innerHeight || 800);

        let particles = [];
        let hearts = [];

        function resize() {
            width = canvas.width = window.innerWidth || 1200;
            height = canvas.height = window.innerHeight || 800;
        }

        window.addEventListener('resize', resize);

        const PARTICLE_COUNT = Math.min(70, Math.floor(width / 18));
        const HEART_COUNT = Math.min(20, Math.floor(width / 45));

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2.2 + 0.6;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35 - 0.15;
                this.alpha = Math.random() * 0.5 + 0.2;
                this.maxAlpha = this.alpha;
                this.glow = Math.random() > 0.5;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }
            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
                if (this.glow) {
                    ctx.shadowBlur = 6;
                    ctx.shadowColor = '#FFD700';
                }
                ctx.fill();
                ctx.restore();
            }
        }

        class FloatingHeart {
            constructor() { this.reset(true); }
            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : height + 25;
                this.size = Math.random() * 12 + 8;
                this.speed = Math.random() * 0.7 + 0.25;
                this.alpha = Math.random() * 0.35 + 0.15;
                this.rotation = (Math.random() - 0.5) * 0.3;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            }
            update() {
                this.y -= this.speed;
                this.wobble += this.wobbleSpeed;
                this.x += Math.sin(this.wobble) * 0.4;
                if (this.y < -30) this.reset(false);
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.scale(this.size / 20, this.size / 20);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-10, -10, -20, 5, 0, 18);
                ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
                ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
                ctx.shadowBlur = 5;
                ctx.shadowColor = 'rgba(212, 175, 55, 0.3)';
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
        for (let i = 0; i < HEART_COUNT; i++) hearts.push(new FloatingHeart());

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => { p.update(); p.draw(); });
            hearts.forEach(h => { h.update(); h.draw(); });
            requestAnimationFrame(animate);
        }

        animate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }
})();
