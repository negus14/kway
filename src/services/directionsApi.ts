import {GOOGLE_DIRECTIONS_API_KEY} from '../config';
import {DirectionsResult, GeocodedPlace, RouteStep} from '../types/directions';

const BASE_URL = 'https://maps.googleapis.com/maps/api/directions/json';

/**
 * Fetches driving directions from Google Directions API.
 * Origin and destination can be plain text (e.g. "Waterloo Station, London")
 * or coordinate strings — no separate geocoding step needed.
 */
export async function fetchDirections(
  originQuery: string,
  destinationQuery: string,
): Promise<DirectionsResult> {
  const url = new URL(BASE_URL);
  url.searchParams.set('origin', originQuery);
  url.searchParams.set('destination', destinationQuery);
  url.searchParams.set('mode', 'driving');
  url.searchParams.set('key', GOOGLE_DIRECTIONS_API_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Google Directions API HTTP ${res.status}`);
  }

  const data = await res.json();

  if (data.status === 'REQUEST_DENIED') {
    throw new Error('Invalid API key. Check src/config.ts.');
  }
  if (data.status === 'ZERO_RESULTS') {
    throw new Error('No route found between those locations.');
  }
  if (data.status !== 'OK') {
    throw new Error(`Google Directions API error: ${data.status}`);
  }

  const leg = data.routes[0].legs[0];

  const origin: GeocodedPlace = {
    coords: {lat: leg.start_location.lat, lng: leg.start_location.lng},
    label: shortLabel(leg.start_address),
  };

  const destination: GeocodedPlace = {
    coords: {lat: leg.end_location.lat, lng: leg.end_location.lng},
    label: shortLabel(leg.end_address),
  };

  const steps: RouteStep[] = leg.steps.map(
    (step: {html_instructions: string; distance: {value: number}; maneuver?: string}) => ({
      instruction: stripHtml(step.html_instructions),
      roadName: extractRoadName(step.html_instructions),
      distanceMetres: step.distance.value,
      maneuverType: step.maneuver ?? 'straight',
    }),
  );

  return {
    origin,
    destination,
    steps,
    totalDistanceMetres: leg.distance.value,
    totalDurationSeconds: leg.duration.value,
  };
}

/** Strip HTML tags from Google's html_instructions field. */
function stripHtml(html: string): string {
  return html
    .replace(/<div[^>]*>/gi, ' ') // div separators → space
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extract the road name from html_instructions.
 * Google bolds both direction words ("left") and road names ("Bridge Rd").
 * The road name is the last bold token that isn't a compass/turn word.
 */
function extractRoadName(html: string): string {
  const boldMatches = [...html.matchAll(/<b>([^<]+)<\/b>/g)];
  if (boldMatches.length === 0) {
    return '';
  }
  const directionWords = new Set([
    'north', 'south', 'east', 'west',
    'northeast', 'northwest', 'southeast', 'southwest',
    'left', 'right', 'straight', 'around', 'slight left', 'slight right',
  ]);
  for (let i = boldMatches.length - 1; i >= 0; i--) {
    const text = boldMatches[i][1];
    if (!directionWords.has(text.toLowerCase())) {
      return text;
    }
  }
  return '';
}

/** Keep only the first two comma-separated parts of a Google address string. */
function shortLabel(address: string): string {
  return address
    .split(',')
    .slice(0, 2)
    .map(s => s.trim())
    .join(', ');
}
