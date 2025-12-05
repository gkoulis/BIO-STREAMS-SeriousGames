Changelog
===

# v0.1.14-SC.1-... Friday 05 December 2025

- Removed `venv`
- Removed `__pycache__`
- Python .gitignore

# v0.1.13 Sunday 12 October 2025

Added automated translations.

# v0.1.12 Sunday 31 August 2025

- Set up server for https://marketplace.bio-streams.eu/
- Icon sizes in Food Ninja are now calculated dynamically based on screen type (mobile, tablet, desktop).

# v0.1.11 Sunday 31 August 2025

- Added new icons for Food Ninja.
- Integrated full Food Ninja content for school pilots.

# v0.1.10 Saturday 30 August 2025

- Added new icons for Food Ninja. 
- Added common content item list for Food Ninja. 
- Phaser improvements (use icon scale instead of enforcing square items).

# v0.1.9 Saturday 30 August 2025

- NTUA VM setup: 147.102.33.206. 
- Removed videos from Let's Move; added new images and a demo video. 
- Let's Move, Food Treasure: added translation entries for bg, da, nl, pt (currently English only; needs automatic translation). 
- Added Matomo script in index.html.

# v0.1.8 Monday 11 August 2025

- Keycloak integration.

# v0.1.7 Thursday 31 July 2025

- Added new languages.
- Added new translations.
- Added content for pilots. 
- Added legacy Home view. 
- Added cache version in JSON. 
- SC.

# v0.1.6 Wednesday 16 July 2025

- Added new content. 
- UI fixes.

# v0.1.5 Sunday 04 May 2025

- Added dependency: qrcode.vue. 
- Added view to print all QR images for all themes/levels (Food Treasure). 
- Fixed bug in Food Treasure QR scanning. 
- Improved Food Treasure QR scanning.

# v0.1.4 Sunday 04 May 2025

- Introduced initial implementation of Food Treasure (with QR scanning and an AR-like approach for showing the revealed treasure). 
- Added content and translations for Food Treasure. 
- Released resources when exiting the Food Ninja phase component. 
- Significantly improved movement of Food Ninja items (no sticking or freezing). 
- Improved slicing movement and fixed issue where items could get stuck when the mouse/pointer was released. 
- Made theme-level items reusable across all languages: define them once in the common file and the component automatically loads them into all localized files. 
- Added dependency: vue-qrcode-reader. 
- Minor UX improvement: added emojis to “Go!” buttons in theme views. 
- HomeView changes: added notice about the free mode of the Food Ninja and Food Quiz serious games.

# v0.1.3 Sunday 27 April 2025

- Added fruit and vegetable images.
- Added fruit and vegetable translations.
- Added content and translations for Food Quiz story mode.
- Added content and translations for Food Ninja story mode.
- Introduced initial implementation of Food Quiz Story Mode.

# v0.1.2 Sunday 27 April 2025

- Renamed directory sr-foodquiz to sr-foodquizfreemode. 
- Minor change in Game.vue.

# v0.1.1 Sunday 27 April 2025

- Renamed Food Quiz to Food Quiz Free Mode.

# v0.1.0 Sunday 27 April 2025

- Git repository initialization.

- Introduced initial implementation of Food Ninja Story Mode (pending translations and items).

# Saturday 29 March 2025

- Implemented translation system (for both static and dynamic content). 
- Added language selection on the Home view. 
- Food Ninja now has two modes: free mode and story mode. 
- Added boilerplate for Food Treasure. 
- Added boilerplate for Food Ninja Story Mode.

# Previous Versions

The release history for November 2024, December 2024, January 2025, and February 2025 has been intentionally omitted from this changelog. 
During this period, the project was focused on internal prototyping, infrastructure work, and minor non–user-facing fixes that did not result in distinct public versions. 
Only major, user-visible milestones starting from March 2025 are documented here.
