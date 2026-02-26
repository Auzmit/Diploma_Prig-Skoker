import { randomInteger, randomLeftOrRight } from '../random.js';
import { updateScore } from '../gameState.js';

function detectColor(cloud, gameState) {
  const { screen, physics, arrClouds, skoker, audio } = gameState;
  // normal jump
  physics.velocityY = physics.initialVelocityY;
  const skokerCenter = skoker.x + skoker.width/2;
  let cloudCenter = cloud.x + cloud.width/2;

  // init jump audio
  // audio.detectColorJump = new Audio();

  if (cloud.color === 'yellow') {
    physics.velocityY = physics.initialVelocityY * 2.2;

    if (audio.isSoundOn && audio.isJumpSoundOn) {
      audio.detectColorJump.src =
        `./resources/sounds/trampoline_jumps/${randomInteger(1, 2)}.mp3`;
      audio.detectColorJump.play();
    }

  } else if (cloud.color === 'blue') {
    // mirroring clouds relative to the center
    for (let currentCloud of arrClouds) {
      let currentCloudCenter = currentCloud.x + currentCloud.width/2;
      const offsetFromCenter = screen.width/2 - currentCloudCenter;
      currentCloudCenter = screen.width/2 + offsetFromCenter;
      currentCloud.x = currentCloudCenter - currentCloud.width/2;
    };

    if (audio.isSoundOn && audio.isJumpSoundOn) {
      audio.detectColorJump.src = './resources/sounds/swipe.mp3';
      audio.detectColorJump.play();
    }

  } else if (cloud.color === 'grey') {
    // grey turns to black
    cloud.color = 'black';
    cloud.image.src = 
      `./resources/images/clouds/colored/cloud-${randomLeftOrRight()}-1-black.png`;

  } else if (cloud.color === 'black') {
    // disappearance Black clouds
    // console.log(cloud.id);
    // console.log(document.getElementById(`cloud-${cloud.id}`));
    // document.getElementById(`cloud-${cloud.id}`).classList.add('.cloud-hidden');
    cloud.domElement.classList.add('cloud-hidden');
    // console.log(cloud);
    
    cloud.collision = false;
    // cloud.color = 'transparent';
    // cloud.image.src = './resources/images/clouds/transparent_1x1.png';
    // removeCloud(cloud, arrClouds);

  } else if (cloud.color === 'red') {
    // explodes & disappear - farther skoker is from the center of the cloud,
    // harder kicks him away along X & turns him in direction which he is moving
    physics.velocityY = physics.initialVelocityY * 1.3;

    const offsetFromCloudCenter = skokerCenter - cloudCenter;
    let coeffSkokerVelocityX = offsetFromCloudCenter / cloud.width * 0.6;
    coeffSkokerVelocityX += Math.sign(offsetFromCloudCenter) * 1;
    // coeffSkokerVelocityX += (offsetFromCloudCenter >= 0) ? 1 : -1;
    physics.velocityX = physics.shiftX * coeffSkokerVelocityX;

    if (physics.velocityX < 0) {
      skoker.image = skoker.sprites.skokerLeft;
    } else skoker.image = skoker.sprites.skokerRight;

    // removeCloud(cloud, arrClouds);

    if (audio.isSoundOn && audio.isJumpSoundOn) {
      audio.detectColorJump.src = './resources/sounds/explosion.mp3';
      audio.detectColorJump.play();
    }

  } else if (cloud.color === 'green') {
    // do nothing - the cloud drives itself anyway
  };
  
  if (audio.isSoundOn && audio.isJumpSoundOn) {
    if (!audio.detectColorJump.src) {
      audio.detectColorJump.src = './resources/sounds/trampoline_jumps/0.mp3';
      audio.detectColorJump.play();
    }
  }
};

function cleanupOldClouds(gameState) {
  const { screen, arrClouds } = gameState;
  
  while (arrClouds[0]?.y >= screen.height) {
    // удаляем из массива
    const cloud = arrClouds.shift();  // O(1) вместо O(n) (indexOf...)
    // удаляем из вёрстки
    cloud.domElement?.remove();
    // обновляем счёт (тк он начисляется за облачка,
    // которые уже пройдены - уехали вниз и никак не вернуться)
    updateScore(gameState, +1);
  }
}

