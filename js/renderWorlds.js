function renderWorlds() {
  const menuWrapper = document.querySelector('.worldsMenu');
  const worlds = {
    worldMulticolors: {
      cloudColor: 'multiColor',
      header: 'Мультицвет',
      desc: 'жизнь как она есть: со своими взлётами и падениями',
      descRules: 'присутствуют все виды облачков (обычных белых большинство)'
    },
    worldChild: {
      cloudColor: 'yellow',
      header: 'Детский',
      desc: 'всё просто - даже ребёнок справится',
      descRules: 'после прыжка по облачку даётся большое ускорение по вертикали'
    },
    worldNoir: {
      cloudColor: 'grey',
      header: 'Нуар',
      desc: 'это сложный мир, но он даёт право на ошибку',
      descRules: 'после прыжка облачко становится чёрным, а после второго - тут же разрушается'
    },
    worldGLM: {
      cloudColor: 'green',
      header: 'Green Lives Matter',
      desc: 'движение это жизнь, да? А природа - это и есть движение!',
      descRules: 'все облачка двигаются из стороны в сторону по горизонтали'
    },
    worldBadabum: {
      cloudColor: 'red',
      header: 'БА-ДА-БУ-У-УМ!!!',
      desc: 'а ты знаешь, что такое rocket jump?',
      descRules: 'после прыжка облачко разрушается, подкидывает вверх и вбок тем сильнее, чем дальше от его центра был прыжок'
    },
    worldNoirNightmare: {
      cloudColor: 'black',
      header: 'Нуарный кошмар',
      desc: 'звучит сложно, но всё легко: просто не ошибайся)',
      descRules: 'после одного прыжка по облачку оно тут же разрушается'
    },
    worldBehindMirrors: {
      cloudColor: 'blue',
      header: 'Зазеркалье',
      desc: 'тоже всё несложно,.. если сначала немножко сойти с ума',
      descRules: 'после одного прыжка по облачку все облачка отзеркаливаются по горизонтали'
    }
  };
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
};

export { renderWorlds };
