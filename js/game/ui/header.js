function createSettingsModal(gameState) {
  let { ui, audio } = gameState;
  
  if (ui.settings) return;
  
  ui.settings = document.createElement('div');
  ui.settings.className = 'settings-modal';
  ui.settings.innerHTML = `
    <div class="settings-overlay" data-close="true">
      <div class="settings-content">
        <button class="settings-close" data-close="true">&times;</button>
        
        <button data-setting="all">Весь звук:
          <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
          </label>
        </button>
        
        <button data-setting="jump">Звук прыжков:
          <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
          </label>
        </button>
        
        <button data-setting="death">Звук смерти:
          <label class="switch">
            <input type="checkbox">
            <span class="slider round"></span>
          </label>
        </button>

      </div>
    </div>
  `;
  
  document.body.appendChild(ui.settings);

  // Обработчик кликов
  ui.settings.addEventListener('click', (e) => {
    if (e.target.dataset.close === 'true') {
      ui.settings.classList.remove('visible');
      return;
    }
    
    const $btn = e.target.closest('button[data-setting]');
    if (!$btn) return;
    
    const type = $btn.dataset.setting;
    if (type === 'all') {
      console.log('111', gameState.audio.isSoundOn);
      audio.isSoundOn = !audio.isSoundOn;
      audio.isJumpSoundOn = audio.isSoundOn;
      audio.isDeathSoundOn = audio.isSoundOn;
      console.log('222', gameState.audio.isSoundOn);
    } else if (type === 'jump') {
      audio.isJumpSoundOn = !audio.isJumpSoundOn;
    } else if (type === 'death') {
      audio.isDeathSoundOn = !audio.isDeathSoundOn;
    }
  });
}

function toggleSettings(gameState) {
  let { ui } = gameState;
  
  if (!ui.settings) {
    createSettingsModal(gameState);
  }
  
  ui.settings.classList.toggle('visible');
}

function initHeader(gameState) {
  let { ui } = gameState;
  
  // Создаём header
  ui.$header = document.createElement('div');
  ui.$header.className = 'game-header';
  ui.$header.innerHTML = `
    <div class="score-display">
      <span>Score: </span>
      <span id="scoreValue">0</span>
    </div>
    <button class="settings-btn" id="settingsBtn">⚙️</button>
  `;
  document.body.appendChild(ui.$header);
  // ui.$header = $header;

  // Кнопка настроек
  document.getElementById('settingsBtn').addEventListener('click', () => {
    toggleSettings(gameState);
  });
}

function renderGameHeader(gameState) {
  const { ui, game } = gameState;
  
  if (!ui.$header) {
    initHeader(gameState);
  } else {
    // Показать/скрыть счёт
    ui.$header.querySelector('.score-display')
      .classList.toggle('visible', game.currentScreen === 'gameWorld');
  }
}

export { renderGameHeader };
