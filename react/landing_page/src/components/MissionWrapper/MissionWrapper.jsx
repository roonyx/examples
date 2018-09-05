import { Component, Fragment } from 'react';

import StringAnimationContainer from '../StringsAnimation/StringAnimationContainer';
import Mission from '../Mission/Mission';
import styles from './MissionWrapper.scss';

class MissionWrapper extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.lang !== nextProps.lang;
  }

  render() {
    return (
      <Fragment>
        <div className={ styles.missionNotDesktop }>
          <Mission lang={ this.props.lang } />
        </div>
        <div className={ styles.missionDesktop }>
          <StringAnimationContainer lang={ this.props.lang } />
        </div>
      </Fragment>
    );
  }
}

export default MissionWrapper;

