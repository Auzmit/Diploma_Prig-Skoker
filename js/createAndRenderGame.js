import { randomInteger, randomLeftOrRight } from './random.js';
import worlds from "./worlds.js";
import detectCollision from './detectCollision.js';
import removeCloud from './removeCloud.js';

function createAndRenderGame(screenWidth, screenHeight, currentScreen) {
  // physics and game init
  let shiftX = screenWidth/105;
  let initialGravity = screenHeight * 0.75 / 1500;
  let gravity = initialGravity;
  let lntervalledUpdateGame;
  let lntervalledUpdateFPS = 1000 / 60;
  let isGameOver = false;
  //
  let initialVelocityX = 0;
  let velocityX = initialVelocityX;
  let initialVelocityY = -screenHeight * 0.75 / 71;
  let velocityY = initialVelocityY;

  // clouds init
  let cloudWidth = screenWidth / 4.5; // original: screenWidth / 5
  let cloudHeight = screenHeight / 32; // original: screenHeight * 0.75 / 5 / 3.57
  let widthPadding = screenWidth * 0.02;
  const clouds = {};
  let chosenCloudsColor = '';
  const cloudsColors = ['yellow', 'grey', 'green', 'red', 'black', 'blue'];
  cloudsColors.forEach((color) => {
    clouds[color] = {
      brokesAfterJumps: 'never', // 1, 2, never
      movement: 'no', // 'yes', 'no'
      repulsiveForce: 'no', // 'explosion', 'trampoline', 'no'
      mirrorTP: 'no', // 'yes', 'no
    }
  });
  clouds.blue.mirrorTP = 'yes';
  clouds.yellow.repulsiveForce = 'trampoline';
  clouds.red.repulsiveForce = 'explosion';
  clouds.black.brokesAfterJumps = '1';
  clouds.grey.brokesAfterJumps = '2';
  clouds.green.movement = 'yes';
  clouds.green.moveDirectionX = ''; // 'left' или 'right' установим для каждого отдельно
  clouds.green.moveSpeedX = 0; // установим для каждого отдельно
  
  // clouds images init
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
  let cloudId = 0;
  
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

  
  // let inialShiftSkokerX = screenWidth/120;
  // skoker init
  let skoker;
  const skokerWidth = screenWidth/13; // 13 => 46,1538...
  // 
  // ⚠️⚠️⚠️ на сколько отличается screenHeight на столько же и skokerHeight?
  // const skokerHeight = skokerWidth; // original
  const skokerHeight = screenHeight/26; // 10.7 => 46,7289...
  // 
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

  // ⚠️⚠️⚠️
  function coloringCloudAndImages(cloud, chosenCloudsColor) {
    // console.log(111, cloud.color);
    // console.log(222, chosenCloudsColor);

    if (chosenCloudsColor === 'multiColor') {
      // Цветных должно быть 1/3 всех Облаков
      if (randomInteger(1, 100) >= 66) {
        cloud.image.src = cloudsColoredImages[
          randomInteger(0, cloudsColoredImages.length - 1)];
        cloud.color = cloud.image.src.split('-').pop().split('.')[0];
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
    if (cloud.color === 'green') {
      cloud.moveDirectionX = randomLeftOrRight();
      cloud.moveSpeedX = shiftX * randomInteger(15, 95)/100;
    }

    // чуток повыше/пониже (-/+) Облако, если оно выше определённого цвета
    if (arrClouds.length > 0) {
      const cloudsOffsets = {
        white: 0, // по умолчанию
        black: 1.5,
        blue: 1,
        green: 0.5,
        red: -0.5,
        yellow: -1
      };
      cloud.y += cloudHeight * (cloudsOffsets[arrClouds.at(-1).color] ?? 0);
    }

    return cloud;
  }

  // ⚠️⚠️⚠️
  function newCloud(chosenCloudsColor) {
    let cloudX = 0;
    let cloudY = 0;
    if (arrClouds.length === 0) {
      cloudId = 0;
      // firstCloud:
      cloudX = (screenWidth - cloudWidth) / 2;
      cloudY = screenHeight * 0.86;
    } else {
      // X-coordinate is calculated so that cloud has at least small offset from borders
      cloudX = randomInteger(widthPadding,
        screenWidth - widthPadding - cloudWidth);
      // Y-coord calculating with (specific + random space) from previous cloud.y
      // original:
      cloudY = arrClouds.at(-1).y - screenHeight * 0.125
        - randomInteger(0, screenHeight * 3 / 42);
    }

    let cloud = {
      id: cloudId++,
      collision: true,
      color: '',
      x: cloudX,
      y: cloudY,
      width: cloudWidth,
      height: cloudHeight,
      image: new Image(),
      domElement: null  // DOM элемент будет здесь
    };
    
    coloringCloudAndImages(cloud, chosenCloudsColor);
    
    return cloud;
  }
  
  function fillingArrClouds(chosenCloudsColor) {
    // Если массив пустой, то всё равно добавим новое (первое) облако:
    while (!arrClouds.at(-1) || arrClouds.at(-1).y >= 0 - cloudHeight * 3) {
      arrClouds.push(newCloud(chosenCloudsColor));
    }
  }

  function renderClouds(arrClouds) {
    for (let i = 0; i < arrClouds.length; i++) {
      const iCloud = arrClouds[i];
      
      if (!iCloud.domElement) {
        iCloud.domElement = document.createElement('img');
        
        Object.assign(iCloud.domElement.style, {
          position: 'absolute',
          width: iCloud.width + 'px',
          height: iCloud.height + 'px',
          objectFit: 'fill',   // заполняет img без сохранения пропорций
          filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))' // тень от неровных краёв
        });
        iCloud.domElement.id = `cloud-${iCloud.id}`;
        
        document.body.appendChild(iCloud.domElement);
      }

      iCloud.domElement.src = iCloud.image.src;
      iCloud.domElement.style.left = iCloud.x + 'px';
      iCloud.domElement.style.top = iCloud.y + 'px';
    }
    // console.log('renderClouds', arrClouds);
  }

  // Выбранный мир
  const menuWrapper = document.querySelector('.worldsMenu');
  menuWrapper.addEventListener('click', (event) => {
    const button = event.target.closest('.menuWorldButton');
    if (!button) return; // клик по пустому месту внутри Меню миров

    currentScreen = 'gameWorld';
    const chosenWorldClass = Array.from(button.classList)
      .find(currClass => currClass.startsWith('world'));
    
    menuWrapper.style.display = 'none'; // скрываем Меню миров

    chosenCloudsColor = worlds[chosenWorldClass].cloudsColor;

    // Skoker rendering
    function renderSkoker(skoker) {
      if (!skoker.domElement) {
        skoker.domElement = document.createElement('img');
        skoker.domElement.src = skoker.image.src;
        Object.assign(skoker.domElement.style, {
          position: 'absolute',
          width: skoker.width + 'px',
          height: skoker.height + 'px',
          objectFit: 'cover',  // масштабирует как "background-size: cover"
          filter: 'drop-shadow(2px 4px 3px rgba(0,0,0,0.3))'  // тень от неровных краёв
        });
        document.body.appendChild(skoker.domElement);
      }

      skoker.domElement.src = skoker.image.src;
      skoker.domElement.style.left = skoker.x + 'px';
      skoker.domElement.style.top = skoker.y + 'px';
    }
    
    function renderGameHeader() {
      score = 0;

      // Удаляем старый header, если есть
      const oldHeader = document.querySelector('.game-header');
      if (oldHeader) oldHeader.remove();

      // Создаём новый header
      const header = document.createElement('div');
      header.className = 'game-header';
      header.innerHTML = `
        <div class="score-display">
          <span>Score: </span>
          <span id="scoreValue">${score}</span>
        </div>
        <button class="settings-btn" id="settingsBtn">⚙️</button>
      `;
      document.body.appendChild(header);

      // Обработчик кнопки Настроек
      const btn = document.getElementById('settingsBtn');
      if (btn) {
        btn.addEventListener('click', () => {
          console.log('Открыть настройки');
          // Логика настроек
        });
      }
    }

    function updateScore(newScore) {
      const scoreValue = document.getElementById('scoreValue');
      if (scoreValue) scoreValue.textContent = newScore;
    }

    function skokerControls(event) {
      if (event.code === 'ArrowRight' || event.code === 'KeyD') {
        velocityX = shiftX;
        skoker.image = skokerRightImage;
      } else if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
        velocityX = -shiftX;
        skoker.image = skokerLeftImage;
      // air jump
      } else if (event.code === 'Space' || event.code === 'KeyW'
        || event.code === 'ArrowUp') {
        pointsForJumpDrawIndex = initialPointsForJumpDrawIndex;
        if (score >= 10) {
          velocityY = initialVelocityY;
          score -= pointsForJump;
          updateScore(score);
          // pointsForJumpMessage = `-${pointsForJump}`;

          if (isSoundOn) {
            audioAirJump.currentTime = 0;
            audioAirJump.play();
          };
        } else {
          // pointsForJumpMessage = `мало очков`;
        }
      }
    };

    let mobileControls = null;

    // function handleMobileControlsEnd(event) {
    //   event.preventDefault();
    //   velocityX = 0; // останавливаем движение
    // }

    function createMobileControls() {
      // Проверяем, мобильное ли устройство
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth <= 768;

      if (!isMobile || mobileControls) return;

      // Создаём контейнер кнопок
      mobileControls = document.createElement('div');
      mobileControls.className = 'mobile-controls';
      
      mobileControls.innerHTML = `
        <button class="control-btn left-btn" data-action="left">◀</button>
        <button class="control-btn jump-btn" data-action="jump">↑</button>
        <button class="control-btn right-btn" data-action="right">▶</button>
      `;
      
      document.body.appendChild(mobileControls);
      
      // Обработчики touch
      mobileControls.addEventListener('touchstart', handleMobileControls, { passive: false });
      // mobileControls.addEventListener('touchend', handleMobileControlsEnd, { passive: false });
    }

    function handleMobileControls(event) {
      event.preventDefault(); // блокируем скролл
      
      const btn = event.target.closest('.control-btn');
      if (!btn) return;
      
      const action = btn.dataset.action;
      
      if (action === 'left') {
        velocityX = -shiftX;
        skoker.image = skokerLeftImage;
      } else if (action === 'right') {
        velocityX = shiftX;
        skoker.image = skokerRightImage;
      } else if (action === 'jump') {
        // Твоя логика прыжка
        if (score >= 10) {
          velocityY = initialVelocityY;
          score -= pointsForJump;
          updateScore(score);
          
          if (isSoundOn) {
            audioAirJump.currentTime = 0;
            audioAirJump.play();
          }
        }
      }
    }

    window.addEventListener('orientationchange', () => {
      if (mobileControls) {
        setTimeout(() => {
          mobileControls.classList.toggle('visible', window.innerWidth <= 768);
        }, 100);
      }
    });
    // Показать при загрузке
    if (mobileControls) {
      mobileControls.classList.add('visible');
    }

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
        function shiftXGreen(cloud) {
          if (cloud.moveDirectionX === 'right') {
            if (cloud.x + cloud.width + shiftX <= screenWidth - widthPadding) {
                cloud.x += cloud.moveSpeedX;
            } else {
              cloud.moveDirectionX = 'left';
              shiftXGreen(cloud);
            }
          } else if (cloud.moveDirectionX === 'left') {
            if (cloud.x + shiftX >= widthPadding) {
              cloud.x -= cloud.moveSpeedX;
            } else {
              cloud.moveDirectionX = 'right';
              shiftXGreen(cloud);
            }
          }
        };
        for (const cloud of arrClouds) {
          if (cloud.color === 'green') {
            shiftXGreen(cloud);
          }
        };
      

        function detectColor(skoker, cloud) {
          // normal jump
          velocityY = initialVelocityY;

          // init jump audio
          let audioDetectColor = new Audio();

          if (cloud.color === 'yellow') {
            velocityY = initialVelocityY * 2.2;

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
            // cloud.collision = false;
            // cloud.color = 'transparent';
            cloud.image.src = './resources/images/clouds/transparent_1x1.png';
            removeCloud(cloud, arrClouds);

          } else if (cloud.color === 'red') {
            // explodes & disappear - farther skoker is from the center of the cloud,
            // harder kicks him away along X & turns him in direction which he is moving
            velocityY = initialVelocityY * 1.3;

            let xDistanceSkokerCloud = (skoker.x + skoker.width/2)
              - (cloud.x + cloud.width/2);
            let coeffShiftSkokerX = xDistanceSkokerCloud/(cloud.width/2);
            coeffShiftSkokerX *= 0.3;

            coeffShiftSkokerX += (coeffShiftSkokerX >= 0) ? 1 : -1;
            velocityX = shiftX * coeffShiftSkokerX;
            if (velocityX < 0) {
              console.log(111);
              skoker.image = skokerLeftImage;
            } else skoker.image = skokerRightImage;
            console.log(skoker.image);
            console.log(skoker);

            // cloud.image.src = './resources/images/clouds/transparent_1x1.png';
            // cloud.color = 'transparent';
            // cloud.collision = false;
            removeCloud(cloud, arrClouds);

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

        // jump from the cloud
        for (const cloud of arrClouds) {
          if (detectCollision(skoker, cloud) && velocityY >= 0) {
            detectColor(skoker, cloud);
            renderClouds(arrClouds);
          }
        };

        while (arrClouds[0].y >= screenHeight) {
          removeCloud(arrClouds[0], arrClouds);
          // arrClouds.push(newCloud(chosenCloudsColor));
          score += 1;
          updateScore(score);
        };
        while (arrClouds.at(-1).y >= 0) {
          arrClouds.push(newCloud(chosenCloudsColor));
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

        // document.body.innerHTML = ''; // очищаем всё тело документа
        renderClouds(arrClouds);
        // console.log(arrClouds);
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

      createMobileControls(); 

      renderGameHeader(score);

      arrClouds = [];
      fillingArrClouds(chosenCloudsColor);
      renderClouds(arrClouds);
      // console.log('start', arrClouds);

      initSkoker();
      renderSkoker(skoker);

      lntervalledUpdateGame = setInterval(updateGame, lntervalledUpdateFPS);
      // lntervalledUpdateGame = setInterval(updateGame, 10);
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
