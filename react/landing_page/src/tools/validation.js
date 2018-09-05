export const VALIDATORS = {
  REQUIRED: Symbol('required'),
  MIN_LENGTH: Symbol('min length'),
  MAX_LENGTH: Symbol('max length'),
  EMAIL: Symbol('email'),
};

export const PATTERNS = {
  // eslint-disable-next-line
  EMAIL: new RegExp('^([a-z0-9_\.-]+)@([\da-z\.-]+)$'),
};

export const checkValidity = (value, rules = []) => {
  let isValid = true;

  rules.forEach(rule => {
    if (isValid && rule.type === VALIDATORS.REQUIRED) {
      isValid = value.trim() !== '';
    }

    if (isValid && rule.type === VALIDATORS.MIN_LENGTH) {
      isValid = value.length >= rule.val;
    }

    if (isValid && rule.type === VALIDATORS.MAX_LENGTH) {
      isValid = value.length <= rule.val;
    }

    if (isValid && rule.type === VALIDATORS.EMAIL) {
      isValid = Boolean(value.search(PATTERNS.EMAIL) + 1);
    }
  });

  return isValid;
};
