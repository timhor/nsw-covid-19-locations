import React, { useState } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { Location } from '../types';
import { AlertType, coordsToPosition, getAlertType } from '../utils';

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

function generateMarker(
  location: Location,
  index: number,
  setSelected: Function
) {
  const position = coordsToPosition({ lat: location.Lat, lng: location.Lon });
  const icon = getIcon(location.Alert);
  const onClick = () => {
    setSelected(location);
  };

  return (
    <Marker
      key={index}
      title={location.Venue}
      position={position}
      icon={icon}
      onClick={onClick}
    />
  );
}

function MapContainer({ locations }: { locations: Location[] }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey!,
  });

  const [selected, setSelected] = useState<Location | null>(null);

  let markers: JSX.Element[] = [];
  if (locations.length > 0 && isLoaded) {
    markers = locations.map((location, index) =>
      generateMarker(location, index, setSelected)
    );
  }

  return isLoaded ? (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={11}>
      {selected && (
        <InfoWindow
          position={coordsToPosition({ lat: selected.Lat, lng: selected.Lon })}
          onCloseClick={() => {
            setSelected(null);
          }}
        >
          <>
            <h3>Venue</h3>
            <p>
              <em>{selected.Venue}</em>
            </p>
            <p>{`${selected.Address}, ${selected.Suburb}`}</p>
            <h3>Date &amp; Time</h3>
            <p>{`${selected.Date}, ${selected.Time}`}</p>
            <h3>Health Advice</h3>
            <p
              dangerouslySetInnerHTML={{ __html: selected.HealthAdviceHTML }}
            />
          </>
        </InfoWindow>
      )}
      {markers}
    </GoogleMap>
  ) : null;
}

export default React.memo(MapContainer);
