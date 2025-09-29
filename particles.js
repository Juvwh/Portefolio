document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        console.error('Particle canvas not found');
        return;
    }
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 100;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector('.hero-section').offsetHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = document.querySelector('.hero-section').offsetHeight;
        init();
    });

    const mouse = {
        x: null,
        y: null,
        radius: 150
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 30) + 1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Check mouse collision
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Return to original position
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }

            this.draw();
        }
    }

    function init() {
        particles = [];
        const heroSection = document.querySelector('.hero-section');
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const particleColor = theme === 'light' ? 'rgba(0, 42, 179, 0.5)' : 'rgba(239, 198, 52, 0.5)';

        for (let i = 0; i < particleCount; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .2) - .1;
            let directionY = (Math.random() * .2) - .1;

            particles.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
    }

    init();
    animate();

    // Re-initialize particles on theme change
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // We need a small delay for the theme class to be updated on the body
            setTimeout(init, 50);
        });
    }
});