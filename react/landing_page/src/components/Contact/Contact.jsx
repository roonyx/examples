import { Component, Fragment } from 'react';
import translate from 'react-i18next/dist/commonjs/translate';

import { Map } from '../GoogleMap/GoogleMap';
import ContactForm from '../ContactForm/ContactForm';
import { SectionTitle } from '../SectionTitle/SectionTitle';
import styles from './Contact.scss';

const googleApiKey = 'AIzaSyDLfMxYjDinZddHQnO8S_TbAok2jJqnCJw';
const gmUrl = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`;

class Contact extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.lang !== nextProps.lang;
  }

  render() {
    return (
      <Fragment>
        <SectionTitle title={ this.props.t('contacts-section') } />
        <div className={ styles.contactBlock }>
          <div className={ styles.map }>
            <Map
              isMarkerShown
              googleMapURL={ gmUrl }
              loadingElement={ <Fragment /> }
              containerElement={ <Fragment /> }
              mapElement={ <div style={{ height: '100%' }} /> }
            />
          </div>
          <div className={ styles.formWrapper }>
            <div className={ styles.form }>
              <ContactForm />
            </div>
          </div>
          <div className={ styles.header }>
            <h1 className={ styles.title }>
              { this.props.t('contacts-address-street-1') }
            </h1>
            <h1 className={ styles.title }>
              { this.props.t('contacts-address-street-2') }
            </h1>
            <h1 className={ styles.title }>
              { this.props.t('contacts-address-city') }
            </h1>
            <h1 className={ styles.title }>
              { this.props.t('contacts-address-number') }
            </h1>
            <h1 className={ styles.title }>
              { this.props.t('contacts-address-country') }
            </h1>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default translate(['main'])(Contact);
