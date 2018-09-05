import { Fragment } from 'react';
import PropTypes from 'prop-types';
import translate from 'react-i18next/dist/commonjs/translate';

import styles from './Mission.scss';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import getId from '../../lib/idGenerator';

const desktopCirclesArray = [
  { style: ['circle'] },
  { style: ['circle'] },
  { style: ['circle', 'right'] },
];

const mobileAndTabletCirclesArray = [
  { style: ['circle'] },
  { style: ['circle'] },
  { style: ['circle', 'top'] },
  { style: ['circle', 'bottom'] },
];

const desktopRows = [
  { text: null },
  { text: 'mission-desktop.first-row' },
  { text: 'mission-desktop.second-row' },
  { text: null },
  { text: 'mission-desktop.third-row' },
  { text: 'mission-desktop.fourth-row' },
];

const tabletRows = [
  { text: 'mission-tablet.first-row' },
  { text: 'mission-tablet.second-row' },
  { text: 'mission-tablet.third-row' },
  { text: null },
  { text: 'mission-tablet.fourth-row' },
  { text: 'mission-tablet.fifth-row' },
  { text: null },
];

const mobileRows = [
  { text: 'mission-mobile.first-row', hide: 'hide' },
  { text: 'mission-mobile.second-row' },
  { text: 'mission-mobile.third-row' },
  { text: null },
  { text: 'mission-mobile.fourth-row' },
  { text: 'mission-mobile.fifth-row' },
  { text: 'mission-mobile.sixth-row' },
  { text: null },
];

const Circle = props => {
  const { style } = props;
  const currentStyles = style.map(val => val.map(v => styles[v]));
  return (
    <div className={ currentStyles.join(' ').replace(',', ' ') } />
  );
};

const Circles = props => (
  props.circles.map(val => <Circle key={ getId() } style={ [val.style] } />)
);

const Row = props => {
  const {
    text,
    hide,
    t,
    lang,
  } = props;
  return (
    <div className={ styles.row }>
      <hr className={ styles[hide] } />
      { text && <p className={ styles[lang] }>{ t(text) }</p> }
    </div>
  );
};

const Rows = props => (
  props.rows.map(row => (
    <Row
      text={ row.text }
      hide={ row.hide }
      key={ getId() }
      t={ props.t }
      lang={ props.lang }
    />
  ))
);

const Mission = ({ t, lang }) => (
  <Fragment>
    <SectionTitle title={ t('common:sidebar-mission') } color="black" />

    <div className={ styles.main }>
      <Circles circles={ desktopCirclesArray } />
      <Rows rows={ desktopRows } t={ t } lang={ lang } />
    </div>

    <div className={ styles['main-tablet'] }>
      <Circles circles={ mobileAndTabletCirclesArray } />
      <Rows rows={ tabletRows } t={ t } lang={ lang } />
    </div>

    <div className={ styles['main-mobile'] }>
      <Circles circles={ mobileAndTabletCirclesArray } />
      <Rows rows={ mobileRows } t={ t } lang={ lang } />
    </div>
  </Fragment>
);

Row.defaultProps = {
  text: null,
  hide: null,
  t: null,
  lang: null,
};

Circle.defaultProps = {
  style: null,
};

Mission.defaultProps = {
  t: null,
  lang: null,
};

Row.propTypes = {
  text: PropTypes.string,
  hide: PropTypes.string,
  t: PropTypes.func,
  lang: PropTypes.string,
};

Circle.propTypes = {
  style: PropTypes.arrayOf(PropTypes.array),
};

Mission.propTypes = {
  t: PropTypes.func,
  lang: PropTypes.string,
};

export default translate(['main', 'common'])(Mission);
