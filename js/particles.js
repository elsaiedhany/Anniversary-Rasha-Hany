/* ==========================================================================
   PARTICLES & FLOATING HEARTS CANVAS ENGINE
   ========================================================================== */

(function () {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    let hearts = [];

    // Configuration
    const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 15));
    const HEART_COUNT = Math.min(25, Math.floor(window.innerWidth / 40));

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Particle Class (Golden Dust)
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2.5 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4 - 0.2; // Slow upward drift
            this.alpha = Math.random() * 0.6 + 0.2;
            this.maxAlpha = this.alpha;
            this.glow = Math.random() > 0.6;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Soft pulsing alpha
            this.alpha += (Math.random() - 0.5) * 0.01;
            if (this.alpha < 0.1) this.alpha = 0.1;
            if (this.alpha > this.maxAlpha) this.alpha = this.maxAlpha;

            // Wrap edges
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
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#FFD700';
            }
            ctx.fill();
            ctx.restore();
        }
    }

    // Floating Heart Class
    class FloatingHeart {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 20;
            this.size = Math.random() * 14 + 10;
            this.speed = Math.random() * 0.8 + 0.3;
            this.alpha = Math.random() * 0.4 + 0.15;
            this.rotation = (Math.random() - 0.5) * 0.4;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.03 + 0.01;
        }

        update() {
            this.y -= this.speed;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.5;

            if (this.y < -30) {
                this.reset(false);
            }
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
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
    for (let i = 0; i < HEART_COUNT; i++) {
        hearts.push(new FloatingHeart());
    }

    // Render loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        hearts.forEach(h => {
            h.update();
            h.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
})();
