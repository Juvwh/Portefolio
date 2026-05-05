# My Profile and Projects: A Brief for the Web Developer

Hi! I'm Justin Vanwichelen. Below is a comprehensive overview of my profile, my journey, my skills, and all the projects (both games and IT) I've worked on. I'm providing this so you can fully understand who I am, what I do, and the kind of work I produce, which should help you in building my new website.

---

## 🧑‍💻 Who Am I?

With a background as a **Technical Artist** and a **Master's degree in Computer Science** with a specialization in **Artificial Intelligence**, I focus on **gameplay programming** and the development of interactive systems.

My strong creative instincts, combined with solid technical expertise, enable me to craft immersive, dynamic, and intelligent experiences. I love blending logic with aesthetics to bring captivating worlds to life. I am also very comfortable with tools like Photoshop, which I use to create detailed visual assets and clear prototypes that communicate ideas effectively.

I am particularly passionate about integrating **Large Language Models (LLMs)** into games to make interactions more natural, unpredictable, and engaging. My Master's thesis specifically explored how these technologies can enhance narrative depth and interactivity in role-playing games.

### 🎓 My Journey

*   **Jun 2025**: Graduated with a Master's degree in Computer Science from the Catholic University of Louvain-La-Neuve (UCLouvain).
*   **Sept-Dec 2024**: Worked as an IT tutor for around forty first-year bachelor's students in IT at UCLouvain.
*   **Jun 2022**: Graduated as a Technical Artist from the Haute Ecole Albert-Jacquard (HEAJ).
*   **Feb-May 2022**: Completed an internship as a Technical Artist at Appeals Studio, working on the development of the game *Outcast 2*.
*   **Nov 2019 - Jun 2025**: Worked as a student employee at "La Sucrerie," where I gained significant experience in customer contact and service.

### 🛠️ Tools & Technologies

I am proficient in a wide array of tools and programming languages that bridge the gap between engineering and art:
*   **Languages**: C#, C++, Python, Java
*   **Game Engines**: Unity, Unreal Engine 4/5, GDevelop
*   **Art & Video**: Photoshop, Premiere Pro, Embergen
*   **Version Control & IDEs**: Git, Perforce, Visual Studio, IntelliJ

---

## 🎮 Game Projects

Here is a detailed breakdown of all my game development projects, covering both the technical implementations and the intended player experience.

### 1. The Human Variable (2025)
*   **Context**: Made alone in 2 weeks. Core tech: LLMs. Unreal Engine 5 (C++).
*   **The Experience**: This is a **reverse Turing test**. You are the only human locked in a room with four androids. Each round, an open-ended question is asked, and everyone (including you) answers aloud. Afterwards, everyone votes on who they think is the human. The goal is to survive by convincing the machines that you are one of them. You must think like a machine, speak like an AI, and avoid elimination.
*   **The Tech**: The four androids are powered by different real-time LLMs (GPT, Mistral, LLaMA, and Gemma). There are no scripts. Both text and voice are generated on the fly, meaning every playthrough is unique and unpredictable.

