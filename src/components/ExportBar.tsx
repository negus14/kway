import React from 'react';
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface Props {
  onWhatsApp: () => void;
  onPrint: () => void;
  loading?: boolean;
}

export function ExportBar({onWhatsApp, onPrint, loading = false}: Props): React.JSX.Element {
  return (
    <View style={styles.bar}>
      {loading ? (
        <ActivityIndicator color="#1565C0" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={onWhatsApp} activeOpacity={0.7}>
            <Text style={styles.buttonText}>Send via WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.printButton]} onPress={onPrint} activeOpacity={0.7}>
            <Text style={[styles.buttonText, styles.printText]}>Print</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  button: {
    flex: 1,
    backgroundColor: '#25D366', // WhatsApp green
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  printButton: {
    backgroundColor: '#1565C0',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  printText: {
    // inherits white colour
  },
});
