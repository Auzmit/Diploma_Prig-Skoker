import { randomInteger, randomLeftOrRight } from './random.js';
import renderWorlds from './renderWorlds.js';
import worlds from "./worlds.js";
import detectCollision from './detectCollision.js';
import removeCloud from './removeCloud.js';

const clouds = {};
const cloudsColors = ['yellow', 'grey', 'green', 'red', 'black', 'blue'];
cloudsColors.forEach((color) => {
  clouds[color] = {
    brokesAfterJumps: 'never', // 1, 2, never
    movement: 'no', // 'yes', 'no'
    repulsiveForce: 'no', // 'explosion', 'trampoline', 'no'
    mirrorTP: 'no', // 'yes', 'no
  }
});
clouds.yellow.repulsiveForce = 'trampoline';
clouds.grey.brokesAfterJumps = '2';
clouds.green.movement = 'yes';
clouds.red.repulsiveForce = 'explosion';
clouds.black.brokesAfterJumps = '1';
clouds.blue.mirrorTP = 'yes';

let cloudsWhiteImages = [];
for (let i = 1; i <= 6; i += 1) {
  cloudsWhiteImages.push(
    `./resources/images/clouds/cloud-right-${i}.png`);
  cloudsWhiteImages.push(
    `./resources/images/clouds/cloud-left-${i}.png`);
};
let cloudsColoredImages = [];
for (let cloudColor of cloudsColors) {
  cloudsColoredImages.push(
    `./resources/images/clouds/colored/cloud-right-1-${cloudColor}.png`);
  cloudsColoredImages.push(
    `./resources/images/clouds/colored/cloud-left-1-${cloudColor}.png`);
};
let arrClouds = [];

// score init
let score = 0;
let pointsForJump = 10;
let pointsForJumpMessage = '';
let pointsForJumpDrawIndex = 0;
let initialPointsForJumpDrawIndex = 18;
let audioAirJump = new Audio();
  audioAirJump.src = './resources/sounds/puk_air-jump.mp3';
  // audioAirJump.src = './resources/sounds/trampoline_jumps/0.mp3';
let audioClick = new Audio();
  audioClick.src = './resources/sounds/click_button.mp3';

// icons (sound & info)
  // common variables
// let iconWidth = screenWidth*0.07;
// let iconHeight = iconWidth;
// let iconOffset = screenWidth*0.02;
  // sound (unique variables)
let imageSound = new Image();
  imageSound.src = './resources/images/icons/sounds/icon_sound-on.png';
// let iconSoundPosX = screenWidth - iconOffset - iconWidth;
// let iconSoundPosY = iconOffset;
let isSoundOn = true;
  // info (unique variables)
let imageInfo = new Image();
  imageInfo.src = './resources/images/icons/icon_info.png';
// let iconInfoPosX = screenWidth - iconOffset - iconWidth;
// let iconInfoPosY = iconOffset*2 + iconHeight;

// audio
  // new random death sound
let newAudioDeathSrc = '';
  // arr audio death
let audioDeath = new Audio();
let arrAudioDeath = [
  '-blin-zachem-ya-syuda-prishel.mp3',   
  'ay-menya-snaypnuli-v-polte.mp3',      
  'bolno-v-noge.mp3',
  'brue.mp3',
  'da-idi-tyi.mp3',
  'daladna.mp3',
  'davai-po-novoi-misha.mp3',
  'eralash.mp3',
  'eto-fiasko-bratan.mp3',
  'golos-beshenogo-gitlera-iz-mema-kotoryiy-nesoglasen.mp3',
  'grustnaya-violonchel.mp3',
  'kto-kuda-a-ya-po-delam.mp3',
  'ne-nihya.mp3',
  'nepravilno-poprobuy-esch-raz.mp3',    
  'nope.mp3',
  'nu-che-narod-pognali1.mp3',
  'nu-naher.mp3',
  'o-kurva.mp3',
  'pojili-i-hvatit.mp3',
  'vot-eto-povorot.mp3',
  'vsego-horoshego.mp3',
  'ya-maslinu-poymal.mp3'
];

