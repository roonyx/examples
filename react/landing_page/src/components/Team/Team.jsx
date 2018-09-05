import { Fragment } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import { Arrow } from '../UI/Arrow/Arrow';
import TeamAnimationContainer from '../TeamAnimation/TeamAnimationContainer';

import styles from './Team.scss';

const Team = ({ t, startRiver }) => (
  <Fragment>
    <SectionTitle title={ t('common:sidebar-team') } color="black" />
    <div className={ styles.container }>
      <TeamAnimationContainer start={ startRiver } />
    </div>
  </Fragment>
);

export default translate(['main', 'common'])(Team);
