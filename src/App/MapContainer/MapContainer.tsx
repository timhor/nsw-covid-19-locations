import React from 'react';
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api';
import { Location } from '../types';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: -33.85,
  lng: 151.04,
};

function MapContainer({ locations }: { locations: Location[] }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey!,
  });

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
      {locations.map((location, index) => (
        <Marker
          key={index}
          position={{ lat: Number(location.Lat), lng: Number(location.Lon) }}
        />
      ))}
    </GoogleMap>
  ) : null;
}

export default React.memo(MapContainer);
