function initSkoker(gameState) {
  let { screen, skoker } = gameState;
  const skokerWidth = screen.width / 13;
  const skokerHeight = screen.height / 26;
  
  skoker = Object.assign(skoker, {
    width: skokerWidth,
    height: skokerHeight,
    x: screen.width / 2 - skokerWidth / 2,
    y: screen.height * 0.9 - skokerHeight,
    image: skoker.sprites.skokerRight,
    domElement: null
  });
}

function renderSkoker(gameState) {
  let { skoker } = gameState;

  if (Object.keys(skoker).length === 1) initSkoker(gameState);
  let $imgSkoker = skoker.domElement;
  
  if (!$imgSkoker) {
    $imgSkoker = skoker.domElement = document.createElement('img');
    $imgSkoker.id = 'skoker';
    $imgSkoker.setAttribute('data-game-element', 'skoker');
    
    Object.assign($imgSkoker.style, {
      position: 'absolute',
      zIndex: 20,
      width: `${skoker.width}px`,
      height: `${skoker.height}px`,
      objectFit: 'fill',
      filter: 'drop-shadow(2px 4px 3px rgba(0, 0, 0, 0.3))'
    });
    document.body.appendChild($imgSkoker);
  }

  $imgSkoker.src = skoker.image.src;
  $imgSkoker.style.left = `${skoker.x}px`;
  $imgSkoker.style.top = `${skoker.y}px`;
}

export { initSkoker, renderSkoker };
