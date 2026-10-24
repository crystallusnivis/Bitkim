import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../src/api/supabase';

export default function CameraScreen() {
  const router = useRouter();
  const { plantId } = useLocalSearchParams();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('İzin Gerekli', 'Kamerayı kullanabilmek için izin vermeniz gerekiyor.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadPhoto = async () => {
    if (!imageUri) return;

    try {
      setLoading(true);

      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const filename = `plant_${plantId}_${Date.now()}.jpg`;
      const filePath = `${filename}`;

      const response = await fetch(manipResult.uri);
      const blob = await response.blob();

      const { data: storageData, error: storageError } = await supabase.storage
        .from('plant-photos')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
        });

      if (storageError) throw storageError;

      const { error: dbError } = await supabase.from('photos').insert([
        {
          plant_id: plantId,
          image_url: filePath,
        },
      ]);

      if (dbError) {
        await supabase.storage.from('plant-photos').remove([filePath]);
        throw dbError;
      }

      Alert.alert('Başarılı', 'Fotoğraf başarıyla yüklendi ve kaydedildi!');
      router.back();
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Fotoğraf yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: imageUri }} style={styles.preview} />
          {loading ? (
            <ActivityIndicator size="large" color="#2e7d32" style={styles.loader} />
          ) : (
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.retakeButton} onPress={() => setImageUri(null)}>
                <Text style={styles.buttonText}>Tekrar Çek</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadButton} onPress={uploadPhoto}>
                <Text style={styles.buttonText}>Yükle ve Kaydet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <Text style={styles.captureText}>Kamerayı Aç</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  captureText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  preview: {
    width: '100%',
    height: '60%',
    borderRadius: 15,
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  retakeButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: '#2e7d32',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});