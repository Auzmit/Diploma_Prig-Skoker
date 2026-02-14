function randomInteger(min, max) {
  let randomNumber = Math.random() * (max - min + 1) + min;
  return Math.floor(randomNumber);
}

function randomLeftOrRight() {
  return randomInteger(0, 1) === 0 ? 'left' : 'right';
}

export { randomInteger, randomLeftOrRight };
