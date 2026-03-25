document.addEventListener('DOMContentLoaded', () => {
    const cvModalOverlay = document.getElementById('cv-modal');
    const cvModalCloseBtn = document.getElementById('cv-modal-close-btn');
    const navCvTrigger = document.getElementById('nav-cv-trigger');
    const footerCvTrigger = document.getElementById('footer-cv-trigger');
    const cvIframe = document.getElementById('cv-iframe');
    const cvDownloadBtn = document.getElementById('cv-download-btn');

    const cvLangEnBtn = document.getElementById('cv-lang-en');
    const cvLangFrBtn = document.getElementById('cv-lang-fr');
    const cvThemeToggleBtn = document.getElementById('cv-theme-toggle');

    // Mappings for file names
    const CV_FILES = {
        'GameDev': {
            'en': {
                'dark': 'JustinVanwichelen_ResumeEN_Dark.pdf',
                'light': 'JustinVanwichelen_ResumeEN_Light.pdf'
            },
            'fr': {
                'dark': 'JustinVanwichelen_ResumeFR_Dark.pdf',
                'light': 'JustinVanwichelen_ResumeFR_Light.pdf'
            }
        },
        'IT': {
            'en': {
                'dark': 'JustinVanwichelen_IT_ResumeEN_Dark.pdf',
                'light': 'JustinVanwichelen_IT_ResumeEN_Light.pdf'
            },
            'fr': {
                'dark': 'JustinVanwichelen_IT_ResumeFR_Dark.pdf',
                'light': 'JustinVanwichelen_IT_ResumeFR_Light.pdf'
            }
        }
    };

    // State for the modal
    let currentModalLang = 'en';
    let currentModalTheme = 'dark';

    // 1. Check for direct download URL hashes
    const checkDirectDownload = () => {
        const hash = window.location.hash;
        if (!hash) return false;

        const cleanHash = hash.substring(1); // Remove '#'

        let pathParts = null;
        if (cleanHash === 'IT_Light_FR') pathParts = ['IT', 'fr', 'light'];
        else if (cleanHash === 'IT_Light_EN') pathParts = ['IT', 'en', 'light'];
        else if (cleanHash === 'IT_Dark_FR') pathParts = ['IT', 'fr', 'dark'];
        else if (cleanHash === 'IT_Dark_EN') pathParts = ['IT', 'en', 'dark'];
        else if (cleanHash === 'GameDev_Light_FR') pathParts = ['GameDev', 'fr', 'light'];
        else if (cleanHash === 'GameDev_Light_EN') pathParts = ['GameDev', 'en', 'light'];
        else if (cleanHash === 'GameDev_Dark_FR') pathParts = ['GameDev', 'fr', 'dark'];
        else if (cleanHash === 'GameDev_Dark_EN') pathParts = ['GameDev', 'en', 'dark'];

        if (pathParts) {
            const [track, lang, theme] = pathParts;
            const fileName = CV_FILES[track][lang][theme];

            // Create a hidden link and click it to trigger download
            const link = document.createElement('a');
            link.href = `./index_files/${fileName}`;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the hash without scrolling and trailing space
            history.replaceState(null, document.title, window.location.pathname + window.location.search);
            return true;
        }
        return false;
    };

    // Execute immediately on load
    checkDirectDownload();


    // 2. Modal Logic

    // Update the PDF and download link based on current modal state
    const updateCVDisplay = () => {
        const fileName = CV_FILES['GameDev'][currentModalLang][currentModalTheme];
        const filePath = `./index_files/${fileName}`;

        // Only update if it changed to avoid reloading iframe unnecessarily
        if (!cvIframe.src.endsWith(fileName)) {
            cvIframe.src = filePath;
        }

        cvDownloadBtn.href = filePath;
        cvDownloadBtn.download = fileName;

        // Update active states on language buttons
        if (currentModalLang === 'en') {
            cvLangEnBtn.classList.add('active-lang');
            cvLangFrBtn.classList.remove('active-lang');
        } else {
            cvLangFrBtn.classList.add('active-lang');
            cvLangEnBtn.classList.remove('active-lang');
        }

        // Update theme toggle text
        if (currentModalTheme === 'dark') {
            cvThemeToggleBtn.setAttribute('data-translate-key', 'cvSwitchToLightMode');
            // Force translation update if function exists globally (assuming translationService structure)
            if (window.updateSpecificTranslation) {
                window.updateSpecificTranslation(cvThemeToggleBtn, 'cvSwitchToLightMode');
            } else if (window.translationService) {
                 cvThemeToggleBtn.textContent = window.translationService.translate('cvSwitchToLightMode');
            } else {
                cvThemeToggleBtn.textContent = 'Switch to Light Mode';
            }
        } else {
            cvThemeToggleBtn.setAttribute('data-translate-key', 'cvSwitchToDarkMode');
            if (window.updateSpecificTranslation) {
                window.updateSpecificTranslation(cvThemeToggleBtn, 'cvSwitchToDarkMode');
            } else if (window.translationService) {
                 cvThemeToggleBtn.textContent = window.translationService.translate('cvSwitchToDarkMode');
            } else {
                cvThemeToggleBtn.textContent = 'Switch to Dark Mode';
            }
        }
    };

    const openCVModal = (e) => {
        if (e) e.preventDefault();

        // Sync initial state with the website's global state
        // Check html lang attribute or global language switcher state
        const htmlLang = document.documentElement.lang;
        currentModalLang = htmlLang === 'fr' ? 'fr' : 'en';

        // Check website theme (assuming light-theme class on body)
        currentModalTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';

        updateCVDisplay();

        cvModalOverlay.classList.add('active');
        document.body.classList.add('modal-open');
    };

    const closeCVModal = () => {
        cvModalOverlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    };

    // Event Listeners for Opening/Closing Modal
    if (navCvTrigger) navCvTrigger.addEventListener('click', openCVModal);
    if (footerCvTrigger) footerCvTrigger.addEventListener('click', openCVModal);

    if (cvModalCloseBtn) cvModalCloseBtn.addEventListener('click', closeCVModal);

    // Close modal when clicking outside
    cvModalOverlay.addEventListener('click', (e) => {
        if (e.target === cvModalOverlay) {
            closeCVModal();
        }
    });

    // Event Listeners for Modal Internal Controls
    if (cvLangEnBtn) {
        cvLangEnBtn.addEventListener('click', () => {
            currentModalLang = 'en';
            updateCVDisplay();
        });
    }

    if (cvLangFrBtn) {
        cvLangFrBtn.addEventListener('click', () => {
            currentModalLang = 'fr';
            updateCVDisplay();
        });
    }

    if (cvThemeToggleBtn) {
        cvThemeToggleBtn.addEventListener('click', () => {
            currentModalTheme = currentModalTheme === 'dark' ? 'light' : 'dark';
            updateCVDisplay();
        });
    }
});
