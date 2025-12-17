import { renderWorlds } from './renderWorlds.js';
import { createAndRenderClouds } from './renderClouds.js';

renderWorlds();
window.addEventListener('DOMContentLoaded', () => {
  const screenWidth = Math.floor(window.innerWidth * 1.25)
  const screenHeight = Math.floor(window.innerHeight * 1.25)
  // console.log('innerWidth:', screenWidth);
  // console.log('innerHeight:', screenHeight);

  createAndRenderClouds(screenWidth, screenHeight);
});
// console.log('renderer loaded ');
