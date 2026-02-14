import { renderSkoker } from './gameObjects/skoker.js';
import { renderClouds, addNewClouds, cleanupOldClouds, detectColor }
  from './gameObjects/clouds.js';
import { gameOver } from './ui/gameover.js';

function detectCollision(cloud, gameState) {
  const { skoker } = gameState;
  if (cloud.collision) {
    return skoker.x <= cloud.x + cloud.width &&    // on x: sk's TopL corner < cl's TopR corner
           skoker.x + skoker.width >= cloud.x &&   // on x: sk's TopR corner < cl's TopL corner
           skoker.y <= cloud.y + cloud.height &&   // on y: sk's TopL corner < cl's BottomR corner
           skoker.y + skoker.height >= cloud.y;    // on y: sk's TopR corner < cl's BottomL corner
  } else return false;
}

function shiftingGreenClouds(gameState) {
  const { cloudsSettings, screen } = gameState;
  const leftBound = cloudsSettings.widthPadding;
  const rightBound = screen.width - cloudsSettings.widthPadding;
  
  for (const cloud of gameState.arrClouds) {
    if (cloud.color !== 'green') continue;
    
    if (cloud.moveDirectionX === 'right') {
      if (cloud.x + cloud.width + cloud.moveSpeedX <= rightBound) {
        cloud.x += cloud.moveSpeedX;
      } else {
        cloud.moveDirectionX = 'left';
        cloud.x -= cloud.moveSpeedX;
      }
    } else if (cloud.moveDirectionX === 'left') {
      if (cloud.x - cloud.moveSpeedX >= leftBound) {
        cloud.x -= cloud.moveSpeedX;
      } else {
        cloud.moveDirectionX = 'right';
        cloud.x += cloud.moveSpeedX;
      }
    } else {
      throw new Error('shiftingGreenClouds: invalid moveDirectionX');
    }
  }
}

function jumpingFromCloud(gameState) {
  const { physics } = gameState;
  
  for (const cloud of gameState.arrClouds) {
    if (detectCollision(cloud, gameState) && physics.velocityY >= 0) {
      detectColor(cloud, gameState);
      renderClouds(gameState);
      break; // Только одно столкновение за кадр
      // (если каким-то чудом 2+ облака, я не знаю, друг в друге будут)
    }
  }
}

function updateGame(gameState) {
  const { screen, physics, skoker, arrClouds } = gameState;
  
  // Game Over проверка
  if (skoker.y > screen.height) {
    gameOver(gameState);
    return;
  }
  
  // Движение по X (с телепортом на края экрана)
  skoker.x += physics.velocityX;
  if (skoker.x > screen.width) {
    skoker.x = 0;
  } else if (skoker.x + skoker.width < 0) {
    skoker.x = screen.width;
  }

  // Гравитация + движение по Y
  physics.velocityY += physics.gravity;
  
  if (physics.velocityY < 0) {
    // compensative scroll - shift 2 times only Clouds, because
    // in another way Skoker can jump out from top of screen
    if (skoker.y < screen.height * 0.4) {
      for (const cloud of arrClouds) {
        cloud.y -= physics.velocityY * 2;
      }
    // normal scroll - shift on Y clouds & skoker
    } else if (skoker.y < gameState.screen.height) {
      skoker.y += physics.velocityY;
      for (const cloud of arrClouds) {
        cloud.y -= physics.velocityY;
      }
    }
  // falling only Skoker (shift him down on Y)
  } else skoker.y += physics.velocityY;
  
  shiftingGreenClouds(gameState);
  
  jumpingFromCloud(gameState);
  
  // clear downed clouds + update Score
  cleanupOldClouds(gameState);
  
  addNewClouds(gameState);
  
  renderClouds(gameState);
  renderSkoker(gameState);
}

export { updateGame };
