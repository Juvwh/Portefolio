const initHeroOrbit = () => {
  const heroSection = document.querySelector('.hero-section');
  const canvas = document.getElementById('hero-orbit');

  if (!heroSection || !canvas) {
    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isMotionDisabled = prefersReducedMotion.matches;
  if (isMotionDisabled) {
    heroSection.classList.add('is-reduced-motion');
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const colorConfig = {
    core: '143, 107, 255',
    trail: '90, 141, 255',
    highlight: '239, 198, 52',
  };

  const readColorVariables = () => {
    const styles = getComputedStyle(document.body);
    const getValue = (variable, fallback) => {
      const value = styles.getPropertyValue(variable);
      return value ? value.trim() : fallback;
    };

    colorConfig.core = getValue('--hero-particle-core', colorConfig.core);
    colorConfig.trail = getValue('--hero-particle-trail', colorConfig.trail);
    colorConfig.highlight = getValue(
      '--hero-pointer-highlight',
      getValue('--hero-particle-highlight', colorConfig.highlight),
    );
  };

  const rgba = (color, alpha) => `rgba(${color}, ${alpha})`;

  const pointer = {
    x: 0,
    y: 0,
    active: false,
    lastMove: 0,
    fade: 0,
  };

  let particles = [];
  let animationFrame;
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 1.75);

  class Particle {
    constructor() {
      this.size = Math.random() * 1.4 + 0.6;
      this.angle = Math.random() * Math.PI * 2;
      this.angleVelocity = 0.0025 + Math.random() * 0.0035;
      this.velocityScale = 0.15 + Math.random() * 0.25;
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      const dir = Math.random() * Math.PI * 2;
      const speedFactor = initial ? 1 : 0.4;
      this.vx = Math.cos(dir) * this.velocityScale * speedFactor;
      this.vy = Math.sin(dir) * this.velocityScale * speedFactor;
    }

    update() {
      this.angle += this.angleVelocity;
      this.vx += Math.cos(this.angle) * 0.0025;
      this.vy += Math.sin(this.angle) * 0.0025;

      this.x += this.vx;
      this.y += this.vy;

      this.vx *= 0.985;
      this.vy *= 0.985;

      const margin = 40;
      if (this.x < -margin || this.x > width + margin || this.y < -margin || this.y > height + margin) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = rgba(colorConfig.core, 0.82);
      ctx.shadowColor = rgba(colorConfig.core, 0.35);
      ctx.shadowBlur = 12;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const resizeCanvas = () => {
    width = heroSection.offsetWidth;
    height = heroSection.offsetHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const determineTargetParticleCount = () => {
    const baseCount = window.innerWidth < 768 ? 45 : 90;
    const areaFactor = Math.sqrt((width * height) / (1200 * 700));
    const scaled = Math.round(baseCount * Math.min(1.6, Math.max(0.65, areaFactor)));
    return Math.max(35, Math.min(140, scaled));
  };

  const syncParticleCount = () => {
    const target = determineTargetParticleCount();
    if (particles.length > target) {
      particles.length = target;
      return;
    }

    while (particles.length < target) {
      particles.push(new Particle());
    }
  };

  const drawConnections = () => {
    const maxDistance = Math.min(180, Math.max(110, Math.max(width, height) * 0.18));
    const maxDistanceSq = maxDistance * maxDistance;

    for (let i = 0; i < particles.length; i += 1) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j += 1) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq <= maxDistanceSq) {
          const intensity = 1 - Math.sqrt(distanceSq) / maxDistance;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = rgba(colorConfig.trail, 0.22 * intensity);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  };

  const applyPointerInfluence = () => {
    const influenceRadius = Math.max(width, height) * 0.22;
    const influenceRadiusSq = influenceRadius * influenceRadius;
    const now = performance.now();
    const elapsed = now - pointer.lastMove;

    pointer.fade = Math.max(0, 1 - elapsed / 1800);
    if (pointer.fade <= 0) {
      pointer.active = false;
      return;
    }

    for (const particle of particles) {
      const dx = particle.x - pointer.x;
      const dy = particle.y - pointer.y;
      const distanceSq = dx * dx + dy * dy;

      if (distanceSq <= influenceRadiusSq) {
        const distance = Math.sqrt(distanceSq) || 0.001;
        const force = (1 - distance / influenceRadius) * 0.04 * pointer.fade;
        particle.vx += -(dx / distance) * force;
        particle.vy += -(dy / distance) * force;

        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.strokeStyle = rgba(colorConfig.highlight, 0.18 * pointer.fade * (1 - distance / influenceRadius));
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }
    }
  };

  const drawPointer = () => {
    if (!pointer.active) {
      return;
    }

    ctx.save();
    const baseRadius = 6 + Math.max(width, height) * 0.01;
    ctx.beginPath();
    ctx.fillStyle = rgba(colorConfig.highlight, 0.28 + 0.4 * pointer.fade);
    ctx.shadowColor = rgba(colorConfig.highlight, 0.4 * pointer.fade);
    ctx.shadowBlur = 18;
    ctx.arc(pointer.x, pointer.y, baseRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const render = () => {
    if (isMotionDisabled) {
      return;
    }

    animationFrame = requestAnimationFrame(render);
    ctx.clearRect(0, 0, width, height);

    particles.forEach((particle) => particle.update());

    if (pointer.active) {
      applyPointerInfluence();
    }

    drawConnections();
    particles.forEach((particle) => particle.draw());
    drawPointer();
  };

  const handlePointerMove = (event) => {
    const { left, top } = heroSection.getBoundingClientRect();
    const clientX = event.clientX ?? (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
    const clientY = event.clientY ?? (event.touches && event.touches[0] ? event.touches[0].clientY : 0);
    pointer.x = clientX - left;
    pointer.y = clientY - top;
    pointer.x = Math.max(0, Math.min(width, pointer.x));
    pointer.y = Math.max(0, Math.min(height, pointer.y));
    pointer.active = true;
    pointer.lastMove = performance.now();
  };

  const stopAnimation = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = undefined;
    }
  };

  const startAnimation = () => {
    if (isMotionDisabled) {
      stopAnimation();
      return;
    }

    stopAnimation();
    render();
  };

  const handleResize = () => {
    resizeCanvas();
    syncParticleCount();
  };

  const handleVisibilityChange = () => {
    if (document.hidden || isMotionDisabled) {
      stopAnimation();
    } else {
      startAnimation();
    }
  };

  readColorVariables();
  resizeCanvas();
  syncParticleCount();
  startAnimation();

  const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(handleResize) : null;
  if (resizeObserver) {
    resizeObserver.observe(heroSection);
  } else {
    window.addEventListener('resize', handleResize);
  }

  window.addEventListener('resize', () => {
    readColorVariables();
  });

  document.addEventListener('visibilitychange', handleVisibilityChange);
  heroSection.addEventListener('pointermove', handlePointerMove, { passive: true });
  heroSection.addEventListener('pointerdown', handlePointerMove, { passive: true });
  heroSection.addEventListener('pointerup', () => {
    pointer.active = false;
  });
  heroSection.addEventListener('pointerleave', () => {
    pointer.active = false;
  });

  const themeObserver = new MutationObserver(() => {
    readColorVariables();
  });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  const motionPreferenceHandler = (event) => {
    isMotionDisabled = event.matches;

    if (isMotionDisabled) {
      heroSection.classList.add('is-reduced-motion');
      stopAnimation();
      ctx.clearRect(0, 0, width, height);
    } else {
      heroSection.classList.remove('is-reduced-motion');
      readColorVariables();
      resizeCanvas();
      syncParticleCount();
      startAnimation();
    }
  };

  if (typeof prefersReducedMotion.addEventListener === 'function') {
    prefersReducedMotion.addEventListener('change', motionPreferenceHandler);
  } else if (typeof prefersReducedMotion.addListener === 'function') {
    prefersReducedMotion.addListener(motionPreferenceHandler);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroOrbit);
} else {
  initHeroOrbit();
}
