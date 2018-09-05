import { Component } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';

import { BACK_SECTION_IMAGE } from '../../constants/sections';
import styles from './SectionTitle.scss';

export class SectionTitle extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.title !== nextProps.title ||
      this.props.color !== nextProps.color ||
      this.props.isActiveHeadBackButton !== nextProps.isActiveHeadBackButton
    );
  }

  render() {
    return (
      <div
        onClick={ () => this.props.onClickHandler() }
        className={ styles.sectionTitle }
      >
        { this.props.isActiveHeadBackButton ? <img {...BACK_SECTION_IMAGE} /> : null }
        <button className={ styles.btn } >
          <h1 className={ styles[this.props.color] }>{ this.props.title }</h1>
        </button>
      </div>
    );
  }
}
