// import { screen } from 'electron';
// const clouds = {};
// const cloudsColors = ['white', 'yellow', 'grey', 'green', 'red', 'black', 'blue'];
// cloudsColors.forEach((color) => {
//   clouds[color] = {
//     brokesAfterJumps: 'never', // 1, 2, never
//     movement: 'no', // 'yes', 'no'
//     repulsiveForce: 'no', // 'explosion', 'trampoline', 'no'
//     mirrorTP: 'no', // 'yes', 'no
//   }
// });
// clouds.yellow.repulsiveForce = 'trampoline';
// clouds.grey.brokesAfterJumps = '2';
// clouds.green.movement = 'yes';
// clouds.red.repulsiveForce = 'explosion';
// clouds.black.brokesAfterJumps = '1';
// clouds.blue.mirrorTP = 'yes';

// function renderClouds() {
//   // const menuWrapper = document.querySelector('.worldsMenu');
//   menuWrapper.addEventListener('click', (event) => {
//     const button = event.target.closest('.menuWorldButton');
//     const chosenWorldClass = Array.from(button.classList)
//       .find(currClass => currClass.startsWith('world'));
//     const worldName = button.querySelector('header').innerText;
//     if (!button) return; // клик не по кнопке
  
//     console.log(chosenWorldClass);
//     // тут можно использовать button, например:
//     // console.log(button.className);
//   });
  
//   const display = screen.getPrimaryDisplay();
//   const { screenWidth: screenWidth,
//           screenHeight: screenHeight } = display.workAreaSize; // без taskbar
//   let platformWidth = screenWidth/5;
//   let platformHeight = platformWidth/3.57;
//   let widthPadding = screenWidth*0.02;
//   let arrPlatform = [];
  
//   function randomInteger(min, max) {
//     let randomNumber = Math.random() * (max - min + 1) + min;
//     return Math.floor(randomNumber);
//   }
  
//   function newPlatform() {
//     // X-coord randoming with little indent on left & right
//     let randomX = randomInteger(widthPadding,
//       screenWidth - widthPadding - platformWidth);
  
//     // let platformImage = new Image();
//     // platformImage.src = arrPlatformImages[
//     //   randomInteger(0, arrPlatformImages.length - 1)];
    
//     let platform = {
//       collision: true,
//       color: 'white',
//       // image: platformImage,
//       x: randomX,
//       y: arrPlatform[arrPlatform.length - 1].y - screenWidth/6
//         - randomInteger(0, screenWidth/10.5),
//       width: platformWidth,
//       height: platformHeight
//     };
  
//     // adding colored platforms & images to them
//     // if (currentWorldColor === 'multiColours') {
//     //   if (randomInteger(1, 100) >= 65) {
//     //     platform.image.src = platformColorsImages[
//     //       randomInteger(0, platformColorsImages.length - 1)];
//     //     platform.color = platform.image.src.split('-').pop().split('.')[0];
//     //   };
//     // } else {
//     //   platform.image.src =
//     //     `./images/clouds/colored/cloud-left-1-${currentWorldColor}.png`;
//     //   platform.color = currentWorldColor;
//     // };
//     // addMovementToGreenPlatforms(platform, shiftPlatformX);
  
//     arrPlatform.push(platform);
//   };
  
//   function placePlatforms() {
//     arrPlatform = [];
//     // let platformImage = new Image();
//     // platformImage.src = './images/clouds/transparent_1x1.png';
  
//     // 1-st (starting) platform
//     let platform = {
//       collision: true,
//       color: 'white',
//       // image: platformImage,
//       x: screenWidth/2 - platformWidth/2,
//       y: screenHeight - platformHeight,
//       width: platformWidth,
//       height: platformHeight
//     };
//     arrPlatform.push(platform);
      
//     while (arrPlatform[arrPlatform.length - 1].y >= 0) {
//       newPlatform();
//     }
//     console.log(arrPlatform);
//   };
  
//   placePlatforms();
// }

function renderClouds() {
  window.addEventListener('DOMContentLoaded', () => {
    console.log('screenData in renderer:', window.innerWidth);
    console.log('screenData in renderer:', window.innerHeight);
  });
  // console.log('renderClouds');
  // console.log('Browser screen width:', window.screen.width); // ✅ Работает!
  console.log(window.screenData.width);
}
export { renderClouds };
