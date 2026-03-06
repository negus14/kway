import {useCallback, useReducer} from 'react';
import {DirectionsResult, DirectionsState} from '../types/directions';
import {extractUrl, expandShortUrl, parseGoogleMapsUrl} from '../services/urlParser';
import {fetchDirections} from '../services/directionsApi';

type Action =
  | {type: 'SET_LOADING'; stage: string}
  | {type: 'NEEDS_ORIGIN'; destinationQuery: string}
  | {type: 'SET_SUCCESS'; directions: DirectionsResult}
  | {type: 'SET_ERROR'; message: string}
  | {type: 'RESET'};

function reducer(state: DirectionsState, action: Action): DirectionsState {
  switch (action.type) {
    case 'SET_LOADING':
      return {status: 'loading', stage: action.stage};
    case 'NEEDS_ORIGIN':
      return {status: 'needs_origin', destinationQuery: action.destinationQuery};
    case 'SET_SUCCESS':
      return {status: 'success', directions: action.directions};
    case 'SET_ERROR':
      return {status: 'error', message: action.message};
    case 'RESET':
      return {status: 'idle'};
    default:
      return state;
  }
}

export function useDirections() {
  const [state, dispatch] = useReducer(reducer, {status: 'idle'});

  const processSharedText = useCallback(async (sharedText: string) => {
    dispatch({type: 'SET_LOADING', stage: 'Reading link…'});
    try {
      // 1. Extract URL from share text
      const rawUrl = extractUrl(sharedText);
      if (!rawUrl) {
        dispatch({type: 'SET_ERROR', message: 'No Google Maps link found in the shared text.'});
        return;
      }

      // 2. Expand short URL if needed
      dispatch({type: 'SET_LOADING', stage: 'Expanding link…'});
      const expandedUrl = await expandShortUrl(rawUrl);

      // 3. Parse URL → origin/destination strings
      let parsed;
      try {
        parsed = parseGoogleMapsUrl(expandedUrl);
      } catch {
        dispatch({type: 'SET_ERROR', message: 'Could not read the Google Maps link. Please try again.'});
        return;
      }

      if (!parsed.destinationQuery) {
        dispatch({type: 'SET_ERROR', message: 'Could not find a destination in the link.'});
        return;
      }

      if (!parsed.originQuery) {
        dispatch({type: 'NEEDS_ORIGIN', destinationQuery: parsed.destinationQuery});
        return;
      }

      // 4. Single API call — Google handles geocoding + routing
      await getDirections(parsed.originQuery, parsed.destinationQuery, dispatch);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred.';
      dispatch({type: 'SET_ERROR', message: msg});
    }
  }, []);

  const provideOrigin = useCallback(
    async (originQuery: string) => {
      if (state.status !== 'needs_origin') {
        return;
      }
      dispatch({type: 'SET_LOADING', stage: 'Getting directions…'});
      await getDirections(originQuery, state.destinationQuery, dispatch);
    },
    [state],
  );

  const reset = useCallback(() => dispatch({type: 'RESET'}), []);

  return {state, processSharedText, provideOrigin, reset};
}

async function getDirections(
  originQuery: string,
  destinationQuery: string,
  dispatch: React.Dispatch<Action>,
): Promise<void> {
  dispatch({type: 'SET_LOADING', stage: 'Getting directions…'});
  try {
    const directions = await fetchDirections(originQuery, destinationQuery);
    dispatch({type: 'SET_SUCCESS', directions});
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Could not get directions.';
    dispatch({type: 'SET_ERROR', message: msg});
  }
}
