export enum AlertType {
  CLOSE,
  ADVICE,
  CASUAL,
  MONITOR,
  UNKNOWN,
}

export function getAlertType(alert: string) {
  if (alert.includes('14 days')) {
    return AlertType.CLOSE;
  }
  if (alert.includes('further advice')) {
    return AlertType.ADVICE;
  }
  if (alert.includes('negative result')) {
    return AlertType.CASUAL;
  }
  if (alert.includes('Monitor for symptoms')) {
    return AlertType.MONITOR;
  }
  return AlertType.UNKNOWN;
}

export function coordsToPosition({
  lat,
  lng,
}: {
  lat: string | number;
  lng: string | number;
}) {
  return { lat: Number(lat), lng: Number(lng) };
}
