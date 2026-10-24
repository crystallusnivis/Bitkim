import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function ScanScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Burası QR Okutma Ekranı</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#023a08b4',
  },
  text: {
    fontSize: 18,
    color: '#0dd51d',
    fontWeight: 'bold',
  },
});