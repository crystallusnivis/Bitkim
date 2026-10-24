import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { supabase } from '../src/api/supabase';
import { router } from 'expo-router';

// 1. TypeScript Tiplerimiz
type Quote = {
  text: string;
  author: string;
};

type PlantSummary = {
  id: string;
  name: string;
  species: string;
  coverPhotoPath: string | null;
  photoCount: number;
};

type HomeData = {
  quote: Quote;
  myPlants: PlantSummary[];
};

export default function HomeScreen() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      // Tek sorgu ile tüm veriyi RPC üzerinden çekiyoruz
      const { data: result, error } = await supabase.rpc('get_home');

      if (error) throw error;
      setData(result);
    } catch (error) {
      console.error('Ana sayfa verileri çekilemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  // Bitki kartı render fonksiyonu
  const renderPlantItem = ({ item }: { item: PlantSummary }) => {
    // Kapak fotoğrafının public URL'sini alıyoruz
    let coverUrl = null;
    if (item.coverPhotoPath) {
      const { data } = supabase.storage
        .from('plant-photos')
        .getPublicUrl(item.coverPhotoPath);
      coverUrl = data.publicUrl;
    }

    return (
      <TouchableOpacity 
        style={styles.plantCard}
        onPress={() => router.push(`/plant/${item.id}/gallery` as any)}
      >
        {coverUrl ? (
          <Image source={{ uri: coverUrl }} style={styles.plantImage} />
        ) : (
          <View style={[styles.plantImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>🌱</Text>
          </View>
        )}
        
        <View style={styles.plantInfo}>
          <Text style={styles.plantName}>{item.name}</Text>
          <Text style={styles.plantSpecies}>{item.species}</Text>
          <Text style={styles.photoCountText}>📷 {item.photoCount} Fotoğraf</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Günün Sözü Kartı */}
      {data?.quote && (
        <View style={styles.quoteCard}>
          <Text style={styles.quoteTitle}>Günün Sözü</Text>
          <Text style={styles.quoteText}>"{data.quote.text}"</Text>
          <Text style={styles.quoteAuthor}>{data.quote.author}</Text>
        </View>
      )}

      {/* Başlık */}
      <Text style={styles.sectionTitle}>Bitkilerim ({data?.myPlants.length || 0})</Text>

      {/* Bitki Listesi */}
      <FlatList
        data={data?.myPlants || []}
        keyExtractor={(item) => item.id}
        renderItem={renderPlantItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Henüz hiç bitki eklemedin.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#023a08b4',
    padding: 20,
    paddingTop: 60,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteCard: {
    backgroundColor: '#04701a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#036117',
  },
  quoteTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#056b0a',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#043d08',
  },
  quoteAuthor: {
    marginTop: 6,
    textAlign: 'right',
    fontSize: 13,
    color: '#2c9b32',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#094e04',
  },
  listContainer: {
    paddingBottom: 20,
  },
  plantCard: {
    flexDirection: 'row',
    backgroundColor: '#04460f',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#064005',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  plantImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
    backgroundColor: '#0ab30a',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  plantInfo: {
    flex: 1,
    marginLeft: 14,
  },
  plantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  plantSpecies: {
    fontSize: 14,
    color: '#03370f',
    marginTop: 2,
  },
  photoCountText: {
    fontSize: 12,
    color: '#2e7d32',
    marginTop: 6,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#0dd51d',
    fontSize: 15,
  },
});