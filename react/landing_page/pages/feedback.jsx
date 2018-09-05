import { Component } from 'react';
import Router from 'next/router';
import ReactGA from 'react-ga';
import { YMInitializer } from 'react-yandex-metrika';
import { withI18N } from '../src/hoc/withI18N';
import styles from '../static/styles/index-page.scss';
import { Button } from '../src/components/UI/Button/Button';
import btnStyles from '../src/components/UI/Button/Button.scss';

class ContactFeedback extends Component {
  componentDidMount() {
  }

  onClick = () => {
    Router.push('/');
  }

  render() {
    return (
      <div className={ styles.feedbackPage }>
        <p>{ this.props.t('contacts-submit-text1') } { this.props.t('contacts-submit-text2') }</p>
        <Button classes={ btnStyles.btn } onClick={this.onClick}>
          { this.props.t('return-button') }
        </Button>
      </div>
    );
  }
}

export default withI18N(['main'])(ContactFeedback);
