import styles from './Input.scss';
import { VALIDATORS } from '../../../tools/validation';

export const Input = props => {
  const classes = [styles.input, props.className];
  const rules = {
    required: null,
    minLength: null,
    maxLength: null,
  };

  if (props.validation) {
    props.validation.forEach(v => {
      if (!rules.required) rules.required = v.type === VALIDATORS.REQUIRED;
      if (!rules.minLength) rules.minLength = v.type === VALIDATORS.MIN_LENGTH || null;
      if (!rules.maxLength) rules.maxLength = v.type === VALIDATORS.MAX_LENGTH || null;
    });
  }

  if (props.blurred && !props.valid) {
    classes.push(styles.invalid);
  }

  return (
    <input
      className={ classes.join(' ') }
      name={ props.name }
      value={ props.value }
      type={ props.type || 'text' }
      onChange={ props.onChange }
      onBlur={ props.onBlur }
      placeholder={ props.placeholder || '' }
      autoComplete={ props.autoComplete || 'off' }
      { ...rules }
    />
  );
};
