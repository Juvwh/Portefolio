(function initModalDataRepository(global) {
  let modalData = {};

  function loadFromDom(elementId) {
    const sourceElement = document.getElementById(elementId);

    if (!sourceElement) {
      modalData = {};
      return modalData;
    }

    try {
      const parsed = JSON.parse(sourceElement.textContent || '{}');
      if (typeof parsed === 'object' && parsed !== null) {
        modalData = parsed;
      } else {
        modalData = {};
      }
    } catch (error) {
      modalData = {};
    }

    return modalData;
  }

  function getModalData(modalId) {
    if (!modalId) {
      return null;
    }
    return (modalData && modalData[modalId]) ?? null;
  }

  function getAllModalData() {
    return modalData;
  }

  global.modalDataRepository = {
    loadFromDom,
    getModalData,
    getAllModalData,
  };
})(typeof window !== 'undefined' ? window : this);
