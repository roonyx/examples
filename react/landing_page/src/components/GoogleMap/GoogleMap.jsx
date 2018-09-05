import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { baseUrl } from '../../lib/getBaseUrl';
import * as mapStyles from './GoogleMap.style.json';

const coords = {
  lat: 42.499719,
  lng: -71.161281,
};

export const Map = withScriptjs(withGoogleMap(props => (
  <GoogleMap
    defaultOptions={{
      styles: mapStyles,
      streetViewControl: false,
      scaleControl: false,
      mapTypeControl: false,
      panControl: false,
      zoomControl: false,
      rotateControl: false,
      fullscreenControl: false,
    }}
    defaultZoom={ 17 }
    defaultCenter={{ lat: coords.lat, lng: coords.lng }}
  >
    {
      props.isMarkerShown &&
      <Marker
        position={{ lat: coords.lat, lng: coords.lng }}
        defaultOptions={{ scale: 30 }}
        icon={{ url: `${baseUrl()}/static/images/marker.png` }}
      />
    }
  </GoogleMap>
)));
