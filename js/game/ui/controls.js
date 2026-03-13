import { updateScore } from "../gameState.js";
import { handleGameOverKeys } from "./gameover.js";

function handleMovement(gameState, action) {
  const { physics, game, skoker, audio } = gameState;

  if (action === 'left') {
    physics.velocityX = -physics.shiftX;
    skoker.image = skoker.sprites.skokerLeft;
  } else if (action === 'right') {
    physics.velocityX = physics.shiftX;
    skoker.image = skoker.sprites.skokerRight;
  } else if (action === 'jump') {
    // pointsForJumpDrawIndex = initialPointsForJumpDrawIndex;
    if (game.score >= game.pointsForJump) {
      physics.velocityY = physics.initialVelocityY;
      updateScore(gameState, -game.pointsForJump);
      // game.score -= game.pointsForJump;
      // pointsForJumpMessage = `-${pointsForJump}`;
      
      if (audio.isSoundOn && audio.isJumpSoundOn) {
        audio.airJump.currentTime = 0;
        audio.airJump.play().catch(e => console.error('Audio failed:', e));
      }
    } else {
      // ⚠️⚠️⚠️ доделать уведомление, мол, не хватает очков для прыжка
      // pointsForJumpMessage = `мало очков`;
    }
  }
}

function skokerControls(event, gameState) {
  event.preventDefault();
  let action = null;

  if (event.code === 'ArrowRight' || event.code === 'KeyD') {
    action = 'right';
  } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
    action = 'left';
  } else if (event.code === 'Space' || event.code === 'KeyW'
    || event.code === 'ArrowUp') {
    action = 'jump';
  }
  // Мобильные кнопки:
  else if (event.target.closest('.control-btn')) {
    action = event.target.closest('.control-btn').dataset.action;
  }
  
  if (action) {
    // ⚠️⚠️⚠️ проверить эту функцию (должна лежать в physics.js)
    handleMovement(gameState, action);
  }
}

function initControls(gameState) {
  let { ui, game } = gameState;

  // ⚠️⚠️⚠️ поменять название keydownListenerAdded
  // на что-то типа keydownListener
  if (!ui.keydownListenerAdded) {
    document.addEventListener('keydown', (event) => {
      if (game.currentScreen === 'gameWorld') {
        if (game.isGameOver) {
          handleGameOverKeys(event, gameState);
        } else {
          skokerControls(event, gameState);
        }
      }
    });
    ui.keydownListenerAdded = true;
  }
}

function createMobileControls(gameState) {
  const { ui } = gameState;
  
  if (ui.mobileControls) {
    ui.mobileControls.style.display = 'flex';
    return;
  }
  
  ui.mobileControls = document.createElement('div');
  ui.mobileControls.className = 'mobile-controls';
  ui.mobileControls.innerHTML = `
    <button class="control-btn left-btn" data-action="left">◀</button>
    <button class="control-btn jump-btn" data-action="jump">↑</button>
    <button class="control-btn right-btn" data-action="right">▶</button>
  `;
  
  document.body.appendChild(ui.mobileControls);

  ui.mobileControls.addEventListener('touchstart', (e) =>
    skokerControls(e, gameState), { passive: false });

  if (!window.mobileControlsListener) {
    window.mobileControlsListener = () => {
      ui.isMobile = /Android|iPhone|iPad|BlackBerry|IEMobile|Opera Mini/i
        .test(navigator.userAgent) || window.innerWidth <= 768;
      
      if (ui.mobileControls) {
        ui.mobileControls.style.display = ui.isMobile ? 'flex' : 'none';
      }
    };

    window.addEventListener('resize', window.mobileControlsListener);
    window.addEventListener('orientationchange', window.mobileControlsListener);
  }
}

export { initControls, createMobileControls };
