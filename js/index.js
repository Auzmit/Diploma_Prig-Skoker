import { renderWorlds } from './renderWorlds.js';
import { createAndRenderClouds } from './renderClouds.js';

function init() {
  const screenHeight = Math.floor(window.innerHeight * 1.25);
  const screenWidth = screenHeight / 2;
  console.log('innerWidth:', screenWidth);
  console.log('innerHeight:', screenHeight);

  document.documentElement.style
  .setProperty('--window-height',`${screenHeight}px`);
  document.documentElement.style
    .setProperty('--window-width', `${screenWidth}px`);

  // твоя логика инициализации платформ, игрока и т.п.
  renderWorlds();
  createAndRenderClouds(screenWidth, screenHeight);
}

window.addEventListener('load', init);
// window.addEventListener('resize', () => {
//   // при желании — пересчитать размеры/масштаб
// });

// window.addEventListener('DOMContentLoaded', () => {
//   const screenWidth = Math.floor(window.innerWidth * 1.25)
//   const screenHeight = Math.floor(window.innerHeight * 1.25)
// });
