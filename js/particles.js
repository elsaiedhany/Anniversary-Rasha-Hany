/* ==========================================================================
   FLOATING HEARTS ENGINE & SCREEN HEARTS EXPLOSION
   ========================================================================== */

(function () {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let floatingHearts = [];
    let explosionHearts = [];

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Continuous Floating Hearts Class
    class FloatingHeart {
        constructor(initial = false) {
            this.reset(initial);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + Math.random() * 40;
            this.size = Math.random() * 16 + 10;
            this.speed = Math.random() * 0.9 + 0.35;
            this.alpha = Math.random() * 0.45 + 0.2;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.03 + 0.01;
            this.color = Math.random() > 0.4 ? 'rgba(212, 175, 55,' : 'rgba(255, 94, 126,';
        }

        update() {
            this.y -= this.speed;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.6;
            if (this.y < -30) this.reset(false);
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(this.size / 20, this.size / 20);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-10, -10, -20, 5, 0, 18);
            ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
            ctx.fillStyle = `${this.color} ${this.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
            ctx.fill();
            ctx.restore();
        }
    }

    // Explosion Heart for Surprise Action
    class BurstHeart {
        constructor() {
            this.x = Math.random() * width;
            this.y = height + 20;
            this.size = Math.random() * 24 + 14;
            this.speed = Math.random() * 2.5 + 1.2;
            this.alpha = 1;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.05 + 0.02;
            this.color = Math.random() > 0.5 ? 'rgba(255, 94, 126,' : 'rgba(255, 215, 0,';
        }

        update() {
            this.y -= this.speed;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 1.2;
            this.alpha -= 0.006;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(this.size / 20, this.size / 20);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-10, -10, -20, 5, 0, 18);
            ctx.bezierCurveTo(20, 5, 10, -10, 0, 0);
            ctx.fillStyle = `${this.color} ${Math.max(0, this.alpha)})`;
            ctx.shadowBlur = 12;
            ctx.shadowColor = '#FF5E7E';
            ctx.fill();
            ctx.restore();
        }
    }

    // Initialize 25 ambient hearts
    for (let i = 0; i < 25; i++) {
        floatingHearts.push(new FloatingHeart(true));
    }

    // Global trigger to fill the screen with hearts
    window.triggerScreenHearts = function () {
        for (let i = 0; i < 50; i++) {
            explosionHearts.push(new BurstHeart());
        }
    };

    function animate() {
        ctx.clearRect(0, 0, width, height);

        floatingHearts.forEach(h => {
            h.update();
            h.draw();
        });

        explosionHearts.forEach((h, idx) => {
            h.update();
            h.draw();
            if (h.alpha <= 0 || h.y < -40) {
                explosionHearts.splice(idx, 1);
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
})();
