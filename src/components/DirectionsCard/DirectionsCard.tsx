import React, {forwardRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {DirectionsResult} from '../../types/directions';
import {JourneySummary} from './JourneySummary';
import {StepRow} from './StepRow';
import {CardFooter} from './CardFooter';

interface Props {
  directions: DirectionsResult;
}

/**
 * Fixed-width card (375 logical px) wrapped in ViewShot.
 * The parent ScrollView must be OUTSIDE this component so the full-height
 * card is capturable without clipping.
 */
export const DirectionsCard = forwardRef<ViewShot, Props>(({directions}, ref) => {
  const {origin, destination, steps, totalDistanceMetres, totalDurationSeconds} = directions;

  // Exclude the final 'arrive' step from the numbered list — it's shown in CardFooter
  const displaySteps = steps.filter(s => s.maneuverType !== 'arrive');

  return (
    <ViewShot ref={ref} style={styles.card} options={{format: 'png', quality: 1}}>
      {/* Header */}
      <Text style={styles.brand}>Kway</Text>
      <View style={styles.fromTo}>
        <Text style={styles.label}>FROM</Text>
        <Text style={styles.place}>{origin.label}</Text>
        <Text style={[styles.label, styles.toLabelSpacing]}>TO</Text>
        <Text style={styles.place}>{destination.label}</Text>
      </View>

      {/* Summary */}
      <JourneySummary
        totalDistanceMetres={totalDistanceMetres}
        totalDurationSeconds={totalDurationSeconds}
      />

      {/* Steps */}
      {displaySteps.map((step, i) => (
        <StepRow key={i} step={step} index={i} />
      ))}

      {/* Arrived + Footer */}
      <CardFooter destinationLabel={destination.label} />
    </ViewShot>
  );
});

DirectionsCard.displayName = 'DirectionsCard';

const styles = StyleSheet.create({
  card: {
    width: 375,
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  brand: {
    fontSize: 11,
    color: '#AAAAAA',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: 'System',
    marginBottom: 8,
  },
  fromTo: {
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#888888',
    textTransform: 'uppercase',
    letterSpacing: 0.05,
    fontFamily: 'System',
  },
  toLabelSpacing: {
    marginTop: 6,
  },
  place: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    lineHeight: 32,
  },
});
