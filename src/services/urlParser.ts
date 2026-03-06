import {ParsedRoute} from '../types/directions';

/**
 * Extracts the first HTTP(S) URL from a block of text (Google Maps share text
 * often contains a human-readable description followed by the URL).
 */
export function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
}

/**
 * Expands a Google Maps short URL (maps.app.goo.gl/…) by following the
 * redirect.  Returns the expanded URL, or the original if it cannot be
 * expanded.
 */
export async function expandShortUrl(url: string): Promise<string> {
  if (!isShortUrl(url)) {
    return url;
  }
  try {
    // HEAD request first — cheaper and still gives us the redirect location.
    const headRes = await fetch(url, {method: 'HEAD', redirect: 'follow'});
    if (headRes.url && headRes.url !== url) {
      return headRes.url;
    }
    // Fallback: full GET
    const getRes = await fetch(url, {redirect: 'follow'});
    return getRes.url !== url ? getRes.url : url;
  } catch {
    return url;
  }
}

function isShortUrl(url: string): boolean {
  return /maps\.app\.goo\.gl/.test(url) || /goo\.gl\/maps/.test(url);
}

/**
 * Parses a Google Maps URL into origin/destination query strings.
 *
 * Handles 5 shapes:
 *  A — google.com/maps/dir/?api=1&origin=X&destination=Y
 *  B — maps.google.com/maps?saddr=X&daddr=Y
 *  C — google.com/maps/place/Name  (destination only)
 *  D — google.com/maps/dir/ORIGIN_SEGMENT/DEST_SEGMENT
 *  E — maps.app.goo.gl/… (already expanded by the time we get here)
 */
export function parseGoogleMapsUrl(url: string): ParsedRoute {
  const parsed = new URL(url);
  const params = parsed.searchParams;
  const pathname = parsed.pathname;

  // Shape A — modern API URL
  if (params.has('destination') || params.has('api')) {
    return {
      originQuery: params.get('origin') ?? null,
      destinationQuery: params.get('destination') ?? '',
    };
  }

  // Shape B — legacy saddr/daddr
  if (params.has('saddr') || params.has('daddr')) {
    return {
      originQuery: params.get('saddr') ?? null,
      destinationQuery: params.get('daddr') ?? '',
    };
  }

  // Shape D — path coords: /maps/dir/SEGMENT/SEGMENT/…
  if (pathname.includes('/maps/dir/')) {
    const segments = pathname
      .replace('/maps/dir/', '')
      .split('/')
      .map(decodeURIComponent)
      .filter(s => s.length > 0);

    if (segments.length >= 2) {
      return {
        originQuery: segments[0],
        destinationQuery: segments[segments.length - 1],
      };
    }
    if (segments.length === 1) {
      return {originQuery: null, destinationQuery: segments[0]};
    }
  }

  // Shape C — place pin: /maps/place/NAME
  if (pathname.includes('/maps/place/')) {
    const placeName = decodeURIComponent(
      pathname.replace('/maps/place/', '').split('/')[0],
    ).replace(/\+/g, ' ');
    return {originQuery: null, destinationQuery: placeName};
  }

  // Fallback — try 'q' parameter (used by some embeds)
  if (params.has('q')) {
    return {originQuery: null, destinationQuery: params.get('q') ?? ''};
  }

  throw new Error(`Unrecognised Google Maps URL format: ${url}`);
}
