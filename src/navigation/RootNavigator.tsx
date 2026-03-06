import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DirectionsResult} from '../types/directions';

// Screens are rendered directly in App.tsx based on state — this navigator
// is a thin shell that provides the NavigationContainer context and can be
// extended with more screens later.

export type RootStackParamList = {
  Directions: {directions: DirectionsResult};
};

const Stack = createStackNavigator<RootStackParamList>();

interface Props {
  children: React.ReactNode;
}

/**
 * Wraps the app in NavigationContainer.  For the MVP, App.tsx drives
 * screen selection based on useDirections state rather than push navigation,
 * keeping the flow simple for elderly users (no back button confusion).
 */
export function RootNavigator({children}: Props): React.JSX.Element {
  return (
    <NavigationContainer>
      {children}
    </NavigationContainer>
  );
}
