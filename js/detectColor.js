export default function detectColor(skoker, cloud, initialVelocityY) {
  // normal jump
  velocityY = initialVelocityY;
  // init jump audio
  let audioDetectColor = new Audio();

  if (cloud.color === 'yellow') {
    velocityY = initialVelocityY * 2.2;

    if (isSoundOn) {
      audioDetectColor.src = `./recources/recources/sounds/trampoline_jumps/${randomInteger(1, 2)}.mp3`;
      audioDetectColor.play();
    }

  } else if (cloud.color === 'blue') {
    // mirroring clouds
    for (let currentCloud of arrCloud) {
      let cloudCenter = currentCloud.x + cloudWidth/2;
      if (cloudCenter >= canvasWidth/2) {
        cloudCenter = canvasWidth/2 - (cloudCenter - canvasWidth/2);
      } else {
        cloudCenter = canvasWidth/2 + (canvasWidth/2 - cloudCenter);
      }
      currentCloud.x = cloudCenter - cloudWidth/2;
    };

    if (isSoundOn) {
      audioDetectColor.src = './recources/sounds/swipe.mp3';
      audioDetectColor.play();
    }

  } else if (cloud.color === 'grey') {
    // grey turns to black
    cloud.color = 'black';
    cloud.image.src = 
      `./recources/images/clouds/colored/cloud-${randomLeftOrRight()}-1-black.png`;

  } else if (cloud.color === 'black') {
    // disappearance Black clouds
    cloud.collision = false;
    cloud.color = 'transparent';
    cloud.image.src = './recources/images/clouds/transparent_1x1.png';

  } else if (cloud.color === 'red') {
    // explodes & disappear - farther skoker is from the center of the cloud,
    // harder kicks him away along X & turns him in direction which he is moving
    velocityY = initialVelocityY * 1.3;

    let xDistanceSkokerCloud = (skoker.x + skoker.width/2)
      - (cloud.x + cloud.width/2);
    let coeffShiftSkokerX = xDistanceSkokerCloud/(cloud.width/2);
    coeffShiftSkokerX *= 0.3;

    coeffShiftSkokerX += (coeffShiftSkokerX >= 0) ? 1 : -1;
    velocityX = shiftSkokerX * coeffShiftSkokerX;
    if (velocityX < 0) {
      skoker.image = skokerLeftImage;
    } else skoker.image = skokerRightImage;

    cloud.image.src = './recources/images/clouds/transparent_1x1.png';
    cloud.color = 'transparent';
    cloud.collision = false;

    if (isSoundOn) {
      audioDetectColor.src = './recources/sounds/explosion.mp3';
      audioDetectColor.play();
    }

  } else if (cloud.color === 'green') {
    // do nothing - the cloud drives itself anyway
  };
  
  if (isSoundOn) {
    if (!audioDetectColor.src) {
      audioDetectColor.src = './recources/sounds/trampoline_jumps/0.mp3';
      audioDetectColor.play();
    }
  }
};
