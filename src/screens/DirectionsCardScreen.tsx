import React, {useRef, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import ViewShot from 'react-native-view-shot';
import {DirectionsResult} from '../types/directions';
import {DirectionsCard} from '../components/DirectionsCard/DirectionsCard';
import {ExportBar} from '../components/ExportBar';
import {shareToWhatsApp, printDirections} from '../services/exporter';

interface Props {
  directions: DirectionsResult;
}

export function DirectionsCardScreen({directions}: Props): React.JSX.Element {
  const viewShotRef = useRef<ViewShot>(null);
  const [exporting, setExporting] = useState(false);

  async function handleWhatsApp() {
    setExporting(true);
    try {
      await shareToWhatsApp(viewShotRef);
    } catch (err) {
      Alert.alert('Export failed', 'Could not share to WhatsApp. Is WhatsApp installed?');
    } finally {
      setExporting(false);
    }
  }

  async function handlePrint() {
    setExporting(true);
    try {
      await printDirections(directions);
    } catch (err) {
      Alert.alert('Print failed', 'Could not open the print dialog.');
    } finally {
      setExporting(false);
    }
  }

  return (
    <View style={styles.screen}>
      {/* ScrollView outside ViewShot so the full card is capturable */}
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <DirectionsCard ref={viewShotRef} directions={directions} />
      </ScrollView>
      <ExportBar onWhatsApp={handleWhatsApp} onPrint={handlePrint} loading={exporting} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
