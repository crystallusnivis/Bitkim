import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { supabase } from '../src/api/supabase'; // Proje yapına göre yol değişebilir

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  // 3. Madde: Kamera İzni Kontrolü ve Reddedilme Durumu
  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Bitkileri tarayabilmek için kamera iznine ihtiyacımız var.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>İzin Ver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 2. ve 4. Maddeler: QR Okutma, Veritabanı Kontrolü ve Yönlendirme
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      // Okunan ID'ye ait bitki veritabanında var mı kontrol ediyoruz
      const { data: plant, error } = await supabase
        .from('plants')
        .select('*')
        .eq('id', data)
        .single();

      // 4. Madde: Geçersiz ya da var olmayan bir QR okutulursa:
      if (error || !plant) {
        Alert.alert(
          'Geçersiz QR Kod',
          'Bu QR kod sisteme kayıtlı geçerli bir bitkiye ait değil.',
          [{ text: 'Tekrar Dene', onPress: () => setScanned(false) }]
        );
        return;
      }

      // 2. Madde: Başarılı, okunan ID ile bitki detay sayfasına git
      router.push(`/plant/${plant.id}`);
      
      // Tekrar tarama yapılabilmesi için tarayıcıyı sıfırlayalım (isteğe bağlı)
      setTimeout(() => setScanned(false), 1000);
    } catch (err) {
      Alert.alert('Hata', 'Tarama sırasında bir sorun oluştu.', [
        { text: 'Tamam', onPress: () => setScanned(false) }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.scanInstruction}>Bitkinin QR kodunu çerçeveye yaklaştırın</Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 60,
  },
  scanInstruction: {
    color: '#fff',
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
});