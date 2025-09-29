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
    // Ensure the hero-section has a determined height when we measure it
    requestAnimationFrame(() => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            canvas.height = heroSection.offsetHeight;
        } else {
            canvas.height = window.innerHeight; // Fallback
        }
        init();
        animate();
    });


    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            canvas.height = heroSection.offsetHeight;
        } else {
            canvas.height = window.innerHeight; // Fallback
        }
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
            this.density = (Math.random() * 40) + 5;
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
                 // Wall collision
                if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                    this.directionY = -this.directionY;
                }
                // Move particle
                this.x += this.directionX;
                this.y += this.directionY;
            }

            this.draw();
        }
    }

    function init() {
        particles = [];
        const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const particleColor = theme === 'light' ? 'rgba(0, 42, 179, 0.5)' : 'rgba(255, 255, 255, 0.8)';

        for (let i = 0; i < particleCount; i++) {
            let size = (Math.random() * 2.5) + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 0.4) - 0.2;
            let directionY = (Math.random() * 0.4) - 0.2;

            particles.push(new Particle(x, y, directionX, directionY, size, particleColor));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                             + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));

                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    ctx.strokeStyle = particles[a].color.replace(/[\d\.]+\)$/g, `${opacityValue})`);
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        connect();
    }

    // Re-initialize particles on theme change
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // We need a small delay for the theme class to be updated on the body
            setTimeout(init, 50);
        });
    }
});