function coloringCloud(cloud, gameState) {
  const { cloudsSettings } = gameState;
  const { chosenColor, coloredImages,
    whiteImages, offsets } = gameState.cloudsSettings;
  const shiftX = gameState.physics.shiftX;
  
  if (chosenColor === 'multiColor') {
    // 1/3 облаков - цветные
    if (randomInteger(1, 100) >= 66) {
      cloud.image.src = coloredImages[
        randomInteger(0, coloredImages.length - 1)
      ];
      cloud.color = cloud.image.src.split('-').pop().split('.')[0];
    } else {
      cloud.image.src = whiteImages[
        randomInteger(0, whiteImages.length - 1)
      ];
      cloud.color = 'white';
    }
  } else {
    // ⚠️⚠️⚠️
    cloud.image.src =
      `./resources/images/clouds/colored/cloud-left-1-${chosenColor}.png`;
    cloud.color = chosenColor;
  }
  
  // Зелёные облака двигаются
  if (cloud.color === 'green') {
    cloud.moveDirectionX = randomLeftOrRight();
    cloud.moveSpeedX = shiftX * randomInteger(15, 95) / 100;
  }
  
  // Корректировка высоты в зависимости от предыдущего цвета
  if (gameState.arrClouds.length > 0) {
    // const offsets = {
    //   white: 0, black: 1.5, blue: 1, green: 0.5, red: -0.5, yellow: -1
    // };
    cloud.y += cloudsSettings.height *
      (offsets[gameState.arrClouds.at(-1).color] ?? 0);
  }
  
  return cloud;
}

function newCloud(gameState) {
  const { screen} = gameState;
  let { cloudsSettings } = gameState;
  let { widthPadding } = gameState.cloudsSettings;
  
  // Координаты облака
  let cloudX = 0;
  let cloudY = 0;
  
  if (gameState.arrClouds.length === 0) {
    // Первое облако по центру ниже Скокера
    cloudX = (screen.width - cloudsSettings.width) / 2;
    cloudY = screen.height * 0.86;
  } else {
    // Случайная X позиция с отступами
    cloudX = randomInteger(widthPadding,
      screen.width - widthPadding - cloudsSettings.width);
    
    // Y позиция относительно предыдущего облака
    cloudY = gameState.arrClouds.at(-1).y - screen.height * 0.125
      - randomInteger(0, screen.height * 3 / 42);
  }

  // Создаём облако
  const cloud = {
    id: cloudsSettings.cloudId++,
    collision: true,
    color: '',
    x: cloudX,
    y: cloudY,
    width: cloudsSettings.width,
    height: cloudsSettings.height,
    image: new Image(),
    domElement: null
  };
  cloudsSettings.cloudId += 1;
  
  return coloringCloud(cloud, gameState);
}

function fillingArrClouds(gameState) {
  const { cloudsSettings } = gameState;
  
  // Даже если массив пустой, то всё равно добавится новое (первое) облако
  // (то есть ошибки не будет):
  while (!gameState.arrClouds.at(-1) || 
          gameState.arrClouds.at(-1).y >= 0 - cloudsSettings.height * 3) {
    gameState.arrClouds.push(newCloud(gameState));
  }
}

function createCloudElement(cloud, gameState) {
  // const { width, height } = gameState.cloudsSettings;
  // let { cloudId } = gameState.cloudsSettings;

  // $ разрешён в именах переменных (наравне с буквами и _),
  // но не имеет синтаксич. значения, однако это традиция от jQuery:
  const $img = document.createElement('img');
  $img.id = `cloud-${cloud.id}`;
  $img.dataset.gameElement = 'cloud';

  const CLOUD_STYLE = {
    position: 'absolute',
    zIndex: '10',
    width: `${cloud.width}px`,
    height: `${cloud.height}px`,
    objectFit: 'fill',
    filter: 'drop-shadow(2px 4px 3px rgba(0, 0, 0, 0.3))',
    transition: 'opacity 0.3s linear'
  };

  Object.assign($img.style, CLOUD_STYLE);

  document.body.appendChild($img);
  return $img;
}

function renderClouds(gameState) {
  for (const cloud of gameState.arrClouds) {
    let cloudDOM = cloud.domElement;
     if (!cloudDOM) {
      cloudDOM = cloud.domElement = createCloudElement(cloud, gameState);
      // cloudDOM.classList.add('cloud');
    }

    cloudDOM.src = cloud.image.src;
    cloudDOM.style.left = `${cloud.x}px`;
    cloudDOM.style.top = `${cloud.y}px`;
  }
}

function addNewClouds(gameState) {
  const { arrClouds } = gameState;
  
  while (arrClouds.at(-1) && arrClouds.at(-1).y >= 0) {
    arrClouds.push(newCloud(gameState));
  }
}

export { renderClouds, fillingArrClouds,
  newCloud, cleanupOldClouds, detectColor, addNewClouds };
