import { VALIDATORS } from '../tools/validation';
import inputConstants from './inputConstants';

export const HASH_FIELD_DATA = inputConstants.EMPTY_FIELD;
export const FIELDS = {
  [inputConstants.NAME_FIELD]: {
    inputType: inputConstants.INPUT_TYPE,
    type: inputConstants.TEXT_TYPE,
    label: 'field-name',
    value: '',
    validation: [
      { type: VALIDATORS.REQUIRED },
    ],
    valid: false,
    blurred: false,
  },
  [inputConstants.EMAIL_FIELD]: {
    inputType: inputConstants.INPUT_TYPE,
    type: inputConstants.EMAIL_TYPE,
    label: 'field-email',
    value: '',
    validation: [
      { type: VALIDATORS.REQUIRED },
      { type: VALIDATORS.EMAIL },
    ],
    valid: false,
    blurred: false,
  },
  [inputConstants.PHONE_FIELD]: {
    inputType: inputConstants.INPUT_TYPE,
    type: inputConstants.PHONE_TYPE,
    label: 'field-phone',
    value: '',
    validation: [
      { type: VALIDATORS.REQUIRED },
      { type: VALIDATORS.PHONE },
    ],
    valid: false,
    blurred: false,
  },
  [inputConstants.MESSAGE_FIELD]: {
    inputType: inputConstants.TEXT_AREA_TYPE,
    type: inputConstants.TEXT_TYPE,
    label: 'field-message',
    value: '',
    validation: [
    ],
    valid: true,
    blurred: false,
  },
  [inputConstants.EMPTY_FIELD]: {
    inputType: inputConstants.INPUT_TYPE,
    type: inputConstants.TEXT_TYPE,
    label: 'empty',
    value: '',
    isHidden: true,
    hashField: true,
  },
};
