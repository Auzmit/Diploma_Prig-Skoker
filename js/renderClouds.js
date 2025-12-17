import randomInteger from './randomInteger.js';

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

function createAndRenderClouds(screenWidth, screenHeight) {
  console.log(screenWidth, screenHeight, screenHeight / screenWidth);
  let platformWidth = screenWidth / 5;
  let platformHeight = screenHeight * 0.1 / 3.57; // 0.028...
  let widthPadding = screenWidth * 0.02;
  let arrPlatform = [];
  
  function newPlatform() {
    // X-coord randoming with little indent on left & right
    let randomX = randomInteger(widthPadding,
      screenWidth - widthPadding - platformWidth);
      
      // let platformImage = new Image();
      // platformImage.src = arrPlatformImages[
        //   randomInteger(0, arrPlatformImages.length - 1)];
        
        let platform = {
      
      collision: true,
      color: 'white',
      // image: platformImage,
      x: randomX,
      y: arrPlatform[arrPlatform.length - 1].y - screenHeight * 0.125
        - randomInteger(0, screenHeight * 3 / 42),
      width: platformWidth,
      height: platformHeight
    };
  
    // adding colored platforms & images to them
    // if (currentWorldColor === 'multiColours') {
    //   if (randomInteger(1, 100) >= 65) {
    //     platform.image.src = platformColorsImages[
    //       randomInteger(0, platformColorsImages.length - 1)];
    //     platform.color = platform.image.src.split('-').pop().split('.')[0];
    //   };
    // } else {
    //   platform.image.src =
    //     `./images/clouds/colored/cloud-left-1-${currentWorldColor}.png`;
    //   platform.color = currentWorldColor;
    // };
    // addMovementToGreenPlatforms(platform, shiftPlatformX);
  
    arrPlatform.push(platform);
  };
  
  function placePlatforms() {
    arrPlatform = [];
    // let platformImage = new Image();
    // platformImage.src = './images/clouds/transparent_1x1.png';
  
    // 1-st (starting) platform
    let platform = {
      collision: true,
      color: 'white',
      // image: platformImage,

      // x: screenWidth/2 - platformWidth/2,
      // y: screenHeight - platformHeight,

      x: screenWidth - platformWidth*2,
      y: 0,

      width: platformWidth,
      height: platformHeight
    };
    arrPlatform.push(platform);
      
    while (arrPlatform[arrPlatform.length - 1].y >= 0) {
      newPlatform();
    }
    console.log(arrPlatform);
  };

  function renderClouds(arrPlatform) {
    for (let i = 0; i < arrPlatform.length; i++) {
      const iCloud = arrPlatform[i];

      const iCloudDiv = document.createElement('div');
      Object.assign(iCloudDiv.style, {
        position: 'absolute',
        left: iCloud.x + 'px',
        top: iCloud.y + 'px',
        width: iCloud.width + 'px',
        height: iCloud.height + 'px',
        backgroundColor: iCloud.color
      });

      // iCloudDiv.style.position = 'absolute';
      // iCloudDiv.style.left = iCloud.x + 'px';
      // iCloudDiv.style.top = iCloud.y + 'px';
      // iCloudDiv.style.width = iCloud.width + 'px';
      // iCloudDiv.style.height = iCloud.height + 'px';
      // iCloudDiv.style.backgroundColor = iCloud.color;

      document.querySelector('body').appendChild(iCloudDiv);
    }
  }

  // Выбранный мир
  const menuWrapper = document.querySelector('.worldsMenu');
  menuWrapper.addEventListener('click', (event) => {
    const button = event.target.closest('.menuWorldButton');
    const chosenWorldClass = Array.from(button.classList)
      .find(currClass => currClass.startsWith('world'));
    if (!button) return; // клик не по кнопке
    console.log(chosenWorldClass);
    menuWrapper.style.display = 'none';
    placePlatforms();
    renderClouds(arrPlatform);
  });

  // ТЕСТ различного положения облачков:
  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyR') {
      document.querySelector('body').innerHTML = '';
      arrPlatform = [];
      placePlatforms();
      renderClouds(arrPlatform);
    }
  });
}

export { createAndRenderClouds };
