// hero-vortex.js
(() => {
  const canvas = document.getElementById('hero-vortex');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) {
    canvas.classList.add('is-static'); // fallback statique pour accessibilité
    return;
  }

  const ctx = canvas.getContext('2d');
  const palette = ['#0b1b3f', '#5a8dff', '#efc634'];
  const pointer = { x: 0.5, y: 0.5 };
  const particles = [];
  const baseCount = window.matchMedia('(max-width: 768px)').matches ? 60 : 120;

  let width = 0;
  let height = 0;
  let dpr = 1;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const createParticle = () => ({
    angle: Math.random() * Math.PI * 2,
    radius: (Math.random() ** 1.8) * Math.min(width, height) * 0.45,
    speed: 0.0015 + Math.random() * 0.0025,
    size: 1 + Math.random() * 2,
    color: palette[Math.floor(Math.random() * palette.length)],
  });

  const populate = () => {
    particles.length = 0;
    for (let i = 0; i < baseCount; i += 1) {
      particles.push(createParticle());
    }
  };

  const render = () => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#050a1f';
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'lighter';
    const time = performance.now() * 0.001;

    particles.forEach((particle) => {
      particle.angle += particle.speed;
      const wobble = Math.sin(time + particle.angle) * 4;
      const x = width * pointer.x + Math.cos(particle.angle) * (particle.radius + wobble);
      const y = height * pointer.y + Math.sin(particle.angle) * (particle.radius + wobble);

      const gradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 12);
      gradient.addColorStop(0, particle.color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, particle.size * 12, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  };

  const handlePointer = (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
  };

  resize();
  populate();
  render();

  window.addEventListener('resize', () => {
    resize();
    populate();
  });
  canvas.addEventListener('pointermove', handlePointer);
  canvas.addEventListener('pointerleave', () => {
    pointer.x = 0.5;
    pointer.y = 0.5;
  });
})();
