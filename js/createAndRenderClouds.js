import randomInteger from './randomInteger.js';
import worlds from "./worlds.js";
import rectsCollide from './rectCollide.js';
import detectCollision from './detectCollision.js';
import detectColor from './detectColor.js';

const clouds = {};
const cloudsColors = ['white', 'yellow', 'grey', 'green', 'red', 'black', 'blue'];
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

let arrCloudsImages = [];
for (let i = 1; i <= 6; i++) {
  arrCloudsImages.push(`./resources/images/clouds/cloud-right-${i}.png`);
  arrCloudsImages.push(`./resources/images/clouds/cloud-left-${i}.png`);
};
let cloudsColorsImages = [];
for (let cloudColor of cloudsColors) {
  cloudsColorsImages.push(
    `./resources/images/clouds/colored/cloud-right-1-${cloudColor}.png`);
  cloudsColorsImages.push(
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
// let iconWidth = canvasWidth*0.07;
// let iconHeight = iconWidth;
// let iconOffset = canvasWidth*0.02;
  // sound (unique variables)
let imageSound = new Image();
  imageSound.src = './resources/images/icons_of_sounds/icon_sound-on.png';
// let iconSoundPosX = canvasWidth - iconOffset - iconWidth;
// let iconSoundPosY = iconOffset;
let isSoundOn = true;
  // info (unique variables)
let imageInfo = new Image();
  imageInfo.src = './resources/images/icon_info.png';
// let iconInfoPosX = canvasWidth - iconOffset - iconWidth;
// let iconInfoPosY = iconOffset*2 + iconHeight;

// audio
  // new random death sound
let newRandomAudioDeath = new Audio();
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


function createAndRenderClouds(screenWidth, screenHeight, currentScreen) {
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
  let lntervalledUpdateFreq = 1000 / 16;
  let isGameOver = false;

  // skoker init
  let skokerWidth = screenWidth/13; // 13 => 46,1538...
  let skokerHeight = skokerWidth;
  let skokerX = screenWidth/2 - skokerWidth/2;
  let skokerY = screenHeight*0.9 - skokerHeight;
  const skokerLeftImage = Object.assign(new Image(),
    { src: './resources/images/head-left-stroke.png' });
  const skokerRightImage = Object.assign(new Image(),
    { src: './resources/images/head-right-stroke.png' });
  let skoker = {
    image: skokerRightImage,
    x: skokerX,
    y: skokerY,
    width: skokerWidth,
    height: skokerHeight
  };

  let cloudWidth = screenWidth / 5;
  let cloudHeight = screenHeight * 0.1 / 3.57; // 0.028...
  let widthPadding = screenWidth * 0.02;
  // const coordsScreenWidth = screenWidth / 1.25;
  // const coordsScreenHeight = screenHeight / 1.25;
  // console.log('createAndRenderClouds:', screenWidth, screenHeight);
  
  function coloringCloudAndImages(cloud, chosenCloudsColor) {
    // console.log('cloud', cloud);
    if (chosenCloudsColor === 'multiColor') {
      if (randomInteger(1, 100) >= 65) {
        cloud.image.src = cloudsColorsImages[
          randomInteger(0, cloudsColorsImages.length - 1)];
        cloud.color = cloud.image.src.split('-').pop().split('.')[0]; // white
      };
    } else {
      cloud.image.src =
        `./resources/images/clouds/colored/cloud-left-1-${chosenCloudsColor}.png`;
      cloud.color = chosenCloudsColor;
    };
  }

  function newCloud(chosenCloudsColor) {
    // X-coord randoming with little indent on left & right
    let randomX = randomInteger(widthPadding,
      screenWidth - widthPadding - cloudWidth);
      
    let cloudImage = new Image();
    cloudImage.src = arrCloudsImages[
      randomInteger(0, arrCloudsImages.length - 1)];
        
    let cloud = { 
      collision: true,
      color: 'white',
      x: randomX,
      y: arrClouds[arrClouds.length - 1].y - screenHeight * 0.125
        - randomInteger(0, screenHeight * 3 / 42),
      width: cloudWidth,
      height: cloudHeight,
      image: new Image(),
    };

    if (arrClouds.length === 0) {
      cloud.x = (screenWidth - cloudWidth) / 2;
      cloud.y = screenHeight - cloudHeight;
      console.log(cloud.y);
    }
  
    coloringCloudAndImages(cloud, chosenCloudsColor);
    
    // ⚠️⚠️⚠️ addMovementToGreenClouds(cloud, shiftCloudX);
  
    arrClouds.push(cloud);
  };
  
  function fillingArrClouds(chosenCloudsColor) {
    arrClouds = [];

    // let cloudImage = new Image();
    // cloudImage.src = './images/clouds/transparent_1x1.png';
  
    // 1-st (starting) cloud
    let cloud = {
      collision: true,
      color: 'white',
      x: (screenWidth - cloudWidth) / 2,
      y: screenHeight - cloudHeight,
      width: cloudWidth,
      height: cloudHeight,
      image: new Image()
    };

    coloringCloudAndImages(cloud, chosenCloudsColor);

    arrClouds.push(cloud);
      
    while (arrClouds[arrClouds.length - 1].y >= 0 - cloudHeight * 3) {
      newCloud(chosenCloudsColor);
    }
    // console.log(arrClouds);
  };

  function renderClouds(arrClouds) {
    for (let i = 0; i < arrClouds.length; i++) {
      const iCloud = arrClouds[i];
      
      const iCloudImg = document.createElement('img');
      iCloudImg.src = iCloud.image.src;  // Твоя картинка
      
      Object.assign(iCloudImg.style, {
        position: 'absolute',
        left: iCloud.x + 'px',
        top: iCloud.y + 'px',
        width: iCloud.width + 'px',
        height: iCloud.height + 'px',
        objectFit: 'cover',  // масштабирует как background-size: cover
        filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))'  // ✅ Тень от краёв!
      });
      
      document.body.appendChild(iCloudImg);
    }
  }

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
    fillingArrClouds(chosenCloudsColor);
    renderClouds(arrClouds);

    // skoker render
    const skokerImg = document.createElement('img');
    skokerImg.src = skoker.image.src;  // Твоя картинка
    Object.assign(skokerImg.style, {
      position: 'absolute',
      left: skoker.x + 'px',
      top: skoker.y + 'px',
      width: skoker.width + 'px',
      height: skoker.height + 'px',
      objectFit: 'cover',  // масштабирует как background-size: cover
      filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))'  // ✅ Тень от краёв!
    });
    document.body.appendChild(skokerImg);

    

    velocityX = initialVelocityX;
    velocityY = initialVelocityY;
    lntervalledUpdateGame = setInterval(updateGame, lntervalledUpdateFreq);

    document.addEventListener('keydown', (event) => {
      if (currentScreen === 'gameWorld') {
        if (isGameOver) {
          if (event.code === 'Escape') {
            audioDeath.pause();
            audioDeath.currentTime = 0;
            clearInterval(lntervalledUpdateGame);
            initWorldsMenu();
          } else if (event.code === 'KeyR') {
            audioDeath.pause();
            audioDeath.currentTime = 0;
            initGame();
          }
        } else {
          skokerControls(event);
        }
      }
    });

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

    function updateGame() {
      function gameOver() {
        isGameOver = true;
        
        let textSizeGameOver = screenWidth/11;
        let textSizeOtherStrs = textSizeGameOver/1.5;
        let textsEndOfGame = {
          gameOver: 'Игра окончена',
          RToRestart: '«R» - рестарт,',
          EscToMenu: '«Esc» - возврат в меню'
        };

        if (isSoundOn) {
          // play new(!) random death sound
          do {
            newRandomAudioDeath.src = './resources/sounds/death/' +
              arrAudioDeath[randomInteger(0, arrAudioDeath.length - 1)];
          } while (audioDeath.src === newRandomAudioDeath.src);
          audioDeath.src = newRandomAudioDeath.src;
          audioDeath.play();
        }
      };

      // console.log('updateGame');
      if (skoker.y > screenHeight) {
        gameOver();
        clearInterval(lntervalledUpdateGame);
      } else {
        
        // updateGame skoker.x
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
      
        // jump from the cloud & draw cloud's
        for (const cloud of arrClouds) {
          // if (rectsCollide(skoker, cloud) && velocityY >= 0) {
          if (detectCollision(skoker, cloud) && velocityY >= 0) {
            // jump's sound in f_detectColor
            detectColor(skoker, cloud);
          }
          // context.drawImage(cloud.image, cloud.x,
          //   cloud.y, cloud.width, cloud.height);
        };
        
        while (arrClouds[0].y >= screenHeight) {
          arrClouds.shift();
          newPlatform();
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
        if (pointsForJumpDrawIndex > 0) {
          context.fillStyle = 'blue';
          context.font = `bold ${screenWidth/12}px ${fontTimesNewRoman}`;
          context.textAlign = 'center';
          context.fillText(pointsForJumpMessage, skoker.x + skoker.width/2,
            skoker.y + skoker.height*2);  
          
          pointsForJumpDrawIndex -= 1;
        };

        // drawIconSound();
        // drawIconInfo();
      }
    };
  });

  // ТЕСТ различного положения облачков:
  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyR') {
      document.querySelector('body').innerHTML = '';
      arrClouds = [];
      fillingArrClouds('yellow');
      renderClouds(arrClouds);
    }
  });
}

export { createAndRenderClouds };
