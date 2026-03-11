function setToggleState(type, state) {
  // const { audio } = gameState;
  console.log('state', state);
  const btn = document.querySelector(`button[data-setting="${type}"]`);
  if (!btn) return;
  
  const checkbox = btn.querySelector('input[type="checkbox"]');
  if (checkbox) {
    requestAnimationFrame(() => {
      checkbox.checked = state; // !!! ТОЛЬКО визуально переключить слайдер
    });
  }
}

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
  setToggleState('all', audio.isSoundOn);
  setToggleState('jump', audio.isJumpSoundOn);
  setToggleState('death', audio.isDeathSoundOn);

  // Обработчик кликов
  // console.log('add listener on settings');
  ui.settings.addEventListener('click', (e) => {
    // игнорируем прямой клик по чекбоксу,
    // обрабатываем только клик по кнопке/обёртке
    if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
      return;
    }

    if (e.target.dataset.close === 'true') {
      ui.settings.classList.remove('visible');
      return;
    }

    
    const $btn = e.target.closest('button[data-setting]');
    if (!$btn) return;
    
    const type = $btn.dataset.setting;
    if (type === 'all') {
      // console.log('111 all', audio.isSoundOn,
      //   audio.isJumpSoundOn, audio.isDeathSoundOn);

      audio.isSoundOn = !audio.isSoundOn;
      audio.isJumpSoundOn = audio.isSoundOn;
      audio.isDeathSoundOn = audio.isSoundOn;

      setToggleState('all', audio.isSoundOn);
      setToggleState('jump', audio.isSoundOn);
      setToggleState('death', audio.isSoundOn);

    } else if (type === 'jump') {
      audio.isJumpSoundOn = !audio.isJumpSoundOn;
      setToggleState('jump', audio.isJumpSoundOn);
    } else if (type === 'death') {
      audio.isDeathSoundOn = !audio.isDeathSoundOn;
      setToggleState('death', audio.isDeathSoundOn);
    }
  });
}

function toggleSettings(gameState) {
  let { ui } = gameState;
  
  if (!ui.settings) {
    createSettingsModal(gameState);
  }
  
  requestAnimationFrame(() => {
    if (ui.settings.classList.contains('visible')) {
      ui.settings.classList.remove('visible');
    } else {
      ui.settings.classList.add('visible');
    }
  });
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

  // Создаём модалку сразу при инициализации, но невидимую
  createSettingsModal(gameState);

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
