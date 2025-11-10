(function initModalBootstrap(global) {
  const translationService = global.translationService;
  const modalDataRepository = global.modalDataRepository;
  const LightboxController = global.LightboxController;
  const ModalManager = global.ModalManager;

  if (!translationService || !modalDataRepository || !LightboxController || !ModalManager) {
    console.error('Modal system dependencies are not available.');
    return;
  }

  const { translate } = translationService;

  function bootstrapModalSystem() {
    modalDataRepository.loadFromDom('modalDataStore');

    const lightboxController = new LightboxController();

    const modalManager = new ModalManager({
      dataRepository: modalDataRepository,
      lightboxController,
      translationProvider: translate
    });

    modalManager.initialize();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapModalSystem, { once: true });
  } else {
    bootstrapModalSystem();
  }
  global.bootstrapModalSystem = bootstrapModalSystem;
})(typeof window !== 'undefined' ? window : this);
