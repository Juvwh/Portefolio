"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero-section--parallax");
  if (!hero) {
    return;
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) {
    return;
  }

  const layers = Array.from(hero.querySelectorAll("[data-depth]"));
  if (layers.length === 0) {
    return;
  }

  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let rafId = null;

  const applyTransform = (layer, x, y) => {
    const depth = parseFloat(layer.dataset.depth || "0");
    const moveX = x * depth;
    const moveY = y * depth;
    layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotateX(${-moveY * 0.04}deg) rotateY(${moveX * 0.04}deg)`;
  };

  const updateTransforms = () => {
    current.x += (target.x - current.x) * 0.08;
    current.y += (target.y - current.y) * 0.08;

    const deltaX = target.x - current.x;
    const deltaY = target.y - current.y;

    layers.forEach((layer) => {
      applyTransform(layer, current.x, current.y);
    });

    if (Math.abs(deltaX) > 0.01 || Math.abs(deltaY) > 0.01) {
      rafId = window.requestAnimationFrame(updateTransforms);
    } else {
      current.x = target.x;
      current.y = target.y;
      layers.forEach((layer) => {
        applyTransform(layer, current.x, current.y);
      });
      rafId = null;
    }
  };

  const startAnimation = () => {
    if (rafId === null) {
      rafId = window.requestAnimationFrame(updateTransforms);
    }
  };

  const stopAnimation = () => {
    if (rafId !== null) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  const updateFromPointer = (event) => {
    const rect = hero.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
    target.x = offsetX * 60;
    target.y = offsetY * 35;
    startAnimation();
  };

  const resetTarget = () => {
    target.x = 0;
    target.y = 0;
  };

  const handlePointerLeave = () => {
    resetTarget();
    startAnimation();
  };

  const handleOrientation = (event) => {
    if (typeof event.beta !== "number" || typeof event.gamma !== "number") {
      return;
    }

    const gamma = Math.max(-30, Math.min(30, event.gamma || 0));
    const beta = Math.max(-20, Math.min(20, (event.beta || 0) - 45));
    target.x = gamma * 1.2;
    target.y = beta * 0.8;
    startAnimation();
  };

  hero.addEventListener("pointermove", updateFromPointer);
  hero.addEventListener("pointerleave", handlePointerLeave);
  hero.addEventListener("pointerdown", updateFromPointer);
  hero.addEventListener("pointerup", handlePointerLeave);
  hero.addEventListener("pointercancel", handlePointerLeave);

  window.addEventListener("deviceorientation", handleOrientation, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
    } else if (!reduceMotion.matches) {
      startAnimation();
    }
  });

  const handleMotionPreferenceChange = (event) => {
    if (event.matches) {
      stopAnimation();
      layers.forEach((layer) => {
        layer.style.transform = "none";
      });
    } else {
      startAnimation();
    }
  };

  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", handleMotionPreferenceChange);
  } else if (typeof reduceMotion.addListener === "function") {
    reduceMotion.addListener(handleMotionPreferenceChange);
  }
});