### 2. RPG with LLM (Master's Thesis - 2025)
*   **Context**: Made by 2 people over 5 months. Core tech: LLMs. Unity (C#). Awarded the 2025 IEEE/ICTEAM Best Master's Thesis Award.
*   **The Experience**: This explores how LLMs can generate dynamic, immersive, and highly personalized RPG adventures. Players can choose any universe they want—a medieval D&D world, a Star Wars epic, or an absurd SpongeBob adventure. The AI adjusts the story, characters, and events to perfectly match the selected tone.
*   **The Tech**: The AI acts as a real-time Game Master, adapting to player choices and keeping the story consistent. We also integrated AI image generation to visually illustrate key locations, characters, and narrative moments. We conducted extensive measurements on query response times, prompt influence techniques, LLM costs, and system limitations (like gender stereotypes).

### 3. Who is Lying? (In Progress - Jan 2026)
*   **Context**: Solo project currently in development. Unity 6.
*   **The Experience**: A narrative investigation game where you interrogate suspects using your own voice. You can ask any question without predefined dialogue paths. Your goal is to break the suspects, uncover inconsistencies, and figure out who set a cabin on fire.
*   **The Tech**: The game uses seamless Speech-to-Text (STT) for player input. Suspects are powered by an evolving Retrieval-Augmented Generation (RAG) system, giving them unique memories and the ability to decide their own line of defense (lie, contradict, or confess). A stress meter updates in real-time based on your interrogation pressure. The entire loop (STT -> LLM -> Text-to-Speech) runs in under 2 seconds. A smart journal automatically extracts and archives key info from the dialogues.

### 4. Kart Color (2025)
*   **Context**: Solo quick project made in 7 days. Unity 6.
*   **The Experience**: A fast-paced arcade game where you drive a kart in a circular arena to paint more surface area than your opponent within a strict time limit. It features a vibrant aesthetic and energetic soundtrack, offering both a solo mode (against a bouncing AI ball) and a local multiplayer mode (21 quick 10-second rounds).
*   **The Tech**: Highlights my skills in rapid gameplay programming, game design, UI/UX, and integrating diverse systems including AI, multiplayer mechanics, and a shop system (collecting coins to unlock karts and colors).

### 5. Loki (Bachelor's Thesis - 2022)
*   **Context**: Team of 8 people, 3 months. My roles: Technical Artist, UI Designer. Unreal Engine 4.
*   **The Experience**: Set in 1350 Danelawgham, you play as Signy, an orphan who becomes the champion of the trickster god Loki. She possesses the power of shapeshifting, allowing her to take the form of anyone or any creature whose personal item she possesses. You must use strength (as a guard), stealth (as a cat), and charm to infiltrate, manipulate nobles, and uncover Signy's past.
*   **The Tech**: A narrative-driven game blending infiltration and identity theft. I handled the technical art and UI design to ensure smooth transitions and clear player feedback during shapeshifting and stealth mechanics.

### 6. Diablo III Cyberpunk Remake (2021)
*   **Context**: Solo project made in 2 months during my second year of game design school. Unity.
*   **The Experience**: A complete cyberpunk reimagining of Diablo III. It features high-octane combat, puzzles, and futuristic powers.
*   **The Tech**: I built the gameplay, VFX, animations, and HUD entirely from scratch. Every visual effect (explosions, attacks, dashes, summons) was designed by hand to bring the futuristic gameplay to life. I acted as Tech Artist, UI Designer, Animator, VFX Designer, Sound Designer, Level Designer, and Game Designer.

### 7. Stalk and Ruin (2021)
*   **Context**: Game Jam project made in 4 days with a team of 5. Unreal Engine 4.
*   **The Experience**: A first-person detective game set in 70s-80s New York. You play a private investigator perched on a rooftop, armed only with a camera. You must zoom and scan nearby windows to spot targets from a shady list in compromising situations before you run out of film or time.
*   **The Tech**: I learned UE4 on the fly for this project. I handled everything on the technical side, including Blueprints, camera logic, UI, and sound design.

### 8. One Way Trip (2021)
*   **Context**: Game Jam project made in 3 days with a team of 6. Unity.
*   **The Experience**: A dark, twisted, and absurdly funny road trip game where you play a taxi driver trying to eliminate your passenger without raising suspicion. You must search the car, combine everyday objects with absurd physics, and improvise deadly tools, all while keeping up a casual conversation.
*   **The Tech**: I managed the entire tech side: gameplay integration, UI, animation setup, and interactions.

---

## 💻 IT Projects

Beyond game development, my computer science background has led me to tackle several complex software and engineering challenges.

### 1. Constraint Programming (2024)
*   **Description**: Modeled and solved complex instances of a logistics and transport problem utilizing constraint programming methodologies. This involved deep algorithmic thinking and optimization.

### 2. Compiler (2024)
*   **Description**: Developed a complete compiler from scratch. It transforms an invented language into Java bytecode, handling everything from lexical analysis of the source code to translating it into executable machine instructions.

### 3. Machine Learning (2024)
*   **Description**: Addressed a binary classification task using a real, messy industrial dataset spread across multiple CSV files (high variable count, low observation count). We were free to implement and evaluate various machine learning techniques to clean the data and build accurate models.

### 4. Car Damage App - RepairPal (2023)
*   **Description**: Worked on a software engineering project (for NRB) to create an application that enables quick damage detection and repair cost estimations following car accidents, designed to assist both everyday users and insurance companies.

### 5. SRV6 - Traffic Engineering (2023)
*   **Description**: Utilized Containerlab and FRRouting to simulate a 14-node network topology. I assessed and optimized Traffic Engineering by injecting artificial delays to route data efficiently across various paths in the network.

### 6. Text Preacher (2023)
*   **Description**: Created a text generator trained on Twitter (X) data. The technical challenge was building this using the Oz programming language, which enforces strict functional paradigms (no loops, single assignment only).

---
*End of document.*