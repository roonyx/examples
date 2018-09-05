const detect = {
  startX: 0,
  startY: 0,
  endX: 0,
  endY: 0,
  minX: 30,
  maxX: 30,
  minY: 50,
  maxY: 60,
};

export const onTouchStart = e => {
  const touch = e.touches[0];
  detect.startX = touch.screenX;
  detect.startY = touch.screenY;
};

export const onTouchMove = e => {
  e.preventDefault();
  const touch = e.touches[0];
  detect.endX = touch.screenX;
  detect.endY = touch.screenY;
};

export const onTouchEnd = (cb = {}) => {
  let direction;
  if ((Math.abs(detect.endX - detect.startX) > detect.minX)
  && (Math.abs(detect.endY - detect.startY) < detect.maxY)) {
    direction = (detect.endX > detect.startX) ? 'right' : 'left';
  } else if ((Math.abs(detect.endY - detect.startY) > detect.minY)
  && (Math.abs(detect.endX - detect.startX) < detect.maxX)) {
    direction = (detect.endY > detect.startY) ? 'up' : 'down';
  }

  if (direction === 'right' && cb.right) {
    cb.right();
  }

  if (direction === 'left' && cb.left) {
    cb.left();
  }

  if (direction === 'up' && cb.up) {
    cb.up();
  }

  if (direction === 'down' && cb.down) {
    cb.down();
  }
};
