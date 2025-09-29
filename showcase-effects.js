(() => {
  const tiltElements = Array.from(document.querySelectorAll('[data-tilt]'));

  if (!tiltElements.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  if (prefersReducedMotion || isCoarsePointer) {
    tiltElements.forEach((element) => {
      element.style.transform = '';
    });
    return;
  }

  const MAX_TILT = 12;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  tiltElements.forEach((element) => {
    element.style.transform = 'rotateX(0deg) rotateY(0deg)';

    const state = {
      currentX: 0,
      currentY: 0,
      targetX: 0,
      targetY: 0,
      rafId: null
    };

    const applyTilt = () => {
      const damping = 0.18;
      state.currentX += (state.targetX - state.currentX) * damping;
      state.currentY += (state.targetY - state.currentY) * damping;

      element.style.transform = `rotateX(${state.currentX.toFixed(3)}deg) rotateY(${state.currentY.toFixed(3)}deg)`;

      if (Math.abs(state.currentX - state.targetX) < 0.01 && Math.abs(state.currentY - state.targetY) < 0.01) {
        state.currentX = state.targetX;
        state.currentY = state.targetY;
        state.rafId = null;
        return;
      }

      state.rafId = requestAnimationFrame(applyTilt);
    };

    const requestUpdate = () => {
      if (state.rafId === null) {
        state.rafId = requestAnimationFrame(applyTilt);
      }
    };

    const resetTilt = () => {
      state.targetX = 0;
      state.targetY = 0;
      requestUpdate();
    };

    const handlePointerMove = (event) => {
      if (event.pointerType === 'touch') {
        resetTilt();
        return;
      }

      const rect = element.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      const tiltY = clamp(((offsetX / rect.width) - 0.5) * (MAX_TILT * 2), -MAX_TILT, MAX_TILT);
      const tiltX = clamp(((offsetY / rect.height) - 0.5) * -(MAX_TILT * 2), -MAX_TILT, MAX_TILT);

      state.targetX = tiltX;
      state.targetY = tiltY;
      requestUpdate();
    };

    element.addEventListener('pointermove', handlePointerMove);
    element.addEventListener('pointerleave', resetTilt);
    element.addEventListener('pointerup', resetTilt);
    element.addEventListener('pointercancel', resetTilt);
  });
})();
