import renderWorlds from './renderWorlds.js';
import { createAndRenderGame } from './createAndRenderGame.js';

let arrScreens = ['worldsMenu', 'gameWorld'];
let currentScreen = arrScreens[0];

function init() {
  const screenHeight = window.innerHeight;
  const screenWidth = (window.innerHeight * 0.5);

  document.documentElement.style
    .setProperty('--window-height',`${screenHeight / 1.25}px`);
  document.documentElement.style
    .setProperty('--window-width', `${screenWidth}px`);

  // логика инициализации платформ, игрока и т.п.
  renderWorlds(currentScreen);
  createAndRenderGame(screenWidth, screenHeight, currentScreen);
}

window.addEventListener('load', init);
// window.addEventListener('resize', () => {
//   // при желании — пересчитать размеры/масштаб
// });

// window.addEventListener('DOMContentLoaded', () => {
//   const screenWidth = Math.floor(window.innerWidth * 1.25)
//   const screenHeight = Math.floor(window.innerHeight * 1.25)
// });
