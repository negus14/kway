import React from 'react';
import {StyleSheet, Text} from 'react-native';

interface Props {
  name: string;
}

export function RoadBadge({name}: Props): React.JSX.Element | null {
  if (!name.trim()) {
    return null;
  }
  return <Text style={styles.badge}>{name}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#E8F4FD',
    color: '#1565C0',
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    fontFamily: 'System',
    alignSelf: 'flex-start',
  },
});
