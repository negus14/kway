import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RouteStep} from '../../types/directions';
import {metresToMiles} from '../../utils/distance';
import {RoadBadge} from './RoadBadge';

interface Props {
  step: RouteStep;
  index: number;
}

export function StepRow({step, index}: Props): React.JSX.Element {
  const distLabel = step.distanceMetres > 20 ? metresToMiles(step.distanceMetres) : '';

  return (
    <View style={styles.row}>
      <Text style={styles.number}>{index + 1}</Text>
      <View style={styles.body}>
        <Text style={styles.instruction}>{step.instruction}</Text>
        <View style={styles.meta}>
          {step.roadName ? <RoadBadge name={step.roadName} /> : null}
          {distLabel ? <Text style={styles.distance}>{distLabel}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'flex-start',
  },
  number: {
    width: 32,
    fontSize: 16,
    fontWeight: '700',
    color: '#888',
    textAlign: 'center',
    paddingTop: 2,
  },
  body: {
    flex: 1,
    paddingLeft: 8,
  },
  instruction: {
    fontSize: 18,
    color: '#1A1A1A',
    lineHeight: 24,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  distance: {
    fontSize: 13,
    color: '#888',
    fontFamily: 'System',
  },
});
