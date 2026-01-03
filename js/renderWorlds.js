import worlds from "./worlds.js";

export default function renderWorlds(currentScreen) {
  if (currentScreen = 'worldsMenu') {
    const menuWrapper = document.querySelector('.worldsMenu');
    
    Object.entries(worlds).forEach(([worldKey, worldData]) => {
      const div = document.createElement('div');
      div.className = `menuWorldButton ${worldKey}`;
      
      div.innerHTML = `
        <header class='worldHeader'>${worldData.header}</header>
        <div class='worldFlipContainer'>
          <div class='worldDesc'>${worldData.desc}</div>
          <div class='worldDescRules'>${worldData.descRules}</div>
        </div>
      `;
      
      menuWrapper.appendChild(div);
    });
  }
};
