const METRES_PER_MILE = 1609.344;

export function metresToMiles(metres: number): string {
  const miles = metres / METRES_PER_MILE;
  if (miles < 0.1) {
    const feet = Math.round(metres * 3.28084);
    return `${feet} ft`;
  }
  if (miles < 10) {
    return `${miles.toFixed(1)} mi`;
  }
  return `${Math.round(miles)} mi`;
}

export function secondsToMinutes(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}
