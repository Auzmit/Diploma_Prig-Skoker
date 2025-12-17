function renderWorlds() {
  const menuWrapper = document.querySelector('.worldsMenu');
  const worlds = {
    worldMulticolors: {
      cloudColor: 'multiColor',
      header: 'Мультицвет',
      desc: 'жизнь как она есть: со своими взлётами и падениями'
    },
    worldChild: {
      cloudColor: 'yellow',
      header: 'Детский',
      desc: 'всё просто - даже ребёнок справится'
    },
    worldNoir: {
      cloudColor: 'grey',
      header: 'Нуар',
      desc: 'это сложный мир, но он даёт один раз ошибиться на каждом шаге'
    },
    worldGLM: {
      cloudColor: 'green',
      header: 'Green Lives Matter',
      desc: 'движение это жизнь, да? А природа - это и есть движение!'
    },
    worldBadabum: {
      cloudColor: 'red',
      header: 'БА-ДА-БУ-У-УМ!!!',
      desc: 'а ты знаешь, что такое rocket jump?'
    },
    worldNoirNightmare: {
      cloudColor: 'black',
      header: 'Нуарный кошмар',
      desc: 'звучит сложно, но на самом деле всё легко: просто не ошибайся)'
    },
    worldBehindMirrors: {
      cloudColor: 'blue',
      header: 'Зазеркалье',
      desc: 'тоже всё несложно,.. если сначала немножечко сойти с ума'
    }
  };
  Object.entries(worlds).forEach(([worldKey, worldData]) => {
    const div = document.createElement('div');
    div.className = `menuWorldButton ${worldKey}`;
    
    div.innerHTML = `
      <header class="worldHeader">${worldData.header}</header>
      <p class="worldDesc">${worldData.desc}</p>
    `;
    
    menuWrapper.appendChild(div);
  });
};

export { renderWorlds };
