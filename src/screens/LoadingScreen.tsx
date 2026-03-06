import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

interface Props {
  stage?: string;
}

export function LoadingScreen({stage = 'Loading…'}: Props): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1565C0" />
      <Text style={styles.stage}>{stage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    gap: 16,
  },
  stage: {
    fontSize: 18,
    color: '#555555',
  },
});
