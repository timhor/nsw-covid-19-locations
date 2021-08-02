import React from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { Location } from '../types';
import { AlertType, getAlertType } from '../utils';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: -33.85,
  lng: 151.04,
};

function getIcon(alert: string) {
  const ALERT_ICON_COMMON = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 6,
    strokeColor: 'white',
    strokeWeight: 2,
    fillOpacity: 1.0,
  };

  const alertType = getAlertType(alert);
  switch (alertType) {
    case AlertType.CLOSE:
      return {
        ...ALERT_ICON_COMMON,
        fillColor: 'red',
      };
    case AlertType.ADVICE:
      return {
        ...ALERT_ICON_COMMON,
        fillColor: 'brown',
      };
    case AlertType.CASUAL:
      return {
        ...ALERT_ICON_COMMON,
        fillColor: 'orange',
      };
    case AlertType.MONITOR:
      return {
        ...ALERT_ICON_COMMON,
        fillColor: '#0398fc',
      };
    default:
      return {
        ...ALERT_ICON_COMMON,
        fillColor: 'black',
      };
  }
}

function generateMarker(location: Location, index: number) {
  const position = { lat: Number(location.Lat), lng: Number(location.Lon) };
  const icon = getIcon(location.Alert);
  return <Marker key={index} position={position} icon={icon} />;
}

function MapContainer({ locations }: { locations: Location[] }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey!,
  });

  const markers = locations.map((location, index) =>
    generateMarker(location, index)
  );

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
      {markers}
    </GoogleMap>
  ) : null;
}

export default React.memo(MapContainer);
