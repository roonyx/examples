/* eslint no-bitwise: ["error", { "allow": ["<<", "&"] }] */
import { Component } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';
import { scroller } from 'react-scroll';
import TextareaAutosize from 'react-autosize-textarea';
import Router from 'next/router';
import { Input } from '../UI/Input/Input';
import { Button } from '../UI/Button/Button';
import { checkValidity } from '../../tools/validation';
import { TEXT_AREA_STYLE } from '../../../src/constants/textAreaStyle';
import { FIELDS, HASH_FIELD_DATA } from '../../constants/formFields';
import { TEXT_AREA_TYPE, INPUT_TYPE } from '../../constants/inputConstants';
import { SECTION_PORTFOLIO_TYPE, MAIN_WRAPPER_TYPE } from '../../constants/sections';
import { baseUrl } from '../../lib/getBaseUrl';
import styles from './ContactForm.scss';

const HIDDEN_FIELD = 'hidden';
class ContactForm extends Component {
  state = {
    form: {
      valid: false,
    },
    showMessage: false,
    messageTimeout: null,
  }

  onChange = (e, name) => {
    const isFieldValid = checkValidity(e.target.value, FIELDS[name].validation);
    this.setState({
      [name]: {
        value: e.target.value,
        valid: isFieldValid,
      },
    });
  }

  scrollToPortfolio = () => {
    scroller.scrollTo(SECTION_PORTFOLIO_TYPE, {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart',
      containerId: MAIN_WRAPPER_TYPE,
    });
  }

  onBlur = (e, name) => {
    if (FIELDS[name].blurred) {
      return;
    }

    const updatedForm = { ...this.state.form };
    const updatedField = FIELDS[name];

    updatedField.blurred = true;
    FIELDS[name] = updatedField;
    this.setState({ form: updatedForm });
  }

  onSubmit = e => {
    e.preventDefault();
    if (!this.isFormValid()) {
      return null;
    }

    if (this.state.messageTimeout) {
      clearTimeout(this.state.messageTimeout);
      this.setState({ messageTimeout: null });
    }

    const formData = {};
    const cleanForm = {};
    let hashData = 0;
    Object.keys(FIELDS).forEach(key => {
      hashData += this.getHash(this.state[key] ? this.state[key].value : '');
      formData[key] = this.state[key] || '';
      cleanForm[key] = '';
    });

    formData[HASH_FIELD_DATA] = hashData;
    fetch(`${baseUrl()}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: formData,
      }),
    });

    Router.push('/feedback');
  }

  isFormValid = () => {
    let isFormValid = true;
    Object.keys(FIELDS).forEach(name => {
      if ((!this.state[name] || !this.state[name].valid) && !FIELDS[name].isHidden) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  getHash = (s) => s.split('').reduce((a, b) => {
    let hash = a;
    hash = ((hash << 5) - hash) + b.charCodeAt(0);
    return hash & hash;
  }, 0)

  hideMessage = () => {
    const messageTimeout = setTimeout(() => {
      clearTimeout(this.state.messageTimeout);
      this.setState({
        showMessage: false,
        messageTimeout: null,
      });
    }, 7000);

    this.setState({ messageTimeout });
  }

  renderInputs = () => (
    Object.keys(FIELDS).map(name => {
      let value = null;
      let valid = false;
      if (this.state[name]) {
        value = this.state[name].value;
      } else {
        value = FIELDS[name].value;
      }
      if (this.state[name]) {
        valid = this.state[name].valid;
      }

      const hiddenClass = FIELDS[name].isHidden ? styles[HIDDEN_FIELD] : null;
      switch (FIELDS[name].inputType) {
        case (INPUT_TYPE):
          return (<Input
            key={ name }
            name={ name }
            placeholder={ this.props.t(`common:${FIELDS[name].label}`) }
            type={ FIELDS[name].type }
            value={ value }
            valid={ valid }
            blurred={ FIELDS[name].blurred }
            className={ hiddenClass }
            onChange={ e => this.onChange(e, name) }
            onBlur={ e => this.onBlur(e, name) }
            validation={ FIELDS[name].validation }
          />);
        case (TEXT_AREA_TYPE):
          return (<TextareaAutosize
            key={ name }
            name={ name }
            placeholder={ this.props.t(`common:${FIELDS[name].label}`) }
            value={ value }
            onChange={ e => this.onChange(e, name) }
            onBlur={ e => this.onBlur(e, name) }
            className={ styles[TEXT_AREA_STYLE] }
            maxRows={ 12 }
          />);
        default:
          return null;
      }
    })
  )

  render() {
    return (
      <div className={ styles.wrapper }>
        <form
          onSubmit={ this.onSubmit }
          className={ styles.form }
        >
          <div className={ styles.inputsWrapper }>
            { this.renderInputs() }
          </div>
          <Button classes={ styles.btn } btnType="submit">
            { this.props.t('contacts-button') }
          </Button>
        </form>
      </div>
    );
  }
}

export default translate(['main', 'common'])(ContactForm);
