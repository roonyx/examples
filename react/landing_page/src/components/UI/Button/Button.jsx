import style from './Button.scss';

const link = (comp, href) => (
  <a href={ href } target="_blank" rel="noopener noreferrer">
    { comp }
  </a>
);

export const Button = props => {
  let btnClasses = [style.btn];

  if (props.classes) {
    if (Array.isArray(props.classes)) {
      btnClasses = [...btnClasses, ...props.classes];
    } else if (typeof props.classes === typeof '') {
      btnClasses = [...btnClasses, ...(props.classes.split(' '))];
    }
  }

  if (props.type === 'primary') {
    btnClasses.push(style.primary);
  } else if (props.type === 'dark') {
    btnClasses.push(style.dark);
  }

  const button = (
    <button
      type={ props.btnType || 'button' }
      onClick={ !props.link ? props.onClick : null }
      className={ btnClasses.join(' ') }
    >
      { props.children }
    </button>
  );

  return props.link ? link(button, props.link) : button;
};
