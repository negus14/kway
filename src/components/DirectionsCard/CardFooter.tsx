import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

interface Props {
  destinationLabel: string;
}

export function CardFooter({destinationLabel}: Props): React.JSX.Element {
  const date = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <View style={styles.arrivedContainer}>
        <Text style={styles.arrivedTitle}>YOU HAVE ARRIVED</Text>
        <Text style={styles.arrivedPlace}>{destinationLabel}</Text>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Generated {date} · Kway</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  arrivedContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 18,
    alignItems: 'center',
  },
  arrivedTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  arrivedPlace: {
    fontSize: 16,
    color: '#888',
    marginTop: 4,
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
    paddingBottom: 4,
  },
  footerText: {
    fontSize: 11,
    color: '#AAAAAA',
    fontFamily: 'System',
  },
});
