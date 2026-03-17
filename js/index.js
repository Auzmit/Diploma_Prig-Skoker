import { createGameState } from './game/gameState.js';
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
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function loadAudio(src) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplaythrough = () => resolve(audio);
    audio.onerror = reject;
    audio.src = src;
  });
}

async function preloadAssets(gameState) {
  const imagePaths = [
    // clouds
      // left
      './resources/images/clouds/cloud-left-1.png',
      './resources/images/clouds/cloud-left-2.png',
      './resources/images/clouds/cloud-left-3.png',
      './resources/images/clouds/cloud-left-4.png',
      './resources/images/clouds/cloud-left-5.png',
      './resources/images/clouds/cloud-left-6.png',
      // right
      './resources/images/clouds/cloud-right-1.png',
      './resources/images/clouds/cloud-right-2.png',
      './resources/images/clouds/cloud-right-3.png',
      './resources/images/clouds/cloud-right-4.png',
      './resources/images/clouds/cloud-right-5.png',
      './resources/images/clouds/cloud-right-6.png',
      // transparent
      './resources/images/clouds/transparent_1x1.png',
    // colored clouds
      // left
      './resources/images/clouds/colored/cloud-left-1-black.png',
      './resources/images/clouds/colored/cloud-left-1-blue.png',
      './resources/images/clouds/colored/cloud-left-1-green.png',
      './resources/images/clouds/colored/cloud-left-1-grey.png',
      './resources/images/clouds/colored/cloud-left-1-red.png',
      './resources/images/clouds/colored/cloud-left-1-yellow.png',
      // right
      './resources/images/clouds/colored/cloud-right-1-black.png',
      './resources/images/clouds/colored/cloud-right-1-blue.png',
      './resources/images/clouds/colored/cloud-right-1-green.png',
      './resources/images/clouds/colored/cloud-right-1-grey.png',
      './resources/images/clouds/colored/cloud-right-1-red.png',
      './resources/images/clouds/colored/cloud-right-1-yellow.png',
    // head (left & right)
    './resources/images/head-left-stroke.png',
    './resources/images/head-right-stroke.png',
  ];

  const soundPaths = [
    // death
    './resources/sounds/death/-blin-zachem-ya-syuda-prishel.mp3',
    './resources/sounds/death/ay-menya-snaypnuli-v-polte.mp3',
    './resources/sounds/death/bolno-v-noge.mp3',
    './resources/sounds/death/brue.mp3',
    './resources/sounds/death/da-idi-tyi.mp3',
    './resources/sounds/death/daladna.mp3',
    './resources/sounds/death/davai-po-novoi-misha.mp3',
    './resources/sounds/death/eralash.mp3',
    './resources/sounds/death/eto-fiasko-bratan.mp3',
    './resources/sounds/death/golos-beshenogo-gitlera-iz-mema-kotoryiy-nesoglasen.mp3',
    './resources/sounds/death/grustnaya-violonchel.mp3',
    './resources/sounds/death/kto-kuda-a-ya-po-delam.mp3',
    './resources/sounds/death/ne-nihya.mp3',
    './resources/sounds/death/nepravilno-poprobuy-esch-raz.mp3',
    './resources/sounds/death/nope.mp3',
    './resources/sounds/death/nu-che-narod-pognali1.mp3',
    './resources/sounds/death/nu-naher.mp3',
    './resources/sounds/death/o-kurva.mp3',
    './resources/sounds/death/pojili-i-hvatit.mp3',
    './resources/sounds/death/vot-eto-povorot.mp3',
    './resources/sounds/death/vsego-horoshego.mp3',
    './resources/sounds/death/ya-maslinu-poymal.mp3',
    // trampoline_jumps
    './resources/sounds/trampoline_jumps/0.mp3',
    './resources/sounds/trampoline_jumps/1.mp3',
    './resources/sounds/trampoline_jumps/2.mp3',
    // other
    './resources/sounds/click_button.mp3',
    './resources/sounds/explosion.mp3',
    './resources/sounds/puk_air-jump.mp3',
    './resources/sounds/swipe.mp3'
  ];

  const images = await Promise.all(imagePaths.map(loadImage));
  const sounds = await Promise.all(soundPaths.map(loadAudio));

  gameState.assets = {
    images,
    sounds,
  };
}

async function init() {
  if (!document.querySelector('.worldsMenu')) {
    const div = document.createElement('div');
    div.className = 'worldsMenu';
    document.body.appendChild(div);
  }
  console.log(111);

  // если экран вертикальный, то подстроиться под ширину
  updateScreenSize();
  
  const gameState = createGameState(screenWidth, screenHeight);
  const $loading = document.getElementById('loading');
  console.log('$loading:', $loading);
  
  try {
    await preloadAssets(gameState);
  } catch (e) {
    console.error('Asset preload failed', e);
  }
  
  // скрываем экран загрузки (loading-spinner)
  $loading.style.display = 'none';
  
  // логика инициализации платформ, игрока и т.п.
  renderWorlds(currentScreen);
  createAndRenderGame(gameState, currentScreen);
}

init();
// window.addEventListener('load', init);
