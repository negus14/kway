import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {metresToMiles, secondsToMinutes} from '../../utils/distance';

interface Props {
  totalDistanceMetres: number;
  totalDurationSeconds: number;
}

export function JourneySummary({totalDistanceMetres, totalDurationSeconds}: Props): React.JSX.Element {
  const duration = secondsToMinutes(totalDurationSeconds);
  const distance = metresToMiles(totalDistanceMetres);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{duration} · {distance} · Driving</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 10,
    marginVertical: 12,
  },
  text: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'System',
  },
});
