import { updateScore } from "../gameState.js";
import { startTheGame } from "../../createAndRenderGame.js";
import { initSkoker } from "../gameObjects/skoker.js";
import { randomInteger } from "../random.js";
import { renderGameHeader } from "./header.js";

function cleanupGameElements(gameState) {
  gameState.arrClouds = [];
  document.querySelectorAll('[data-game-element]').forEach(el => el.remove());
  initSkoker(gameState);

  document.querySelectorAll('.mobile-controls, .gameover-controls')
    .forEach(el => el.style.display = 'none');
}

function handleGameOverAction(gameState, action) {
  const { audio, game } = gameState;
  
  audio.death.pause();
  audio.death.currentTime = 0;
  updateScore(gameState, 0);
  
  cleanupGameElements(gameState);
  
  if (action === 'gotoToWorldsMenu') {
    game.currentScreen = 'worldsMenu';
    clearInterval(game.lntervalledUpdateGame);
    renderGameHeader(gameState);
    // Показать меню миров
    document.querySelector('.worldsMenu').style.display = 'block';
  } else if (action === 'restart') {
    game.currentScreen = 'gameWorld';
    startTheGame(gameState);
  }
}

function handleGameOverKeys(event, gameState) {
  if (event.code === 'Escape') {
    handleGameOverAction(gameState, 'gotoToWorldsMenu');
  } else if (event.code === 'KeyR') {
    handleGameOverAction(gameState, 'restart');
  }
}

// ⚠️⚠️⚠️ Объединить handleGameOverKeys и handleGameOverAction, но тогда
// в startTheGame и, тем более, в createGameOverControls надо
// будет что-то мудрить
// function handleGameOverKeys(event, gameState) {
//   const { audio, game } = gameState;
  
//   // Общие действия
//   audio.death.pause();
//   audio.death.currentTime = 0;
//   game.score = 0;
//   cleanupGameElements(gameState);
  
//   // Действие по клавише
//   if (event.code === 'Escape') {
//     game.currentScreen = 'worldsMenu';
//     clearInterval(game.lntervalledUpdateGame);
//     document.querySelector('.worldsMenu').style.display = 'block';
//   } else if (event.code === 'KeyR') {
//     game.currentScreen = 'gameWorld';
//     startTheGame(gameState);
//   }
// }

function createGameOverControls(gameState) {
  const { ui, game } = gameState;
  
  // ⚠️⚠️⚠️ (наверное логичнее убрать восклицательный в !game.isGameOver)
  if (ui.gameoverControls && !game.isGameOver) {
    ui.gameoverControls.style.display = 'none';
    return;
  }
  
  ui.gameoverControls = document.createElement('div');
  ui.gameoverControls.className = 'gameover-controls';
  ui.gameoverControls.innerHTML = `
    <button class="gameover-btn gotoToWorldsMenu-btn"
      data-action="gotoToWorldsMenu">Вернуться</button>
    <button class="gameover-btn restart-btn"
      data-action="restart">Рестарт</button>
  `;
  ui.gameoverControls.style.display = 'none';
  
  // Работает везде (на мобилках просто touch конвертируется в click):
  ui.gameoverControls.addEventListener('click', (e) => {
    const btn = e.target.closest('.gameover-btn');
    if (btn) handleGameOverAction(gameState, btn.dataset.action);
  });
  
  document.body.appendChild(ui.gameoverControls);
}

function gameOver(gameState) {
  const { physics, game, ui, audio, cloudsSettings } = gameState;
  
  game.isGameOver = true;
  clearInterval(physics.lntervalledUpdateGame);
  cloudsSettings.cloudId = 0;
  ui.gameoverControls.style.display = 'flex';
  
  // play new(!) random death sound
  if (audio.isSoundOn && audio.isDeathSoundOn) {
    let newSrc;
    do {
      newSrc = `./resources/sounds/death/${audio
        .deathSounds[randomInteger(0, audio.deathSounds.length - 1)]}`;
    } while (audio.death.src === newSrc);

    audio.death.src = newSrc;
    audio.death.addEventListener('canplaythrough', () => {
      audio.death.play().catch(e => console.error('Death sound failed:', e));
    }, { once: true });
  }
}

export { createGameOverControls, handleGameOverKeys,
  handleGameOverAction, gameOver };
