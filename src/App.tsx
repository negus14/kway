import React, {useEffect, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './navigation/RootNavigator';
import {LoadingScreen} from './screens/LoadingScreen';
import {DirectionsCardScreen} from './screens/DirectionsCardScreen';
import {ErrorScreen} from './screens/ErrorScreen';
import {useSharedIntent} from './hooks/useSharedIntent';
import {useDirections} from './hooks/useDirections';

export default function App(): React.JSX.Element {
  const sharedText = useSharedIntent();
  const {state, processSharedText, provideOrigin, reset} = useDirections();
  const [originInput, setOriginInput] = useState('');

  // Kick off the pipeline whenever new shared text arrives
  useEffect(() => {
    if (sharedText) {
      processSharedText(sharedText);
    }
  }, [sharedText, processSharedText]);

  function handleOriginSubmit() {
    if (!originInput.trim()) {
      Alert.alert('Please enter your starting location.');
      return;
    }
    provideOrigin(originInput.trim());
    setOriginInput('');
  }

  function renderContent() {
    switch (state.status) {
      case 'idle':
        return (
          <View style={styles.idle}>
            <Text style={styles.idleTitle}>Kway</Text>
            <Text style={styles.idleSubtitle}>
              Share a Google Maps route to this app to generate a directions card.
            </Text>
          </View>
        );

      case 'loading':
        return <LoadingScreen stage={state.stage} />;

      case 'success':
        return <DirectionsCardScreen directions={state.directions} />;

      case 'error':
        return <ErrorScreen message={state.message} onRetry={reset} />;

      case 'needs_origin':
        // Fall through to modal below
        return (
          <View style={styles.idle}>
            <Text style={styles.idleTitle}>Kway</Text>
          </View>
        );
    }
  }

  const showOriginModal = state.status === 'needs_origin';

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <RootNavigator>
          <SafeAreaView style={styles.root}>
            {renderContent()}

            {/* Modal to ask for origin when URL only has a destination */}
            <Modal visible={showOriginModal} transparent animationType="slide">
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalOverlay}>
                <View style={styles.modalCard}>
                  <Text style={styles.modalTitle}>Where are you starting from?</Text>
                  <TextInput
                    style={styles.input}
                    value={originInput}
                    onChangeText={setOriginInput}
                    placeholder="e.g. Waterloo Station, London"
                    autoFocus
                    returnKeyType="go"
                    onSubmitEditing={handleOriginSubmit}
                  />
                  <TouchableOpacity
                    style={styles.goButton}
                    onPress={handleOriginSubmit}
                    activeOpacity={0.7}>
                    <Text style={styles.goButtonText}>Get Directions</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </Modal>
          </SafeAreaView>
        </RootNavigator>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  idle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  idleTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1565C0',
    marginBottom: 16,
  },
  idleSubtitle: {
    fontSize: 18,
    color: '#555555',
    textAlign: 'center',
    lineHeight: 26,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 14,
    fontSize: 18,
    color: '#1A1A1A',
  },
  goButton: {
    backgroundColor: '#1565C0',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  goButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
