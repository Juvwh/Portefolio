import { ModalManager } from './scripts/modals/modalManager.js';
import * as modalDataRepository from './scripts/modals/modalDataRepository.js';
import { LightboxController } from './scripts/modals/lightboxController.js';
import { getTranslationForKey } from './language-switcher.js';

modalDataRepository.loadFromDom('modalDataStore');

const lightboxController = new LightboxController();

const modalManager = new ModalManager({
  dataRepository: modalDataRepository,
  lightboxController,
  translationProvider: getTranslationForKey
});

modalManager.initialize();
