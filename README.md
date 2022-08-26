# HKUR Website
## Tools used
- Three.js
- TypeScript
- Webpack
- Tailwind CSS
- Animate CSS (CDN) https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css

## How to transpile the scripts
npm install webpack webpack-cli tailwindcss<br>
cd scripts<br>
npx webpack<br>
npx tailwindcss -i ../styles/main.css -o ../styles/bin/styles.css
