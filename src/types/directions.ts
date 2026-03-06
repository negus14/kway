export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ParsedRoute {
  originQuery: string | null;
  destinationQuery: string;
}

export interface GeocodedPlace {
  coords: Coordinates;
  label: string;
}

export interface RouteStep {
  instruction: string;
  roadName: string;
  distanceMetres: number;
  maneuverType: string;
}

export interface DirectionsResult {
  origin: GeocodedPlace;
  destination: GeocodedPlace;
  steps: RouteStep[];
  totalDistanceMetres: number;
  totalDurationSeconds: number;
}

export type DirectionsState =
  | {status: 'idle'}
  | {status: 'loading'; stage: string}
  | {status: 'needs_origin'; destinationQuery: string}
  | {status: 'success'; directions: DirectionsResult}
  | {status: 'error'; message: string};
