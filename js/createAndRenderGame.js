import { createGameState, updateScore } from './game/gameState.js';
import { renderGameHeader } from './game/ui/header.js';
import { initControls, createMobileControls } from './game/ui/controls.js';
import { initSkoker, renderSkoker } from './game/gameObjects/skoker.js';
import { fillingArrClouds, renderClouds } from './game/gameObjects/clouds.js';
import { updateGame } from './game/physics.js';
import { createGameOverControls } from './game/ui/gameover.js';
import worlds from './game/worlds.js';

function startTheGame(gameState) {
  const { physics, game, ui } = gameState;
  let { arrClouds } = gameState;
  
  // Сброс игрового состояния
  game.isGameOver = false;
  updateScore(gameState, 0);
  physics.velocityX = physics.initialVelocityX;
  physics.velocityY = physics.initialVelocityY;
  
  // Мобильная проверка
  ui.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent) || window.innerWidth <= 768;
  if (ui.isMobile) {
    createMobileControls(gameState);
  }
  
  renderGameHeader(gameState);
  
  // Игровые объекты
  arrClouds = [];
  fillingArrClouds(gameState);
  renderClouds(gameState);
  initSkoker(gameState);
  renderSkoker(gameState);
  
  createGameOverControls(gameState);
  
  // Запуск игрового цикла
  physics.lntervalledUpdateGame = setInterval(
    () => updateGame(gameState), physics.lntervalledUpdateFPS
  );
}

function createAndRenderGame(screenWidth, screenHeight) {
  const gameState = createGameState(screenWidth, screenHeight);
  
  // Инициализация header и controls'ов
  renderGameHeader(gameState);
  initControls(gameState);
  
  // Обработчик клика по миру
  const menuWrapper = document.querySelector('.worldsMenu');
  menuWrapper.addEventListener('click', (event) => {
    const button = event.target.closest('.menuWorldButton');
    if (!button) return; // клик по пустому месту внутри Меню миров

    // Запуск игры
    gameState.game.currentScreen = 'gameWorld';
    gameState.cloudsSettings.chosenColor = worlds[
      Array.from(button.classList).find(c => c.startsWith('world'))
    ].cloudsColor;
    
    menuWrapper.style.display = 'none'; // скрываем Меню миров
    startTheGame(gameState);
  });
}

export { startTheGame, createAndRenderGame };
