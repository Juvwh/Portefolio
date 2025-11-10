let modalData = {};

export function loadFromDom(elementId) {
  const sourceElement = document.getElementById(elementId);

  if (!sourceElement) {
    console.warn(`Modal data store element #${elementId} not found. Modals relying on it may not work.`);
    modalData = {};
    return modalData;
  }

  try {
    const parsed = JSON.parse(sourceElement.textContent || '{}');
    if (typeof parsed === 'object' && parsed !== null) {
      modalData = parsed;
    } else {
      console.warn(`Modal data in #${elementId} was not an object. Using empty data set.`);
      modalData = {};
    }
  } catch (error) {
    console.error(`Error parsing modal data from #${elementId}:`, error);
    modalData = {};
  }

  return modalData;
}

export function getModalData(modalId) {
  if (!modalId) {
    return null;
  }
  return modalData?.[modalId] ?? null;
}

export function getAllModalData() {
  return modalData;
}
