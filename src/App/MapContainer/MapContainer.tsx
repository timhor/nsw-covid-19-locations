import React, { useState, useMemo, useCallback } from 'react';
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import { Location } from '../types';
import { AlertType, coordsToPosition, getAlertType } from '../utils';

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const markerBasePath = `${process.env.PUBLIC_URL}/markers`;

const containerStyle = {
  width: '100vw',
  height: '100%',
};

const center = {
  lat: -33.85,
  lng: 151.04,
};

const mapOptions: google.maps.MapOptions = {
  gestureHandling: 'greedy',
  clickableIcons: false,
  mapTypeControl: false,
  streetViewControl: false,
};

function getIcon(alert: string) {
  const ALERT_ICON_COMMON = {
    scaledSize: new google.maps.Size(12, 12),
    anchor: new google.maps.Point(6, 6),
  };

  const alertType = getAlertType(alert);
  switch (alertType) {
    case AlertType.CLOSE:
      return {
        ...ALERT_ICON_COMMON,
        url: `${markerBasePath}/red-circle.png`,
      };
    case AlertType.ADVICE:
      return {
        ...ALERT_ICON_COMMON,
        url: `${markerBasePath}/brown-circle.png`,
      };
    case AlertType.CASUAL:
      return {
        ...ALERT_ICON_COMMON,
        url: `${markerBasePath}/orange-circle.png`,
      };
    case AlertType.MONITOR:
      return {
        ...ALERT_ICON_COMMON,
        url: `${markerBasePath}/blue-circle.png`,
      };
    default:
      return {
        ...ALERT_ICON_COMMON,
        url: `${markerBasePath}/black-circle.png`,
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
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  let allMarkers = useMemo(() => {
    if (locations.length > 0 && isLoaded) {
      return locations.map((location, index) =>
        generateMarker(location, index, setSelected)
      );
    }
    return [];
  }, [locations, isLoaded]);

  const [markers, setMarkers] = useState<JSX.Element[]>([...allMarkers]);

  const onLoad = (mapInstance: google.maps.Map) => {
    setMapInstance(mapInstance);
  };

  const onIdle = useCallback(() => {
    const bounds = mapInstance?.getBounds();
    const filteredMarkers = allMarkers.filter((marker) =>
      bounds!.contains(marker.props.position)
    );
    setMarkers(filteredMarkers);
  }, [mapInstance, allMarkers]);

  return isLoaded ? (
    <GoogleMap
      onLoad={onLoad}
      onIdle={onIdle}
      mapContainerStyle={containerStyle}
      center={center}
      zoom={11}
      options={mapOptions}
    >
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
