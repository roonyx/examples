import { Component, Fragment } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';

import contacts from '../../constants/contacts';
import getId from '../../lib/idGenerator';
import styles from './Sidebar.scss';

class Sidebar extends Component {
  shouldComponentUpdate(nextProps) {
    return (
      this.props.isOpen !== nextProps.isOpen ||
      this.props.lang !== nextProps.lang
    );
  }

  renderList = () => (
    Object.keys(this.props.sections).map(section => (
      <li key={ getId() }>
        <button className={ styles.btn } onClick={ () => this.props.scrollToSection(section) }>
          { this.props.t(this.props.sections[section].title) }
        </button>
      </li>
    ))
  );

  render() {
    const classes = [styles.sidebar];
    if (this.props.isOpen) classes.push(styles.open);

    return (
      <div className={ classes.join(' ') }>
        <div className={ styles.iconWrap }>
          <div
            role="button"
            tabIndex="0"
            className={ styles.navIcon }
            onClick={ this.props.sidebarToggle }
            onKeyPress={ this.props.sidebarToggle }
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={ styles.itemsWrap }>
          <ul className={ styles.items }>
            { this.props.isOpen ? this.renderList() : null }
          </ul>
        </div>
        <div className={ styles.langWrap }>
          <span className={ styles.socialIcons }>
            { this.props.isOpen ? (
              <Fragment>
                <a href={ contacts.social.linkedin } target="_blank" rel="noopener noreferrer">
                  <img src="/static/images/icons/linkedin.svg" alt="linkedin" />
                </a>
                <a href={ contacts.social.instagram } target="_blank" rel="noopener noreferrer">
                  <img src="/static/images/icons/instagram.svg" alt="instagram" />
                </a>
              </Fragment>
            ) : null }
          </span>
          <span
            role="button"
            tabIndex="0"
            className={ styles.lang }
            onClick={ () => this.props.changeLanguage() }
            onKeyPress={ () => this.props.changeLanguage() }
          >
            { this.props.lang }
          </span>
        </div>
        <div className={ styles.logo }>roonyx</div>
      </div>
    );
  }
}

export default translate(['common'])(Sidebar);
