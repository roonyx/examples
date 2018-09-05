import { btn } from './Arrow.scss';

export const Arrow = ({ onClick, direction, style }) => {
  let src;
  switch (direction.toLowerCase()) {
    case ('left'):
      src = '/static/images/icons/arrow-left.png';
      break;
    case ('right'):
      src = '/static/images/icons/arrow-right.png';
      break;
    case ('right-long'):
      src = '/static/images/icons/arrow-right-long.png';
      break;
    default:
      break;
  }

  const classes = [btn];
  if (style) classes.push(...style);

  return (
    <button
      className={ classes.join(' ') }
      onClick={ onClick }
    >
      <img
        src={ src }
        alt="icon"
      />
    </button>
  );
};
