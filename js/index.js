import renderWorlds from './renderWorlds.js';
import { createAndRenderGame } from './createAndRenderGame.js';

let arrScreens = ['worldsMenu', 'gameWorld'];
let currentScreen = arrScreens[0];
let screenHeight = window.innerHeight;
let screenWidth = (window.innerHeight * 0.5);

function updateScreenSize() {
  if (window.innerHeight > window.innerWidth) {
    screenHeight = window.innerHeight;
    screenWidth = window.innerWidth;
  }
  // console.log('updateScreenSize');
}

function init() {
  document.body.innerHTML = '<div class="worldsMenu"></div>';
  // если экран вертикальный, то подстроиться под ширину
  updateScreenSize();

  // let screenHeight = 800;
  // let screenWidth = (window.innerHeight * 0.5);

  // document.documentElement.style
  //   .setProperty('--window-height',`${screenHeight / 1.25}px`);
  // document.documentElement.style
  //   .setProperty('--window-width', `${screenWidth}px`);

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

// ⚠️⚠️⚠️ Почему у меня работают изменения размеров элементов
// при смене ориентации/размеров экрана, если эти функции отключены?
window.addEventListener('resize', init);
window.addEventListener('orientationchange', init);
// window.addEventListener('resize', updateScreenSize);
// window.addEventListener('orientationchange', updateScreenSize);