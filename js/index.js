import { renderWorlds } from './renderWorlds.js';
import { renderClouds } from './renderClouds.js';

renderWorlds();
window.addEventListener('DOMContentLoaded', () => {
  const screenWidth = Math.floor(window.innerWidth * 1.25)
  const screenHeight = Math.floor(window.innerHeight * 1.25)
  // console.log('innerWidth:', screenWidth);
  // console.log('innerHeight:', screenHeight);

  renderClouds(screenWidth, screenHeight);
});
// console.log('renderer loaded ');
