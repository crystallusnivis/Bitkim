import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../src/api/supabase';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const IMAGE_SIZE = width / COLUMN_COUNT;

type Photo = {
  id: string;
  path: string;
  created_at: string;
};

export default function PlantGalleryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPhotos();
    }
  }, [id]);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('plant_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Fotoğraflar çekilirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path: string) => {
    const { data } = supabase.storage.from('plant-photos').getPublicUrl(path);
    return data.publicUrl;
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photos.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Henüz bu bitkiye ait fotoğraf yok.</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          renderItem={({ item }) => (
            <Image
              source={{ uri: getImageUrl(item.path) }}
              style={styles.image}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderWidth: 1,
    borderColor: '#fff',
  },
});