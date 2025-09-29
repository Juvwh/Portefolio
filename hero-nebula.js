"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) {
    canvas.remove();
    return;
  }

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  const blobs = Array.from({ length: 9 }, () => ({
    offset: Math.random() * Math.PI * 2,
    radius: 0.22 + Math.random() * 0.28,
    speed: 0.6 + Math.random() * 0.8,
  }));

  const setCanvasSize = () => {
    const parent = canvas.parentElement;
    if (!parent) {
      return;
    }

    const rect = parent.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;

    width = rect.width;
    height = rect.height;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const draw = (timestamp = 0) => {
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    blobs.forEach((blob, index) => {
      const angle = timestamp * 0.0003 * blob.speed + blob.offset;
      const x = width * (0.5 + Math.cos(angle) * blob.radius);
      const y = height * (0.5 + Math.sin(angle * 0.85) * blob.radius);
      const maxDimension = Math.max(width, height);
      const glowRadius = maxDimension * (0.3 + Math.sin(angle * 0.9) * 0.12);

      const gradient = ctx.createRadialGradient(
        x,
        y,
        glowRadius * 0.1,
        x,
        y,
        glowRadius
      );
      gradient.addColorStop(0, `hsla(${210 + index * 14}, 100%, 65%, 0.55)`);
      gradient.addColorStop(0.55, `hsla(${260 + index * 10}, 95%, 50%, 0.26)`);
      gradient.addColorStop(1, "hsla(220, 80%, 10%, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(draw);
  };

  setCanvasSize();
  let resizeRaf = 0;
  window.addEventListener(
    "resize",
    () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(setCanvasSize);
    },
    { passive: true }
  );

  requestAnimationFrame(draw);
});
