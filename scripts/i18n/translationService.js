(function initTranslationService(global) {
  // Translation dictionary embedded directly to avoid module loading issues on static hosting.
  const translations = {
    en: {
    // Meta Titles and Descriptions
    docTitle: "Justin Vanwichelen's Portfolio - Developer",
    canonicalUrl: "https://justinvanwichelen.be/",
    ogLocale: "en_US",
    metaDescription: "Explore the portfolio of Justin Vanwichelen, showcasing projects in game development, AI, and technical art.",
    metaKeywords: "Justin Vanwichelen, Portfolio, Technical Artist, Game Developer, AI, Computer Science, Unreal Engine, Unity, HEAJ, UCLouvain, Game Development, Interactive Systems, Gameplay Programming, Technical Art, AI in Games, Game Design, Game Projects, IT Projects",
    ogTitle: "Justin Vanwichelen's Portfolio - Developer",
    ogDescription: "Explore the portfolio of Justin Vanwichelen, showcasing projects in game development, AI, and technical art.",
    twitterTitle: "Justin Vanwichelen's Portfolio - Developer",
    twitterDescription: "Explore the portfolio of Justin Vanwichelen, showcasing projects in game development, AI, and technical art.",

    // Navbar
    navHome: "Home",
    navGameProjects: "Game projects",
    navItProjects: "IT projects",
    navMyJourney: "My Journey",
    navCv: "CV",
    switchToDarkMode: "Switch to Dark Mode",
    switchToLightMode: "Switch to Light Mode",
    themeToggle : "Switch to Light Mode",

    // Hero Section
    heroGreeting: "HI ALL, I'M <strong>JUSTIN 👋</strong>",
    heroRoleChip: "• Game Developer •",
    heroP1: "With a background as a <strong>Technical Artist</strong> and a <strong>Master’s degree in Computer Science</strong> with a specialization in <strong>Artificial Intelligence</strong>, I focus on <strong>gameplay programming</strong> and the development of interactive systems. My strong creative instincts, combined with solid technical expertise, enable me to craft <strong>immersive, dynamic, and intelligent experiences</strong>.",
    heroP2: "I love <strong>blending logic with aesthetics</strong> to bring captivating worlds to life. Comfortable with <strong>Photoshop</strong>, I enjoy creating detailed visual assets and clear prototypes that help communicate ideas and concepts effectively.",
    heroP3: "I’m particularly passionate about integrating <strong>Large Language Models (LLMs)</strong> into games to make interactions more natural, unpredictable, and engaging. <strong>My Master’s thesis</strong> explores how these technologies can enhance narrative depth and interactivity in role-playing games.",

    heroCtaProjects: "Explore my game projects",
    heroCtaItProjects: "See my IT projects",
    heroCtaCv: "Download my CV",
    heroScrollCue: "Scroll to explore my universes",

    // Highlighted Projects Carousel
    carouselHeader: "Highlighted projects",
    // -- Card: The Human Variable (Carousel)
    humanVariableTitleCarousel: "The Human Variable (2025)",
    humanVariableBadgeMadeAlone: "Made alone",
    humanVariableBadge2Weeks: "2 weeks",
    humanVariableDescriptionCarousel: "You're the only human among five androids... Each round, answer a deep question and vote for who seems too human. The twist? The androids are real AIs. And they're trying to find you.",
    humanVariableBtnLearnMore: "Learn More",
    // -- Card: RPG with LLM (Carousel)
    rpgLLMTitleCarousel: "ROLES PLAY GAME WITH LLM (2025)",
    rpgLLMBadgeBy2: "By 2 people",
    rpgLLMBadge7Months: "7 months",
    rpgLLMBadgeAward: "2025 IEEE/ICTEAM Best Master’s Thesis Award",
    rpgLLMDescriptionCarousel: "Immerse yourself in a real-time AI-generated RPG, where each adventure is unique, immersive and shaped by your choices.",
    rpgLLMBtnSeeMore: "I want to see more",
    // -- Card: Loki (Carousel)
    lokiTitleCarousel: "LOKI GAME (2022)",
    lokiBadgeBy8: "By 8 people",
    lokiBadge3Months: "3 months",
    lokiDescriptionCarousel: "Signy have the power to take the form of anyone or any animal. From a strong brute to a stealthy cat, each transformation opens new paths to infiltrate, deceive, and climb the social ladder.",
    lokiBtnCurious: "I'm as curious as a cat",
    // -- Card: Diablo Cyberpunk (Carousel)
    diabloTitleCarousel: "DIABOLO III CYBERPUNK (2021)",
    diabloBadgeMadeAlone: "Made alone",
    diabloBadge3MonthsCarousel: "3 months", // Differentiate from other 3 months if needed
    diabloDescriptionCarousel: "I've recreated a cyberpunk version of Diablo III, complete with homemade gameplay, VFX, animations and HUD. Combat, puzzles and futuristic powers await you.",
    diabloBtnTellMeMore: "Tell me more",
    // -- Card: Kart Color (Carousel)
    kartColorTitleCarousel: "KART COLOR (2025)",
    kartColorBadgeMadeAlone: "Made alone",
    kartColorBadge3Months: "7 days",
    kartColorDescriptionCarousel: "🚗💨 Kart Color is a fast-paced arcade battle where every second counts. Outsmart your rival, paint the arena, grab power-ups, and claim victory in a burst of colors and chaos.",
    kartColorBtnTellMeMore: "Learn more",

    // Custom image + video + text section (Human Variable)
    humanVariableSectionTitle: "Five androids. One impostor. You.",
    humanVariableSectionP: "You're the only human among five androids. The others are driven by real LLMs: GPT, Mistral, LLaMA, and Gemma. Each round, a question is asked. Everyone answers. Then, they vote: who felt too human? Too emotional? Too real? Blend in. Speak like an AI… or be eliminated.<br><br>🧩 This is a <strong>reverse Turing test</strong>: instead of machines pretending to be human, <strong>you must convince the machines that you're one of them</strong>.",
    humanVariableSectionBtn: "I want to see more",

    // Custom image + video + text section (WhoIsLying)
    whoIsLyingSectionTitle: "They know how to lie. Will you be able to doubt them?",
    whoIsLyingSectionP: "Who is Lying is a narrative investigation game where each suspect is embodied by an AI capable of lying, contradicting itself, or revealing its secrets based on your questions. Analyze, interrogate, confront... and discover who is lying.",
    whoIsLyingSectionBtn: "Learn more",

    // Custom image + video + text section (RPG with LLM)
    rpgLLMSectionTitle: "Where every game tells a new story",
    rpgLLMSectionP: "Immerse yourself in a real-time AI-generated RPG, where each adventure is unique, immersive and shaped by your choices. Discover how AI become a true game master.",
    rpgLLMSectionBtn: "Learn more",

    // My Journey Section / Timeline
    // --- Timeline items have dynamic dates, so we'll translate the static parts of descriptions
    timelineJourneyTitle: "My Journey", // Assuming this title might be added or is implicit
    timelineJobSucrerie: "Starts working as a student at La Sucrerie. In contact with customers.",
    timelineInternAppeals: "Intern as a technical artist at Appeals Studio. Working on the development of Outcast 2.",
    timelineGradHeaj: "Graduates as a Technical Artist from the Haute Ecole Albert-Jacquard",
    timelineTutorUcl: "IT tutor for around forty students in the first year of a bachelor's degree in IT (at UCLouvain)",
    timelineGradUcl: "Master's degree graduates in computer science from the Catholic University of Louvain-La-Neuve",
    timelineNext: "Maybe with you ... ?",

    // Tools & Technologies Section
    toolsTechTitle: "Tools & Technologies",

    // IT Projects Section
    itProjectsSectionTitle: "IT Projects",
    // -- IT Card 1
    itConstraintProgrammingTitle: "Constraint programming",
    itConstraintProgrammingYear: "2024",
    itConstraintProgrammingDesc: "Modelling and solving instances of a logistics and transport problem using constraint programming.",
    // -- IT Card 2
    itCompilerTitle: "Compiler",
    itCompilerYear: "2024",
    itCompilerDesc: "Coding a complet compiler that transforms an invented language into Java bytecode, from lexical analysis in the code to translating it into executable instructions.",
    // -- IT Card 3
    itMachineLearningTitle: "Machine learning",
    itMachineLearningYear: "2024",
    itMachineLearningDesc: "We tackled a binary classification task using a real industrial dataset that was diverse and poorly cleaned, spread across multiple CSV files with many variables but few observations. We could use any machine learning techniques we wanted.​",
    // -- IT Card 4
    itCarDamageAppTitle: "Car Damage APP",
    itCarDamageAppYear: "2023",
    itCarDamageAppDesc: "For my Software course, I worded on the Car Damage App (RepairPal) (by NRB)  to enable quick damage detection and repair cost estimates after accidents, aiding users and insurers.",
    // -- IT Card 5
    itSRV6Title: "SRV6 - TRAFFIC ENGINEERING",
    itSRV6Year: "2023",
    itSRV6Desc: "I utilized Containerlab and FRRouting to simulate a 14-node network topology, assessing Traffic Engineering by adding artificial delays to optimize data routing across various paths.",
    // -- IT Card 6
    itTextPreacherTitle: "Text preacher",
    itTextPreacherYear: "2023",
    itTextPreacherDesc: "A text preacher trained on Twitter datas (X now),  created using Oz language (no loops and single assignment).",

    // All Games Section
    allGamesSectionTitle: "All Games",
    // -- Game Card Titles (modals will handle more detail)
    gameHumanVariableTitle: "The Human Variable",
    gameRpgLLMTitle: "RPG with LLM",
    gameLokiTitle: "Loki",
    gameDiabloCyberpunkTitle: "Diablo Cyberpunk",
    gameKartColorTitle: "Kart Color",
    gameStalkAndRuinTitle: "Stalk and Ruin",
    gameOneWayTripTitle: "One way trip",
    gameWhoIsLyingTitle: "Who is Lying ?",

    // Footer
    footerCvDownload: "Download CV",
    footerCvAriaLabel: "Download my CV",
    footerGithubAriaLabel: "Visit my GitHub profile",
    footerLinkedinAriaLabel: "Visit my LinkedIn profile",
    footerYoutubeAriaLabel: "Visit my YouTube channel",
    footerEmailAriaLabel: "Send me an email",
    footerCopyright: "&copy; 2025 Justin Vanwichelen. All rights reserved. --> My website's code is available on GitHub.",

    // Modal Generic
    modalPlayButton: "Play",
    modalCloseButtonAriaLabel: "Close modal", // For the &times;

    modal_rpgLLM_btn_report: "Watch the defence",
    modal_rpgLLM_btn_thesis: "Read Thesis",
    modal_rpgLLM_btn_defence: "View the defence",

    // Modal Data Store Content (prefixing with modal_ to avoid clashes)
    // -- The Human Variable (Modal)
    modal_humanVariable_title: "The Human Variable - A Reverse Turing Test",
    modal_humanVariable_description: "You are the <strong>only human</strong> locked in a room with <strong>four androids</strong>, each powered by a different <strong>language model (LLM)</strong>: GPT, Mistral, LLaMA, and Gemma.<br><br>No one knows why they are here. All you're told is that <strong>a human is hiding among the machines</strong>, and they must be exposed.<br><br>Each round, an open-ended question is asked. One by one, each participant, AI and human alike, answers aloud. Then comes the vote: <strong>everyone chooses who they think the human is</strong>. The one with the most votes is eliminated. For ever.<br><br>Your mission?<br><strong>Answer like a machine</strong>. Think like a machine. And do everything you can to avoid getting voted out.<br><br>🧩 This is not a classic Turing test. It’s a <strong>reverse Turing test</strong>: instead of machines trying to pass as human, <strong>you must pass as an AI</strong>.<br><br>🤖 <strong>Real AIs, unique behaviors</strong><br>The androids do not follow scripts. They are powered in <strong>real time</strong> by actual language models. Both text and voice are generated on the fly. That means every game is unique and unpredictable. You are not playing against bots or prewritten scripts. <strong>You are playing against real artificial intelligences</strong>.",
    modal_humanVariable_badge_made_alone: "Made alone",
    modal_humanVariable_badge_date: "Jul 2025",
    modal_humanVariable_badge_dev_time: "Dev: 2 Weeks",
    modal_humanVariable_badge_core_tech: "Core: LLMs Tech",
    modal_humanVariable_badge_engine: "Unreal Engine 5 : C++",
    modal_humanVariable_on_request: "Playtest available upon request",
    // -- RPG with LLM (Modal)
    modal_rpgLLM_title: "RPG with LLM (Master Thesis)",
    modal_rpgLLM_description: "This thesis project (made in 5 months) explores how <strong>large language models (LLMs)</strong> can be used to generate dynamic, immersive, and <strong>personalized role-playing game</strong> (RPG) adventures. I developed an application in Unity where players can dive into a fully AI-generated experience, both in terms of storytelling and visuals.<br><br><strong>🧠 Each AI acts as a game master</strong>, capable of adapting to the player's choices, generating rich dialogue, complex situations, and keeping the story consistent and engaging.<br><br>🎨 <strong>Players are free to choose the universe they want to explore</strong>: a medieval world inspired by Dungeons &amp; Dragons, a space epic like Star Wars, or even a totally absurd adventure with SpongeBob ; Anything is possible. The AI adjusts the story, characters, and events to match the selected style and tone.<br><br>🖼️ <strong>To enhance the experience</strong>, AI-generated images illustrate key places, characters, and story moments, making the journey even more immersive and visually engaging.",
    modal_rpgLLM_badge_by_2: "By 2",
    modal_rpgLLM_badge_date: "Jun 2025",
    modal_rpgLLM_badge_dev_time: "Dev: 5 months",
    modal_rpgLLM_badge_core_tech: "Core: LLMs Tech",
    modal_rpgLLM_badge_engine: "Unity Engine",
    modal_rpgLLM_badge_language: "C#",
    modal_rpgLLM_badge_award: "2025 IEEE/ICTEAM Best Master’s Thesis Award",
    // -- Loki (Modal)
    modal_loki_title: "Loki (Bachelor's Thesis)",
    modal_loki_description: "1350, in the shadowy alleys of Danelawgham.<br><br> <strong>Signy</strong>, a young orphan, becomes the reluctant champion of the trickster god Loki. Gifted with <strong>the power of shapeshifting</strong> : she can <strong>take the form of anyone</strong> or any creature whose personal item she possesses.<br><br>Signy uses <strong>strength, charm, and stealth</strong> to <strong>infiltrate</strong> forbidden places, <strong>manipulate</strong> nobles, and dismantle social barriers.From breaking down doors as a muscular guard to sneaking through cracks as a nimble cat, each form becomes a strategic tool.<br><br>In this narrative-driven game blending infiltration, identity theft, and divine mischief, players must uncover <strong>Signy's secret past</strong> and outwit a society that never saw her coming.",
    modal_loki_badge_by_8: "By 8",
    modal_loki_badge_date: "Feb 2022",
    modal_loki_badge_dev_time: "Dev: 3 months",
    modal_loki_badge_role: "Technical Artist, UI designer",
    modal_loki_badge_engine: "Unreal Engine 4",
    // -- Who is lying (Modal)
    modal_whoislying_title: "Who is lying ? <lower>(in progress)</lower>",
    modal_whoislying_description:"<strong>Who is Lying</strong> is an innovative investigative game where you play as a detective tasked with solving complex cases by interrogating suspects… who aren't just scripted characters, but actual <strong>artificial intelligences capable of answering any question freely</strong>.<br></br>Each suspect comes with their own <strong>memory</strong>, <strong>personality</strong>, <strong>secrets</strong>, and <strong>alibis</strong>, generated and driven by LLMs (Large Language Models), making every interrogation <strong>unique, unpredictable, and believable</strong>.<br></br>The player speaks through a microphone, just like in a real interrogation, and can choose to <strong>dig, confront, manipulate, or simply observe</strong>… but beware: <strong>these AIs can lie, contradict themselves, or slip up</strong>.<br></br>The core innovation of <strong>Who is Lying</strong> lies in its <strong>systemic architecture</strong>: each response is contextualized, consistent with the character's memories, and evolves based on the ongoing conversation.<br></br>Every session becomes a <strong>living investigation</strong>, where the truth hides in the shadows, silences, and contradictions.<br></br>With a <strong>modular AI integration system</strong>, <strong>Who is Lying</strong> is both a narrative game, an <strong>experimental experience in conversational AI</strong>, and a showcase of my skills in <strong>interactive design, software architecture, storytelling, and UX</strong>.",
    modal_whoislying_badge_alone: "Made alone",
    modal_whoislying_badge_date: "Oct 2025",
    modal_whoislying_badge_dev_time: "In progress",
    modal_whoislying_badge_role: "Technical Artist, UI designer, Game Dev",
    modal_whoislying_badge_engine: "Unity 6",
    // -- Diablo Cyberpunk (Modal)
    modal_diablo_title: "Diablo Like : Cyberpunk (Bachelor's work)",
    modal_diablo_description: "A <strong>cyberpunk remake of Diablo III</strong> where every visual effect (<strong>explosions</strong>, <strong>attacks</strong>, <strong>dash</strong>, <strong>summons</strong>) has been designed entirely by hand.<br><br>⚡️🔥 An intense <strong>solo project</strong> created during the <strong>second year of game design school</strong>, where <strong>VFX</strong> brings <strong>futuristic gameplay</strong> to life. <strong>Come and take a closer look!</strong>",
    modal_diablo_badge_made_alone: "Made alone",
    modal_diablo_badge_date: "Jun 2021",
    modal_diablo_badge_dev_time: "Dev: 2 months",
    modal_diablo_badge_role: "Technical Artist, UI designer, Animation, VFX designer, Sound designer, Level designer, Game designer",
    modal_diablo_badge_engine: "Unity Engine",
    // -- Stalk and Ruin (Modal)
    modal_stalkRuin_title: "Stalk and Ruin (Game Jam)",
    modal_stalkRuin_description: "A <strong>first-person detective game</strong> created in just <strong>4 days</strong> with <strong>Unreal Engine 4</strong> (which I learned on the fly!).<br><br> Set in the gritty <strong>New York of the 70s–80s</strong>, you play as a private investigator perched on a rooftop, armed with nothing but a camera, and a client's shady list of targets. 🕵️‍♂️📸<br><br> Zoom, pan, and scan the windows of nearby buildings. <strong>Each inhabitant has unique features</strong> : hairstyle, clothes, habits, and it's up to you to <strong>spot them in compromising situations</strong> before time and film run out. <br><br><strong>Blueprints</strong>, <strong>camera logic</strong>, <strong>UI</strong>, <strong>sound design</strong>... I handled everything on the technical side. Come take a look, and don't forget to bring your zoom lens. 👀",
    modal_stalkRuin_badge_by_5: "By 5 people",
    modal_stalkRuin_badge_date: "Oct 2021",
    modal_stalkRuin_badge_dev_time: "Dev: 4 days",
    modal_stalkRuin_badge_role: "Technical Artist, UI designer, VFX designer, Sound designer",
    modal_stalkRuin_badge_engine: "Unreal Engine 4",
    // -- One Way Trip (Modal)
    modal_oneWayTrip_title: "One Way Trip (Game Jam)",
    modal_oneWayTrip_description: "A <strong>twisted road trip game</strong> made in just <strong>3 days</strong> where you play a taxi driver with a dark mission: <strong>eliminate your passenger without raising suspicion</strong>. 🧪🚗<br><br> With a dose of <strong>absurd physics</strong>, you'll need to search the car, combine everyday objects, and <strong>improvise deadly tools</strong>... all while keeping a casual conversation going. <br><br> I managed the entire <strong>tech side</strong>: <strong>gameplay integration</strong>, <strong>UI</strong>, <strong>animation setup</strong>, <strong>interactions</strong>, and more.<br> <strong>It's bizarre. It's funny. It's a little disturbing.</strong> ",
    modal_oneWayTrip_badge_by_6: "By 6 people",
    modal_oneWayTrip_badge_date: "Oct 2021",
    modal_oneWayTrip_badge_dev_time: "Dev: 3 days",
    modal_oneWayTrip_badge_role: "Technical Artist, UI designer, Gameplay Designer",
    modal_oneWayTrip_badge_engine: "Unity Engine",

    // -- Kart Color (Modale)
    modal_kartColor_title: "Kart Color (quick project)",
    modal_kartColor_description: "🚗💨 <strong>Kart Color</strong> is a <strong>fast-paced arcade game</strong> that I designed and developed in just <strong>7 days</strong>. The goal: drive your kart around a circular arena and <strong>cover more surface 🎨 than your opponent</strong> ⏱️.<br><br>🎮 <strong>Solo</strong>: face an autonomous bouncing ball that paints its own color and progress through levels.<br><br>👥 <strong>Local Multiplayer</strong>: challenge your friends across <strong>21 rounds of 10 seconds</strong> each.⭐ <strong>Power-ups & coins</strong>: grab items ⚡🛡️🎭 (speed boost, bigger trail, shield, duplication…) and collect 💰 to unlock <strong>new karts and colors</strong>.<br><br>✨ With a <strong>vibrant aesthetic</strong> and an <strong>energetic soundtrack</strong>, this project highlights my skills in <strong>game design</strong>, <strong>gameplay programming</strong>, <strong>UI/UX</strong>, and the integration of <strong>diverse systems</strong> (AI, multiplayer, shop).With its <strong>fast-paced action</strong> and <strong>colorful visuals 🌈</strong>, <strong>Kart Color</strong> showcases my ability to <strong>create a fun, polished, and replayable experience within a short timeframe</strong>.",
    modal_kartColor_badge_alone: "Made alone",
    modal_kartColor_badge_date: "Oct. 2025",
    modal_kartColor_badge_dev_time: "Dev : 7 days",
    modal_kartColor_badge_role: "Technical Art., UI Designer, Gameplay Designer, Sound Designer, Level Designer",
    modal_kartColor_badge_engine: "Unity 6",

    // Lightbox
    lightboxPrevAriaLabel: "Previous image",
    lightboxNextAriaLabel: "Next image",
    lightboxCloseAriaLabel: "Close lightbox"

  },
    fr: {
    // Titres et descriptions méta
    docTitle: "Portfolio de Justin Vanwichelen - Développeur",
    canonicalUrl: "https://justinvanwichelen.be/?lang=fr",
    ogLocale: "fr_FR",
    metaDescription: "Explorez le portfolio de Justin Vanwichelen, présentant des projets en développement de jeux, en IA et en technical artist.",
    metaKeywords: "Justin Vanwichelen, Portfolio, Technical Artist, Développeur de Jeux, IA, Informatique, Unreal Engine, Unity, HEAJ, UCLouvain, Développement de Jeux, Systèmes Interactifs, Programmation de Gameplay, Art Technique, IA dans les Jeux, Conception de Jeux, Projets de Jeux, Projets IT",
    ogTitle: "Portfolio de Justin Vanwichelen - Développeur",
    ogDescription: "Explorez le portfolio de Justin Vanwichelen, présentant des projets en développement de jeux, en IA et en technical artist.",
    twitterTitle: "Portfolio de Justin Vanwichelen - Développeur",
    twitterDescription: "Explorez le portfolio de Justin Vanwichelen, présentant des projets en développement de jeux, en IA et en technical artist.",
    // Barre de navigation
    navHome: "Accueil",
    navGameProjects: "Jeux",
    navItProjects: "Projets IT",
    navMyJourney: "Mon Parcours",
    navCv: "CV",
    switchToDarkMode: "Activer le mode sombre",
    switchToLightMode: "Activer le mode clair",
    themeToggle : "Activer le mode clair",
    // Section Hero
    heroGreeting: "SALUT! JE SUIS <strong>JUSTIN 👋</strong>",
    heroRoleChip: "• Game Developer •",
    heroP1: "Formé en tant que <strong>Technical Artist</strong>, suivi d'un <strong>Master en Informatique</strong> avec une spécialisation en <strong>Intelligence Artificielle</strong>, je me passionne pour la <strong>programmation gameplay</strong> et le développement de systèmes interactifs. Mon sens créatif, combiné à mes compétences techniques, me permet de concevoir des <strong>expériences immersives, dynamiques et intelligentes</strong>.",
    heroP2: "J'aime <strong>mêler logique et esthétique</strong> pour donner vie à des univers captivants. À l’aise avec <strong>Photoshop</strong>, je prends plaisir à créer des visuels détaillés, notamment lors des phases de prototypage et de conception.",
    heroP3: "Je m’intéresse particulièrement à l’intégration de <strong>modèles de langage (LLMs)</strong> dans les jeux vidéo afin de rendre les interactions plus naturelles, imprévisibles et fascinantes. <strong>Mon mémoire de Master</strong> explore comment ces technologies peuvent enrichir la narration et l’interactivité dans les jeux de rôle.",
    heroCtaProjects: "Voir mes projets de jeux",
    heroCtaItProjects: "Voir mes projets IT",
    heroCtaCv: "Télécharger mon CV",
    heroScrollCue: "Faites défiler pour explorer mes univers",
    // Carrousel des projets mis en avant
    carouselHeader: "Projets mis en avant",
    // -- Carte : The Human Variable (Carrousel)
    humanVariableTitleCarousel: "The Human Variable (2025)",
    humanVariableBadgeMadeAlone: "Réalisé seul",
    humanVariableBadge2Weeks: "2 semaines",
    humanVariableDescriptionCarousel: "Vous êtes le seul humain parmi cinqs androïdes... À chaque tour, répondez à une question ouverte et votez pour celui qui semble trop humain. Le twist ? Les androïdes sont de vrais LLMs (GPT, Gemini, Mistral et Llama). Et ils essaient de vous trouver.",
    humanVariableBtnLearnMore: "En savoir plus",
    // -- Carte : RPG avec LLM (Carrousel)
    rpgLLMTitleCarousel: "RPG with LLM (2025)",
    rpgLLMBadgeBy2: "Par 2 personnes",
    rpgLLMBadge7Months: "7 mois",
    rpgLLMBadgeAward: "Prix du meilleur mémoire de master IEEE/ICTEAM 2025",
    rpgLLMDescriptionCarousel: "Plongez-vous dans un RPG généré par IA en temps réel, où chaque aventure est unique, immersive et façonnée par vos choix. Choisissez votre LLM préféré et laissez-le devenir un vrai maître de jeu.",
    rpgLLMBtnSeeMore: "Je veux voir plus",
    // -- Carte : Loki (Carrousel)
    lokiTitleCarousel: "LOKI (2022)",
    lokiBadgeBy8: "Par 8 personnes",
    lokiBadge3Months: "3 mois",
    lokiDescriptionCarousel: "Signy a le pouvoir de prendre la forme de n'importe qui ou de n'importe quel animal. D'une brute puissante à un chat furtif, chaque transformation ouvre de nouveaux chemins pour s'infiltrer, tromper et gravir l'échelle sociale.",
    lokiBtnCurious: "Je suis aussi curieux qu'un chat",
    // -- Carte : Diablo Cyberpunk (Carrousel)
    diabloTitleCarousel: "DIABLO III CYBERPUNK (2021)",
    diabloBadgeMadeAlone: "Réalisé seul",
    diabloBadge3MonthsCarousel: "3 mois",
    diabloDescriptionCarousel: "J'ai recréé une version cyberpunk de Diablo III, complète avec un gameplay maison, des VFX, des animations et un HUD. Combats, énigmes et pouvoirs futuristes vous attendent.",
    diabloBtnTellMeMore: "En savoir plus",
    // -- Carte : Kart Color (Carrousel)
    kartColorTitleCarousel: "KART COLOR (2025)",
    kartColorBadgeMadeAlone: "Réalisé seul",
    kartColorBadge3Months: "7 jours",
    kartColorDescriptionCarousel: "🚗💨 Kart Color est un jeu d’arcade effréné où chaque seconde compte. Dépasse ton adversaire, peins l’arène, récupère les bonus et remporte la victoire dans un tourbillon de couleurs et de chaos.",
    kartColorBtnTellMeMore: "En savoir plus",
    // Section personnalisée image + vidéo + texte (The Human Variable)
    humanVariableSectionTitle: "Cinq androïdes. Un imposteur. Vous.",
    humanVariableSectionP: "Vous êtes le seul humain parmi cinq androïdes. Les autres sont pilotés par de vrais LLMs : GPT, Mistral, LLaMA, et Gemma. À chaque tour, une question est posée. Tout le monde répond. Ensuite, chacun vote : qui a semblé trop humain ? Trop émotionnel ? Trop réel ? Fondez-vous dans la masse. Parlez comme une IA… ou vous serez éliminé.<br><br>🧩 C'est un <strong>test de Turing inversé</strong> : au lieu de machines qui essaient de paraître humaines, <strong>c'est à vous de convaincre les machines que vous êtes l'une d'entre elles</strong>.",
    humanVariableSectionBtn: "Je veux voir plus",
    // Section personnalisée image + vidéo + texte  (WhoIsLying)
    whoIsLyingSectionTitle: "Ils savent mentir. Saurez-vous douter ?",
    whoIsLyingSectionP: "Who is Lying est un jeu d'enquête narratif où chaque suspect est incarné par une IA capable de mentir, se contredire ou révéler ses secrets selon vos questions. Analysez, interrogez, confrontez... et découvrez qui ment.",
    whoIsLyingSectionBtn: "En savoir plus",
    // Section personnalisée image + vidéo + texte (RPG avec LLM)
    rpgLLMSectionTitle: "Chaque partie raconte une nouvelle histoire.",
    rpgLLMSectionP: "Plongez-vous dans un RPG généré par IA en temps réel, où chaque aventure est unique, immersive et façonnée par vos choix. Au travers de ce mémoire de master, nous avons découvert comment l'IA peut devenir un vrai maître de jeu.",
    rpgLLMSectionBtn: "En savoir plus",
    // Section Mon Parcours / Chronologie
    timelineJourneyTitle: "Mon Parcours",
    timelineJobSucrerie: "Jobiste étudiant à La Sucrerie. En contact avec les clients.",
    timelineInternAppeals: "Stage en tant que Tech. Art chez Appeals Studio. Travail sur le développement d'Outcast 2.",
    timelineGradHeaj: "Diplômé en tant que Tech. Art à la Haute École Albert-Jacquard",
    timelineTutorUcl: "Tuteur en informatique pour environ quarante étudiants en première année de bachelier en informatique (à l'UCLouvain)",
    timelineGradUcl: "Diplômé d'un master en informatique de l'Université Catholique de Louvain-La-Neuve",
    timelineNext: "Peut-être avec vous... ?",
    // Section Outils & Technologies
    toolsTechTitle: "Outils & Technologies",
    // Section Projets IT
    itProjectsSectionTitle: "Projets IT",
    // -- Carte IT 1
    itConstraintProgrammingTitle: "Programmation par contraintes",
    itConstraintProgrammingYear: "2024",
    itConstraintProgrammingDesc: "Modélisation et résolution d'instances d'un problème de logistique et de transport en utilisant la programmation par contraintes.",
    // -- Carte IT 2
    itCompilerTitle: "Compilateur",
    itCompilerYear: "2024",
    itCompilerDesc: "Codage d'un compilateur complet qui transforme un langage inventé en bytecode Java, de l'analyse lexicale du code à sa traduction en instructions exécutables.",
    // -- Carte IT 3
    itMachineLearningTitle: "Machine Learning",
    itMachineLearningYear: "2024",
    itMachineLearningDesc: "Nous avons abordé une tâche de classification binaire en utilisant un ensemble de données industriel réel qui était diversifié et mal nettoyé, réparti sur plusieurs fichiers CSV avec de nombreuses variables mais peu d'observations. Nous pouvions utiliser toutes les techniques d'apprentissage automatique que nous voulions.",
    // -- Carte IT 4
    itCarDamageAppTitle: "Car Damage App",
    itCarDamageAppYear: "2023",
    itCarDamageAppDesc: "Pour mon cours de logiciel, j'ai travaillé sur l'application Car Damage App (RepairPal) (par NRB) pour permettre une détection rapide des dommages et des estimations des coûts de réparation après des accidents, aidant les utilisateurs et les assureurs.",
    // -- Carte IT 5
    itSRV6Title: "SRV6 - Trafic Engineering",
    itSRV6Year: "2023",
    itSRV6Desc: "J'ai utilisé Containerlab et FRRouting pour simuler une topologie de réseau de 14 nœuds, évaluant le Trafic Engineering en ajoutant des retards artificiels pour optimiser le routage des données sur divers chemins.",
    // -- Carte IT 6
    itTextPreacherTitle: "Prédicateur de texte",
    itTextPreacherYear: "2023",
    itTextPreacherDesc: "Un prédicateur de texte formé sur des données Twitter (X maintenant), créé en utilisant le langage Oz (langague sans boucles et avec affectation unique (quel horreur)).",
    // Section Tous les Jeux
    allGamesSectionTitle: "Tous les Jeux",
    // -- Titres des cartes de jeu (les modales géreront plus de détails)
    gameHumanVariableTitle: "The Human Variable",
    gameRpgLLMTitle: "RPG avec LLM",
    gameLokiTitle: "Loki",
    gameDiabloCyberpunkTitle: "Diablo Cyberpunk",
    gameKartColorTitle: "Kart Color",
    gameStalkAndRuinTitle: "Stalk and Ruin",
    gameOneWayTripTitle: "One Way Trip",
    gameWhoIsLyingTitle: "Who is Lying ?",
    // Pied de page
    footerCvDownload: "Télécharger mon CV",
    footerCvAriaLabel: "Télécharger mon CV",
    footerGithubAriaLabel: "Visiter mon profil GitHub",
    footerLinkedinAriaLabel: "Visiter mon profil LinkedIn",
    footerYoutubeAriaLabel: "Visiter ma chaîne YouTube",
    footerEmailAriaLabel: "M'envoyer un email",
    footerCopyright: "&copy; 2025 Justin Vanwichelen. Tous droits réservés. --> Le code de mon site web est disponible sur GitHub.",
    // Modale Générique
    modalPlayButton: "Jouer",
    modalCloseButtonAriaLabel: "Fermer le module",
    modal_rpgLLM_btn_report: "Regarder la défense",
    modal_rpgLLM_btn_thesis: "Lire le mémoire",
    modal_rpgLLM_btn_defence: "Voir la défense",
    // Contenu de la modale (préfixé avec modal_ pour éviter les conflits)
    // -- The Human Variable (Modale)
    modal_humanVariable_title: "The Human Variable - Un test de Turing inversé",
    modal_humanVariable_description: "Vous êtes le <strong>seul humain</strong> enfermé dans une pièce avec <strong>quatre autres androïdes</strong>, chacun alimenté par un <strong>modèle de langage différent (LLM)</strong> : GPT, Mistral, LLaMA, et Gemma.<br><br>Personne ne sait pourquoi ils sont là. Tout ce qu'on vous dit, c'est qu'<strong>un humain se cache parmi les machines</strong>, et il doit être démasqué.<br><br>À chaque tour, une question ouverte est posée. Un par un, chaque participant, IA et humain, répond à voix haute. Puis vient le vote : <strong>chacun choisit qui il pense être l'humain</strong>. Celui qui a le plus de voix est éliminé. Pour toujours.<br><br>Votre mission ?<br><strong>Répondre comme une machine</strong>. Penser comme une machine. Et faire tout ce que vous pouvez pour éviter d'être découvert.<br><br>🧩 Ce n'est pas un test de Turing classique. C'est un <strong>test de Turing inversé</strong> : au lieu de machines qui essaient de paraître humaines, <strong>c'est à vous de convaincre que vous êtes une IA</strong>.<br><br>🤖 <strong>De vraies IA, des comportements uniques</strong><br>Les androïdes ne suivent pas de scripts. Ils sont alimentés <strong>en temps réel</strong> par de vrais modèles de langage. Le texte et la voix sont générés à la volée. Cela signifie que chaque jeu est unique et imprévisible. Vous ne jouez pas contre des bots ou des scripts préécrits. <strong>Vous jouez contre de vraies intelligences artificielles</strong>.",
    modal_humanVariable_badge_made_alone: "Réalisé seul",
    modal_humanVariable_badge_date: "Juil. 2025",
    modal_humanVariable_badge_dev_time: "Dev : 2 semaines",
    modal_humanVariable_badge_core_tech: "Technologie principale : LLMs",
    modal_humanVariable_badge_engine: "Unreal Engine 5 : C++",
    modal_humanVariable_on_request: "Test disponible sur demande",
    // -- RPG avec LLM (Modale)
    modal_rpgLLM_title: "RPG avec LLM (Mémoire de Master)",
    modal_rpgLLM_description: "Ce projet de mémoire (réalisé en 5 mois) explore comment les <strong>grands modèles de langage (LLMs)</strong> peuvent être utilisés pour générer des aventures de <strong>jeu de rôle (RPG)</strong> dynamiques, immersives et <strong>personnalisées</strong>. J'ai développé une application dans Unity où les joueurs peuvent plonger dans une expérience entièrement générée par IA, tant en termes de narration que de visuels.<br><br><strong>🧠 Chaque IA agit comme un maître de jeu</strong>, capable de s'adapter aux choix du joueur, de générer des dialogues riches, des situations complexes et de garder l'histoire cohérente et engageante.<br><br>🎨 <strong>Les joueurs sont libres de choisir l'univers qu'ils veulent explorer</strong> : un monde médiéval inspiré de Donjons & Dragons, une épopée spatiale comme Star Wars, ou même une aventure totalement absurde avec Bob l'éponge ; tout est possible. L'IA ajuste l'histoire, les personnages et les événements pour correspondre au style et au ton sélectionnés.<br><br>🖼️ <strong>Pour enrichir l'expérience</strong>, des images générées par IA illustrent les lieux clés, les personnages et les moments de l'histoire, rendant le voyage encore plus immersif et visuellement engageant.<br><br>Ce mémoire nous a permis de faire énormément de mesures intéressantes, autant sur les temps de réponses des requêtes, les techniques d'influence de prompts, les coûts des LLMs ou encore les limites (ex : stéréotype de genre). ",
    modal_rpgLLM_badge_by_2: "Développé par 2 personnes",
    modal_rpgLLM_badge_date: "Juin 2025",
    modal_rpgLLM_badge_dev_time: "Dev : 5 mois",
    modal_rpgLLM_badge_core_tech: "LLMs",
    modal_rpgLLM_badge_engine: "Unity",
    modal_rpgLLM_badge_language: "C#",
    modal_rpgLLM_badge_award: "Prix du meilleur mémoire de master IEEE/ICTEAM 2025",
    // -- Loki (Modale)
    modal_loki_title: "Loki (Mémoire de bachelier)",
    modal_loki_description: "1350, dans les ruelles ombragées de Danelawgham.<br><br><strong>Signy</strong>, une jeune orpheline, devient la championne du dieu farceur Loki. Dotée du <strong>pouvoir de métamorphose</strong> : elle peut <strong>prendre la forme de n'importe qui</strong> ou de n'importe quelle créature dont elle possède un objet personnel.<br><br>Signy utilise la <strong>force, le charme et la furtivité</strong> pour <strong>s'infiltrer</strong> dans des lieux interdits, <strong>manipuler</strong> les nobles et démanteler les barrières sociales. De l'enfonceur de portes en tant que garde musclé à la furtivité en tant que chat agile, chaque forme devient un outil stratégique.<br><br>Dans ce jeu narratif mêlant infiltration, vol d'identité et malice divine, les joueurs doivent découvrir <strong>le passé secret de Signy</strong> et déjouer une société qui ne l'a jamais vue venir.",
    modal_loki_badge_by_8: "Équipe de 8 personnes",
    modal_loki_badge_date: "Fév. 2022",
    modal_loki_badge_dev_time: "Dev : 3 mois",
    modal_loki_badge_role: "Technical Art., Designer UI",
    modal_loki_badge_engine: "Unreal Engine 4",

    // -- Who is lying (Modal)
    modal_whoislying_title: "Who is lying ? <lower>(en développement)</lower>",
    modal_whoislying_description: "<strong>Who is Lying</strong> est un jeu d'enquête innovant où le joueur incarne un inspecteur chargé d'élucider des affaires complexes en interrogeant des suspects... qui ne sont pas de simples personnages scriptés, mais de véritables <strong>intelligences artificielles capables de répondre librement à toutes les questions posées</strong>.<br></br>Chaque suspect possède sa propre <strong>mémoire</strong>, <strong>personnalité</strong>, <strong>secrets</strong> et <strong>alibis</strong>, générés et animés par des LLMs (Large Language Models), ce qui rend chaque interrogation <strong>unique, imprévisible et crédible</strong>.<br></br>Le joueur parle dans son micro comme il le ferait dans un vrai interrogatoire, et peut <strong>creuser, confronter, manipuler ou simplement écouter</strong>… mais attention : <strong>mentir, se contredire ou se trahir est aussi possible pour ces IA</strong>.<br></br>L'innovation majeure de <strong>Who is Lying</strong> réside dans son <strong>architecture systémique</strong> : les réponses sont contextualisées, cohérentes avec les souvenirs du personnage, et évoluent en fonction des échanges.<br></br>Chaque partie devient ainsi une <strong>enquête vivante</strong>, où la vérité se cache derrière les zones d'ombre, les silences et les contradictions.<br></br>Avec un <strong>système modulaire d'intégration d'IA</strong>, <strong>Who is Lying</strong> est à la fois un jeu narratif, une <strong>expérience expérimentale sur les IA conversationnelles</strong>, et un démonstrateur de mes compétences en <strong>design interactif, architecture logicielle, storytelling et UX</strong>.",
    modal_whoislying_badge_alone: "Réalisé seul",
    modal_whoislying_badge_date: "Oct 2025",
    modal_whoislying_badge_dev_time: "En développement",
    modal_whoislying_badge_role: "Technical Artist, UI designer, Game Dev",
    modal_whoislying_badge_engine: "Unity 6",

    // -- Diablo Cyberpunk (Modale)
    modal_diablo_title: "Diablo Like : Cyberpunk (Travail de Licence)",
    modal_diablo_description: "Un <strong>remake cyberpunk de Diablo III</strong> où chaque effet visuel (<strong>explosions</strong>, <strong>attaques</strong>, <strong>dash</strong>, <strong>invocations</strong>) a été conçu entièrement à la main.<br><br>⚡️🔥 Un projet <strong>solo intense</strong> créé pendant la <strong>deuxième année d'école de design de jeux</strong>, où les <strong>VFX</strong> donnent vie à un <strong>gameplay futuriste</strong>. <strong>Venez jeter un coup d'œil !</strong>",
    modal_diablo_badge_made_alone: "Réalisé seul",
    modal_diablo_badge_date: "Juin 2021",
    modal_diablo_badge_dev_time: "Dev : 2 mois",
    modal_diablo_badge_role: "Technical Art., Designer UI, Animation, Designer VFX, Designer Sonore, Designer de Niveaux, Game Designer",
    modal_diablo_badge_engine: "Unity",
    // -- Stalk and Ruin (Modale)
    modal_stalkRuin_title: "Stalk and Ruin (Game Jam)",
    modal_stalkRuin_description: "Un <strong>jeu de détective à la première personne</strong> créé en seulement <strong>4 jours</strong> avec <strong>Unreal Engine 4</strong> (que j'ai appris sur le tas !).<br><br>Situé dans le <strong>New York des années 70-80</strong>, vous incarnez un détective privé perché sur un toit, armé seulement d'un appareil photo et d'une liste de cibles douteuses d'un client. 🕵️‍♂️📸<br><br>Zoomez, panoramique et scannez les fenêtres des bâtiments voisins. <strong>Chaque habitant a des caractéristiques uniques</strong> : coiffure, vêtements, habitudes, et c'est à vous de <strong>les repérer dans des situations compromettantes</strong> avant que le temps et la pellicule ne s'épuisent.<br><br><strong>Blueprints</strong>, <strong>logique de caméra</strong>, <strong>UI</strong>, <strong>design sonore</strong>... J'ai géré tout le côté technique. Venez jeter un coup d'œil, et n'oubliez pas d'apporter votre caméra. 👀",
    modal_stalkRuin_badge_by_5: "Equipe de 5 personnes",
    modal_stalkRuin_badge_date: "Oct. 2021",
    modal_stalkRuin_badge_dev_time: "Dev : 4 jours",
    modal_stalkRuin_badge_role: "Technical Art., Designer UI, Designer VFX, Designer Sonore",
    modal_stalkRuin_badge_engine: "Unreal Engine 4",
    // -- One Way Trip (Modale)
    modal_oneWayTrip_title: "One Way Trip (Game Jam)",
    modal_oneWayTrip_description: "Un <strong>jeu de road trip tordu</strong> fait en seulement <strong>3 jours</strong> où vous incarnez un chauffeur de taxi avec une mission sombre : <strong>éliminer votre passager sans éveiller les soupçons</strong>. 🧪🚗<br><br>Avec une dose de <strong>physique absurde</strong>, vous devrez fouiller la voiture, combiner des objets du quotidien et <strong>improviser des outils mortels</strong>... tout en maintenant une conversation banale.<br><br>J'ai géré tout le <strong>côté technique</strong> : <strong>intégration du gameplay</strong>, <strong>UI</strong>, <strong>configuration des animations</strong>, <strong>interactions</strong>, et plus.<br><strong>C'est bizarre. C'est drôle. C'est un peu dérangeant.</strong>",
    modal_oneWayTrip_badge_by_6: "Développé par 6 personnes",
    modal_oneWayTrip_badge_date: "Oct. 2021",
    modal_oneWayTrip_badge_dev_time: "Dev : 3 jours",
    modal_oneWayTrip_badge_role: "Technical Art., Designer UI, Gameplay Designer",
    modal_oneWayTrip_badge_engine: "Unity",
    // -- Kart Color (Modale)
    modal_kartColor_title: "Kart Color (projet rapide)",
    modal_kartColor_description: "🚗💨 <strong>Kart Color</strong> est un <strong>jeu d’arcade compétitif</strong> que j’ai conçu et développé en seulement <strong>7 jours</strong>. Le but : contrôler un kart dans une arène circulaire et <strong>colorer plus de surface 🎨 que l’adversaire</strong> ⏱️.<br><br>🎮 <strong>Solo</strong> : affrontez une balle qui peint sa propre couleur et enchaînez les niveaux.<br><br>👥 <strong>Multijoueur local</strong> : défiez vos amis sur <strong>21 manches de 10 secondes</strong> intenses.⭐ <strong>Bonus & pièces</strong> : attrapez des power-ups ⚡🛡️🎭 (vitesse, grosse trace, bouclier, duplication…) et collectez des 💰 pour débloquer de <strong>nouveaux karts et couleurs</strong>.<br><br>✨ Avec une <strong>esthétique vibrante</strong> et une <strong>bande-son entraînante</strong>, ce projet démontre mes compétences en <strong>game design</strong>, <strong>programmation gameplay</strong>, <strong>UI/UX</strong> et intégration de <strong>systèmes variés</strong> (IA, multijoueur, boutique). Avec son <strong>rythme rapide</strong> et ses <strong>visuels colorés 🌈</strong>, <strong>Kart Color</strong> prouve ma capacité à <strong>créer une expérience fun, complète et rejouable en un temps limité</strong>.",
    modal_kartColor_badge_alone: "Développé seul",
    modal_kartColor_badge_date: "Oct. 2025",
    modal_kartColor_badge_dev_time: "Dev : 7 jours",
    modal_kartColor_badge_role: "Technical Art., Designer UI, Gameplay Designer, Sound Designer, Level Designer",
    modal_kartColor_badge_engine: "Unity 6",
    // Lightbox
    lightboxPrevAriaLabel: "Image précédente",
    lightboxNextAriaLabel: "Image suivante",
    lightboxCloseAriaLabel: "Fermer la lightbox"
}

  };


  const supportedLanguages = Object.freeze(Object.keys(translations));

  function hasTranslation(key, lang) {
    return Object.prototype.hasOwnProperty.call((translations && translations[lang]) || {}, key);
  }
  function getTranslationDictionary() {
    return translations;
  }

  const LANGUAGE_STORAGE_KEY = 'preferredLanguage';
  const LANGUAGE_CHANGE_EVENT = 'i18n:language-changed';

  let activeLanguage = null;
  const languageChangeListeners = new Set();

  function readStoredLanguage() {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (error) {
      console.warn('Unable to access localStorage for language preferences.', error);
      return null;
    }
  }

  function persistLanguage(lang) {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.warn('Unable to persist language preference.', error);
    }
  }

  function getBrowserLanguage() {
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language.split('-')[0];
    }
    return null;
  }

  function resolveInitialLanguage() {
    const storedLanguage = readStoredLanguage();
    if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
      return storedLanguage;
    }

    const browserLanguage = getBrowserLanguage();
    if (browserLanguage && supportedLanguages.includes(browserLanguage)) {
      return browserLanguage;
    }

    return supportedLanguages[0] ?? 'en';
  }

  function ensureActiveLanguage() {
    if (!activeLanguage) {
      activeLanguage = resolveInitialLanguage();
    }
    return activeLanguage;
  }

  function emitLanguageChange() {
    const currentLanguage = ensureActiveLanguage();
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      const event = new CustomEvent(LANGUAGE_CHANGE_EVENT, {
        detail: {
          language: currentLanguage,
        }
      });

      window.dispatchEvent(event);
    }

    languageChangeListeners.forEach((listener) => {
      try {
        listener(currentLanguage);
      } catch (error) {
        console.error('Error in language change listener', error);
      }
    });
  }

  function getSupportedLanguages() {
    return supportedLanguages;
  }

  function getActiveLanguage() {
    return ensureActiveLanguage();
  }

  function setActiveLanguage(lang, { notify = true, persist = true, force = false } = {}) {
    if (!supportedLanguages.includes(lang)) {
      console.error(`Language ${lang} is not supported.`);
      return;
    }

    const previousLanguage = ensureActiveLanguage();
    const hasChanged = previousLanguage !== lang;

    if (hasChanged) {
      activeLanguage = lang;
      if (persist) {
        persistLanguage(lang);
      }
    }

    if (notify && (hasChanged || force)) {
      emitLanguageChange();
    }
  }

  function translate(key, lang = ensureActiveLanguage()) {
    const languageTranslations = translations[lang];

    if (!languageTranslations) {
      console.warn(`Translations for language '${lang}' not found.`);
      return `MissingKey: ${key}`;
    }

    const translation = languageTranslations[key];
    if (translation === undefined) {
      console.warn(`Translation not found for key: ${key} in language: ${lang}`);
      return `MissingKey: ${key}`;
    }

    return translation;
  }

  function onLanguageChange(listener) {
    languageChangeListeners.add(listener);
    return () => languageChangeListeners.delete(listener);
  }

  function hasTranslationForLang(key, lang) {
    return hasTranslation(key, lang);
  }

  // Initialize active language immediately to keep state consistent.
  ensureActiveLanguage();

  global.translationService = {
    getSupportedLanguages,
    getActiveLanguage,
    setActiveLanguage,
    translate,
    onLanguageChange,
    LANGUAGE_CHANGE_EVENT,
    getTranslationDictionary,
    hasTranslationForLang,
  };
})(typeof window !== 'undefined' ? window : this);
