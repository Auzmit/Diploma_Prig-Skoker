import worlds from "./game/worlds.js";

export default function renderWorlds(currentScreen) {
  if (currentScreen = 'worldsMenu') {
    const menuWrapper = document.querySelector('.worldsMenu');
    
    Object.entries(worlds).forEach(([worldKey, worldData]) => {
      const divWorld = document.createElement('div');
      divWorld.className = `menuWorldButton ${worldKey}`;
      
      divWorld.innerHTML = `
        <header class='worldHeader'>${worldData.header}</header>
        <div class='worldFlipContainer'>
          <div class='worldDesc'>${worldData.desc}</div>
          <div class='worldDescRules'>${worldData.descRules}</div>
        </div>
      `;
      
      menuWrapper.appendChild(divWorld);
    });

    document.body.style.overflow = 'auto'; // разрешаем прокрутку страницы
  }
};
