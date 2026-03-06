import {RefObject} from 'react';
import {captureRef} from 'react-native-view-shot';
import Share from 'react-native-share';
import RNPrint from 'react-native-print';
import {DirectionsResult} from '../types/directions';
import {metresToMiles, secondsToMinutes} from '../utils/distance';

/**
 * Captures the directions card as a PNG and shares it to WhatsApp.
 */
export async function shareToWhatsApp(viewRef: RefObject<unknown>): Promise<void> {
  const fileUri = await captureRef(viewRef, {
    format: 'png',
    quality: 1.0,
    result: 'tmpfile',
    width: 750, // 2× logical width for retina-quality output
  });

  await Share.shareSingle({
    url: fileUri,
    type: 'image/png',
    social: Share.Social.WHATSAPP,
    filename: 'kway-directions',
  });
}

/**
 * Prints the directions card as formatted HTML via the system print dialog.
 */
export async function printDirections(directions: DirectionsResult): Promise<void> {
  const html = buildPrintHtml(directions);
  await RNPrint.print({
    html,
    jobName: 'Kway-Directions',
  });
}

function buildPrintHtml(directions: DirectionsResult): string {
  const {origin, destination, steps, totalDistanceMetres, totalDurationSeconds} = directions;
  const distance = metresToMiles(totalDistanceMetres);
  const duration = secondsToMinutes(totalDurationSeconds);
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const stepRows = steps
    .map((step, i) => {
      const isArrive = step.maneuverType === 'arrive';
      if (isArrive) {
        return '';
      }
      const badge = step.roadName
        ? `<span class="badge">${step.roadName}</span>`
        : '';
      const dist = step.distanceMetres > 0 ? metresToMiles(step.distanceMetres) : '';
      return `
      <tr>
        <td class="step-num">${i + 1}</td>
        <td class="step-body">
          <span class="step-instr">${step.instruction}</span>
          <div class="step-meta">${badge} ${dist}</div>
        </td>
      </tr>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Kway Directions</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; background: #fff; color: #1a1a1a; padding: 24px; max-width: 680px; }
  .header { margin-bottom: 16px; }
  .brand { font-size: 11px; color: #888; letter-spacing: 0.05em; text-transform: uppercase; }
  .from-to { font-size: 28px; font-weight: bold; line-height: 1.3; margin: 8px 0; }
  .label { font-size: 13px; color: #555; text-transform: uppercase; letter-spacing: 0.05em; }
  .summary { font-size: 16px; color: #333; border-top: 1px solid #e0e0e0; border-bottom: 1px solid #e0e0e0; padding: 10px 0; margin: 12px 0; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  td { padding: 8px 4px; vertical-align: top; }
  .step-num { font-size: 18px; font-weight: bold; color: #888; width: 32px; text-align: center; }
  .step-instr { font-size: 18px; }
  .step-meta { margin-top: 4px; }
  .badge { display: inline-block; background: #e8f4fd; color: #1565c0; font-size: 13px; padding: 2px 8px; border-radius: 4px; font-family: Arial, sans-serif; }
  .arrived { text-align: center; padding: 20px 0; border-top: 1px solid #e0e0e0; margin-top: 16px; }
  .arrived-title { font-size: 22px; font-weight: bold; letter-spacing: 0.05em; }
  .arrived-place { font-size: 16px; color: #555; margin-top: 4px; }
  .footer { font-size: 11px; color: #aaa; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="header">
    <div class="brand">Kway</div>
    <div class="from-to">
      <span class="label">From</span> ${origin.label}<br>
      <span class="label">To</span> ${destination.label}
    </div>
  </div>
  <div class="summary">${duration} &middot; ${distance} &middot; Driving</div>
  <table>
    <tbody>
      ${stepRows}
    </tbody>
  </table>
  <div class="arrived">
    <div class="arrived-title">YOU HAVE ARRIVED</div>
    <div class="arrived-place">${destination.label}</div>
  </div>
  <div class="footer">Generated ${date} &middot; Kway</div>
</body>
</html>`;
}
