function createGameState(screenWidth, screenHeight) {
  // ☁️ init Clouds srcs
  const cloudsWhiteImages = [];
  for (let i = 1; i <= 6; i++) {
    cloudsWhiteImages.push(`./resources/images/clouds/cloud-right-${i}.png`);
    cloudsWhiteImages.push(`./resources/images/clouds/cloud-left-${i}.png`);
  }
  
  const cloudsColors = ['yellow', 'grey', 'green', 'red', 'black', 'blue'];
  const cloudsColoredImages = [];
  for (let cloudColor of cloudsColors) {
    cloudsColoredImages.push(
      `./resources/images/clouds/colored/cloud-right-1-${cloudColor}.png`);
    cloudsColoredImages.push(
      `./resources/images/clouds/colored/cloud-left-1-${cloudColor}.png`);
  }

  // 🔊 init Audio srcs
  const audioAirJump = new Audio('./resources/sounds/puk_air-jump.mp3');
  // const audioDeath = new Audio();
  const arrAudioDeath = [
    'ay-menya-snaypnuli-v-polte.mp3', 'brue.mp3', 'daladna.mp3',
    'eralash.mp3', 'eto-fiasko-bratan.mp3',
    'golos-beshenogo-gitlera-iz-mema-kotoryiy-nesoglasen.mp3',
    'grustnaya-violonchel.mp3', 'nepravilno-poprobuy-esch-raz.mp3', 'nope.mp3',
    'pojili-i-hvatit.mp3', 'vot-eto-povorot.mp3', 'vsego-horoshego.mp3'
  ];
  // const arrAudioDeathFilthy = [
  //   '-blin-zachem-ya-syuda-prishel.mp3', 'bolno-v-noge.mp3',
  //   'da-idi-tyi.mp3', 'davai-po-novoi-misha.mp3',
  //   'kto-kuda-a-ya-po-delam.mp3', 'ne-nihya.mp3', 'nu-che-narod-pognali1.mp3',
  //   'nu-naher.mp3', 'o-kurva.mp3', 'ya-maslinu-poymal.mp3'
  // ];

  // 👨 init Skoker sprite srcs
  const skokerLeftImage = Object.assign(new Image(), {
    src: './resources/images/head-left-stroke.png'
  });
  const skokerRightImage = Object.assign(new Image(), {
    src: './resources/images/head-right-stroke.png'
  });

  let gameState = {
    // assets
    assets: {},

    // 📏 Screen dimensions
    screen: {
      width: screenWidth,
      height: screenHeight
    },

    // ⚡ Game Physics
    physics: {
      shiftX: screenWidth / 105,
      gravity: screenHeight * 0.75 / 1500,
      initialVelocityX: 0,
      initialVelocityY: -screenHeight * 0.75 / 71,
      velocityX: 0,
      velocityY: 0,
      lntervalledUpdateFPS: 1000 / 60, // fps
      lntervalledUpdateGame: null // setInterval to start/stop updateGame with fps
    },

    // 🎯 Game state
    game: {
      score: 0,
      pointsForJump: 10,
      isGameOver: false,
      currentScreen: 'worldsMenu',
    },

    // 🎮 UI
    ui: {
      $header: null,
      settings: null,
      info: new Image(),
      isMobile: false,
      mobileControls: null,
      gameoverControls: null,
      keydownListenerAdded: null
    },

    // ☁️ Clouds
    arrClouds: [],
    cloudsSettings: {
      cloudId: 0,
      width: screenWidth / 4.5,
      height: screenHeight / 32,
      widthPadding: screenWidth * 0.02,
      colors: cloudsColors,
      unique: {
        blue: { mirrorTP: 'yes' },
        yellow: { repulsiveForce: 'trampoline' },
        red: { repulsiveForce: 'explosion' },
        black: { brokesAfterJumps: '1' },
        grey: { brokesAfterJumps: '2' },
        green: { movement: 'yes', moveDirectionX: '', moveSpeedX: 0 }
      },
      whiteImages: cloudsWhiteImages,
      coloredImages: cloudsColoredImages,
      chosenColor: '',
      offsets: {
        white: 0, // по умолчанию
        black: 1.5,
        blue: 1,
        green: 0.5,
        red: -0.5,
        yellow: -1
      }
    },

    // 👨 Skoker (the rest is in skoker.js -> initSkoker)
    skoker: {
      sprites: {
        skokerLeft: skokerLeftImage,
        skokerRight: skokerRightImage
      }
    },
    
    // 🔊 Audio
    audio: {
      isSoundOn: true,
      isJumpSoundOn: true,
      isDeathSoundOn: true,
      detectColorJump: new Audio(),
      airJump: audioAirJump,
      death: new Audio(),
      deathSounds: arrAudioDeath
    }
  }

  return gameState;
}

// Score update
function updateScore(gameState, increment) {
  let { game } = gameState;
  if (increment === 0) {
    game.score = increment;  
  } else {
    game.score += increment;
  }

  const scoreValue = document.getElementById('scoreValue');
  if (scoreValue) scoreValue.textContent = game.score;
}

export { createGameState, updateScore };