function createAndRenderGame(screenWidth, screenHeight, currentScreen) {
  // physics and game init
  let initialVelocityX = 0;
  let velocityX = initialVelocityX;
  // let inialShiftSkokerX = screenWidth/120;
  let shiftSkokerX = screenWidth/105; // 120 - original
  let initialVelocityY = -screenWidth/71; // 60 => -10
  // let initialVelocityY = -screenWidth/50; // 60 => -10
  let velocityY = initialVelocityX;
  let initialGravity = screenWidth/1500; // 1500 => 0.4
  let gravity = initialGravity;
  let lntervalledUpdateGame;
  let lntervalledUpdateFreq = 1000 / 60;
  let isGameOver = false;

  // skoker init
  let skoker;
  const skokerWidth = screenWidth/13; // 13 => 46,1538...
  const skokerHeight = skokerWidth;
  const skokerLeftImage = Object.assign(new Image(),
    { src: './resources/images/head-left-stroke.png' });
  const skokerRightImage = Object.assign(new Image(),
    { src: './resources/images/head-right-stroke.png' });
  
  function initSkoker() {
    let skokerX = screenWidth/2 - skokerWidth/2;
    let skokerY = screenHeight*0.9 - skokerHeight;
    skoker = {
      image: skokerRightImage,
      x: skokerX,
      y: skokerY,
      width: skokerWidth,
      height: skokerHeight,
      domElement: null
    };
  }

  let cloudWidth = screenWidth / 5;
  let cloudHeight = screenHeight / 35.7;
  let widthPadding = screenWidth * 0.02;
  // const coordsScreenWidth = screenWidth / 1.25;
  // const coordsScreenHeight = screenHeight / 1.25;
  // console.log('createAndRenderGame:', screenWidth, screenHeight);
  
  // ⚠️⚠️⚠️
  function coloringCloudAndImages(cloud, chosenCloudsColor) {
    if (chosenCloudsColor === 'multiColor') {
      if (randomInteger(1, 100) >= 66) { // цветных должно быть 2/3
        // console.log(111, cloud.image);
        cloud.image.src = cloudsColoredImages[
          randomInteger(0, cloudsColoredImages.length - 1)];
        cloud.color = cloud.image.src.split('-').pop().split('.')[0]; // white
      } else {
        cloud.image.src = cloudsWhiteImages[
          randomInteger(0, cloudsWhiteImages.length - 1)];
        cloud.color = 'white';
      };
    } else {
      // ⚠️⚠️⚠️ исправить прямой путь на cloudsColoredImages
      cloud.image.src =
        `./resources/images/clouds/colored/cloud-left-1-${chosenCloudsColor}.png`;
      cloud.color = chosenCloudsColor;
    };
    return cloud;
  }

  // ⚠️⚠️⚠️
  function newCloud(chosenCloudsColor) {
    let cloudX = 0;
    let cloudY = 0;
    if (arrClouds.length === 0) {
      cloudX = (screenWidth - cloudWidth) / 2;
      cloudY = screenHeight - cloudHeight;
    } else {
     // X-coordinate is calculated so that cloud has at least small offset from borders
      cloudX = randomInteger(widthPadding,
        screenWidth - widthPadding - cloudWidth);
      // Y-coord calculating with (specific + random space) from previous cloud.y
      cloudY = arrClouds[arrClouds.length - 1].y - screenHeight * 0.125
        - randomInteger(0, screenHeight * 3 / 42);
    }

    let cloud = { 
      collision: true,
      color: '',
      x: cloudX,
      y: cloudY,
      width: cloudWidth,
      height: cloudHeight,
      image: new Image(),
      domElement: null  // ← DOM элемент будет здесь
    };
    // console.log('newCloud', cloud);
    
    coloringCloudAndImages(cloud, chosenCloudsColor);
    return cloud;
    
    // ⚠️⚠️⚠️ addMovementToGreenClouds(cloud, shiftCloudX);
  }
  
  function fillingArrClouds(chosenCloudsColor) {
    if (arrClouds.length === 0) {
      const firstCloud = newCloud(chosenCloudsColor);
      arrClouds.push(firstCloud);
    }
      
    while (arrClouds[arrClouds.length - 1].y >= 0 - cloudHeight * 3) {
      const newCloudObj = newCloud(chosenCloudsColor);
      arrClouds.push(newCloudObj);
    }
  }

  function renderClouds(arrClouds) {
    for (let i = 0; i < arrClouds.length; i++) {
      const iCloud = arrClouds[i];
      
      if (!iCloud.element) {
        iCloud.element = document.createElement('img');
        iCloud.element.src = iCloud.image.src;
        
        Object.assign(iCloud.element.style, {
          position: 'absolute',
          width: iCloud.width + 'px',
          height: iCloud.height + 'px',
          objectFit: 'cover',
          filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))'
        });
        
        document.body.appendChild(iCloud.element);
      }

      iCloud.element.style.left = iCloud.x + 'px';
      iCloud.element.style.top = iCloud.y + 'px';


      // const iCloudImg = document.createElement('img');
      // iCloudImg.src = iCloud.image.src;
      
      // Object.assign(iCloudImg.style, {
      //   position: 'absolute',
      //   left: iCloud.x + 'px',
      //   top: iCloud.y + 'px',
      //   width: iCloud.width + 'px',
      //   height: iCloud.height + 'px',
      //   objectFit: 'cover',  // масштабирует как background-size: cover
      //   filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))'  // ✅ Тень от краёв!
      // });
      
      // document.body.appendChild(iCloudImg);
    }
  }

  // setInterval(() => {
  //   arrClouds.forEach(cloud => cloud.y += 1);
  //   renderClouds(arrClouds);
  // }, 16);  // ~60 FPS

  // Выбранный мир
  const menuWrapper = document.querySelector('.worldsMenu');
  menuWrapper.addEventListener('click', (event) => {
    const button = event.target.closest('.menuWorldButton');
    if (!button) return; // клик по пустому месту внутри Меню миров

    currentScreen = 'gameWorld';
    // console.log(222, currentScreen);
    const chosenWorldClass = Array.from(button.classList)
      .find(currClass => currClass.startsWith('world'));
    // console.log(chosenWorldClass);
    
    menuWrapper.style.display = 'none'; // скрываем Меню миров

    const chosenCloudsColor = worlds[chosenWorldClass].cloudsColor;
    console.log(chosenCloudsColor);
    
    // skoker render
    function renderSkoker(skoker) {
      if (!skoker.element) {
        skoker.element = document.createElement('img');
        skoker.element.src = skoker.image.src;
        Object.assign(skoker.element.style, {
          position: 'absolute',
          // left: skoker.x + 'px',
          // top: skoker.y + 'px',
          width: skoker.width + 'px',
          height: skoker.height + 'px',
          objectFit: 'cover',  // масштабирует как background-size: cover
          filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))'  // ✅ Тень от краёв!
        });
        document.body.appendChild(skoker.element);
      }

      skoker.element.style.left = skoker.x + 'px';
      skoker.element.style.top = skoker.y + 'px';
    }

    
    function skokerControls(event) {
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        velocityX = shiftSkokerX;
        skoker.image = skokerRightImage;
      } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        velocityX = -shiftSkokerX;
        skoker.image = skokerLeftImage;
      // air jump
      } else if (event.code === 'Space' || event.code === 'KeyW'
        || event.code === 'ArrowUp') {
        pointsForJumpDrawIndex = initialPointsForJumpDrawIndex;
        if (score >= 10) {
          velocityY = initialVelocityY;
          score -= pointsForJump;
          pointsForJumpMessage = `-${pointsForJump}`;

          if (isSoundOn) {
            audioAirJump.currentTime = 0;
            audioAirJump.play();
          };
        } else {
          // pointsForJumpMessage = `нужно ${pointsForJump} очков`;
          pointsForJumpMessage = `мало очков`;
        }
      }
    };

    document.addEventListener('keydown', (event) => {
      if (currentScreen === 'gameWorld') {
        if (isGameOver) {
          if (event.code === 'Escape') {
            audioDeath.pause();
            audioDeath.currentTime = 0;
            clearInterval(lntervalledUpdateGame);
            // initWorldsMenu();
            Array.from(document.body.children).forEach(child => {
              if (child !== menuWrapper) {
                child.remove();
              }
            });
            menuWrapper.style.display = 'block';
            // renderWorlds(currentScreen);
          } else if (event.code === 'KeyR') {
            audioDeath.pause();
            audioDeath.currentTime = 0;
            startTheGame();
          }
        } else {
          skokerControls(event);
        }
      }
    });
    
    // ⚠️⚠️⚠️
    function updateGame() {
      function gameOver() {
        isGameOver = true;
        clearInterval(lntervalledUpdateGame);
        
        // let textSizeGameOver = screenWidth/11;
        // let textSizeOtherStrs = textSizeGameOver/1.5;
        // let textsEndOfGame = {
        //   gameOver: 'Игра окончена',
        //   RToRestart: '«R» - рестарт,',
        //   EscToMenu: '«Esc» - возврат в меню'
        // };

        if (isSoundOn) {
          // play new(!) random death sound
          do {
            newAudioDeathSrc = './resources/sounds/death/' +
              arrAudioDeath[randomInteger(0, arrAudioDeath.length - 1)];
          } while (audioDeath.src === newAudioDeathSrc);
          audioDeath.src = newAudioDeathSrc;
          // ждём пока звук загрузится и играем его только один раз
          audioDeath.addEventListener('canplaythrough', () => {
            audioDeath.play().catch(e => console.error('Play failed:', e));
          }, { once: true });
          // audioDeath.play();
        }
      };

      // console.log('updateGame');
      if (skoker.y > screenHeight) {
        gameOver();
      } else {
        skoker.x += velocityX;
        // jump from side to side of the screen
        if (skoker.x > screenWidth) {
          skoker.x = 0;
        } else if (skoker.x + skoker.width < 0) {
          skoker.x = screenWidth;
        };
      
        // shift skoker & all clouds little down:
        velocityY += gravity;
        if (velocityY < 0) {
          // hard-defined scroll - shift 2 times only clouds,
          // because skoker can jump out from top of screen
          if (skoker.y < screenHeight * 0.4) {
            for (const cloud of arrClouds) {
              cloud.y -= velocityY * 2;
            }
          // normal scroll - shift on Y clouds & skoker
          } else if (skoker.y < screenHeight) {
            skoker.y += velocityY;
            for (const cloud of arrClouds) {
              cloud.y -= velocityY;
            }
          }
        // shift on Y only skoker
        } else skoker.y += velocityY;

        // shift on X green clouds
        // for (const cloud of arrClouds) {
        //   if (cloud.color === 'green') {
        //     shiftXGreen(cloud);
        //   }
        // };
      

        function detectColor(skoker, cloud) {
          // normal jump
          velocityY = initialVelocityY;
          // init jump audio

          let audioDetectColor = new Audio();

          if (cloud.color === 'yellow') {
            velocityY = initialVelocityY * 2.2;
            console.log(velocityY);

            if (isSoundOn) {
              audioDetectColor.src = `./resources/sounds/trampoline_jumps/${randomInteger(1, 2)}.mp3`;
              audioDetectColor.play();
            }

          } else if (cloud.color === 'blue') {
            // mirroring clouds
            for (let currentCloud of arrClouds) {
              let cloudCenter = currentCloud.x + cloudWidth/2;
              if (cloudCenter >= screenWidth/2) {
                cloudCenter = screenWidth/2 - (cloudCenter - screenWidth/2);
              } else {
                cloudCenter = screenWidth/2 + (screenWidth/2 - cloudCenter);
              }
              currentCloud.x = cloudCenter - cloudWidth/2;
            };

            if (isSoundOn) {
              audioDetectColor.src = './resources/sounds/swipe.mp3';
              audioDetectColor.play();
            }

          } else if (cloud.color === 'grey') {
            // grey turns to black
            cloud.color = 'black';
            cloud.image.src = 
              `./resources/images/clouds/colored/cloud-${randomLeftOrRight()}-1-black.png`;

          } else if (cloud.color === 'black') {
            // disappearance Black clouds
            cloud.collision = false;
            cloud.color = 'transparent';
            cloud.image.src = './resources/images/clouds/transparent_1x1.png';

          } else if (cloud.color === 'red') {
            // explodes & disappear - farther skoker is from the center of the cloud,
            // harder kicks him away along X & turns him in direction which he is moving
            velocityY = initialVelocityY * 1.3;

            let xDistanceSkokerCloud = (skoker.x + skoker.width/2)
              - (cloud.x + cloud.width/2);
            let coeffShiftSkokerX = xDistanceSkokerCloud/(cloud.width/2);
            coeffShiftSkokerX *= 0.3;

            coeffShiftSkokerX += (coeffShiftSkokerX >= 0) ? 1 : -1;
            velocityX = shiftSkokerX * coeffShiftSkokerX;
            if (velocityX < 0) {
              skoker.image = skokerLeftImage;
            } else skoker.image = skokerRightImage;

            // cloud.image.src = './resources/images/clouds/transparent_1x1.png';
            // cloud.color = 'transparent';
            cloud.collision = false;

            if (isSoundOn) {
              audioDetectColor.src = './resources/sounds/explosion.mp3';
              audioDetectColor.play();
            }

          } else if (cloud.color === 'green') {
            // do nothing - the cloud drives itself anyway
          };
          
          if (isSoundOn) {
            if (!audioDetectColor.src) {
              audioDetectColor.src = './resources/sounds/trampoline_jumps/0.mp3';
              audioDetectColor.play();
            }
          }
        };

        // jump from the cloud & draw cloud's
        for (const cloud of arrClouds) {
          // if (rectsCollide(skoker, cloud) && velocityY >= 0) {
          if (detectCollision(skoker, cloud) && velocityY >= 0) {
            // jump's sound in f_detectColor
            detectColor(skoker, cloud, initialVelocityY,
              velocityY, velocityX, isSoundOn, randomInteger);
          }
        };

        while (arrClouds[0].y >= screenHeight) {
          removeCloud(arrClouds[0], arrClouds);
          arrClouds.push(newCloud(chosenCloudsColor));
          score += 1;
        };

        // score draw
        // context.fillStyle = 'black';
        // context.strokeStyle = 'white';
        // context.font = `bold ${screenWidth/12}px ${fontVerdana}`;
        // context.textAlign = 'left';
        // context.fillText(score, screenWidth/60, screenWidth/13);
        // context.lineWidth = 1.7;
        // context.strokeText(score, screenWidth/60, screenWidth/13);
        // context.lineWidth = 1;

        // skoker draw
        // context.drawImage(skoker.image, skoker.x,
        //   skoker.y, skoker.width, skoker.height);

        // pointsForJump draw
        // if (pointsForJumpDrawIndex > 0) {
        //   context.fillStyle = 'blue';
        //   context.font = `bold ${screenWidth/12}px ${fontTimesNewRoman}`;
        //   context.textAlign = 'center';
        //   context.fillText(pointsForJumpMessage, skoker.x + skoker.width/2,
        //     skoker.y + skoker.height*2);  
          
        //   pointsForJumpDrawIndex -= 1;
        // };

        // drawIconSound();
        // drawIconInfo();

        renderClouds(arrClouds);
        renderSkoker(skoker);
      }
    };

    function startTheGame() {
      isGameOver = false;
      velocityX = initialVelocityX;
      velocityY = initialVelocityY;

      // document.querySelector('body').innerHTML = '';
      Array.from(document.body.children).forEach(child => {
        if (child !== menuWrapper) {
          child.remove();
        }
      }); 

      arrClouds = [];
      fillingArrClouds(chosenCloudsColor);
      renderClouds(arrClouds);

      initSkoker();
      renderSkoker(skoker);

      lntervalledUpdateGame = setInterval(updateGame, lntervalledUpdateFreq);
    }
    startTheGame();
  });

  // ТЕСТ различного положения облачков:
  // document.addEventListener('keydown', (event) => {
  //   if (event.code === 'KeyR') {
  //     document.querySelector('body').innerHTML = '';
  //     arrClouds = [];
  //     fillingArrClouds('yellow');
  //     renderClouds(arrClouds);
  //   }
  // });
}

export { createAndRenderGame };
