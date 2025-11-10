import { ModalManager } from './scripts/modals/modalManager.js';
import * as modalDataRepository from './scripts/modals/modalDataRepository.js';
import { LightboxController } from './scripts/modals/lightboxController.js';
import { translate } from './scripts/i18n/translationService.js';

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
