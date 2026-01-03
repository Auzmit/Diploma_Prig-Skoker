import renderWorlds from './renderWorlds.js';
import { createAndRenderClouds } from './createAndRenderClouds.js';

let arrScreens = ['worldsMenu', 'gameWorld'];
let currentScreen = arrScreens[0];

function init() {
  // console.log(currentScreen);
  // currentScreen = arrScreens[1];
  // console.log(currentScreen);
  const screenHeight = window.innerHeight;
  const screenWidth = (window.innerHeight * 0.5);
  // console.log('innerHeight:', screenHeight);
  // console.log('innerWidth:', screenWidth);

  document.documentElement.style
    .setProperty('--window-height',`${screenHeight / 1.25}px`);
  document.documentElement.style
    .setProperty('--window-width', `${screenWidth}px`);

  // логика инициализации платформ, игрока и т.п.
  renderWorlds(currentScreen);
  createAndRenderClouds(screenWidth, screenHeight, currentScreen);
  // console.log(111, currentScreen);
}

window.addEventListener('load', init);
// window.addEventListener('resize', () => {
//   // при желании — пересчитать размеры/масштаб
// });

// window.addEventListener('DOMContentLoaded', () => {
//   const screenWidth = Math.floor(window.innerWidth * 1.25)
//   const screenHeight = Math.floor(window.innerHeight * 1.25)
// });
