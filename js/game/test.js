let skoker = {
  width: 10,
  sprites: {},
  height: 30
}

for (let key in skoker) {
  if (key !== 'sprites') {
    console.log('not sprites');
    break;
  }
}