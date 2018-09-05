import { Component } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';

import { SECTIONS, BACK_SECTION_IMAGE } from '../../constants/sections';
import styles from './Head.scss';

const BLACK_LOGO = 'static/images/black-logo.svg';
const WHITE_LOGO = 'static/images/white-logo.svg';

class Head extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.lang !== nextProps.lang ||
      this.props.section !== nextProps.section ||
      this.props.isActiveHeadBackButton !== nextProps.isActiveHeadBackButton
    );
  }

  render() {
    const { isDark, title, isHeadWithoutTitle } = SECTIONS[this.props.section];
    const titleBlock = this.props.onSwipeMain
      ? (<button className={ styles.btn }>{ this.props.t(title) }</button>)
      : this.props.t(title);

    return (
      <div className={ styles.head }>
        <img className={ styles.logo } src={isDark || this.props.isActiveHeadBackButton ? BLACK_LOGO : WHITE_LOGO } />
        {(this.props.isActiveHeadBackButton ? <img
          onClick={ () => this.props.onSwipeMain() }
          className={ styles.back }
          {...BACK_SECTION_IMAGE}
        /> : null)}
        <div
          onClick={ this.props.isActiveHeadBackButton ? () => this.props.onSwipeMain() : null }
          className={ [styles.title, isDark || this.props.isActiveHeadBackButton ? styles.dark : null].join(' ') }
        >
          { isHeadWithoutTitle ? null : titleBlock }
        </div>
      </div>
    );
  }
}

export default translate(['common'])(Head);
