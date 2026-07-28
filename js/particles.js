/* ==========================================================================
   AMBIENT PARTICLES & FLOATING HEARTS BURST
   ========================================================================== */

(function () {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    let extraHearts = [];

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3 - 0.1;
            this.alpha = Math.random() * 0.4 + 0.2;
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
            ctx.fill();
            ctx.restore();
        }
    }

    class FloatingHeart {
        constructor() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 50;
            this.size = Math.random() * 18 + 12;
            this.speed = Math.random() * 1.5 + 0.8;
            this.alpha = 1;
            this.wobble = Math.random() * Math.PI * 2;
        }
        update() {
            this.y -= this.speed;
            this.wobble += 0.03;
            this.x += Math.sin(this.wobble) * 0.8;
            this.alpha -= 0.005;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(this.size / 20, this.size / 20);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-10, -10, -20, 5, 0, 18);
            ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
            ctx.fillStyle = `rgba(255, 94, 94, ${Math.max(0, this.alpha)})`;
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#FF5E5E';
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < 40; i++) particles.push(new Particle());

    window.triggerFloatingHearts = function () {
        for (let i = 0; i < 35; i++) {
            extraHearts.push(new FloatingHeart());
        }
    };

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });

        extraHearts.forEach((h, idx) => {
            h.update();
            h.draw();
            if (h.alpha <= 0 || h.y < -40) {
                extraHearts.splice(idx, 1);
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
})();
