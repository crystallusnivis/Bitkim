import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../src/api/supabase';
import { router } from 'expo-router';

export default function AddPlantScreen() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddPlant = async () => {
    if (!name.trim() || !species.trim()) {
      Alert.alert('Hata', 'Lütfen bitki adı ve türünü boş bırakmayın.');
      return;
    }

    setLoading(true);

    // 1. Şu an giriş yapmış olan kullanıcının ID'sini alıyoruz
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      Alert.alert('Oturum Hatası', 'Bitki eklemek için giriş yapmalısınız.');
      setLoading(false);
      return;
    }

    // 2. Supabase plants tablosuna veriyi ve owner_id'yi kaydediyoruz
    const { error } = await supabase.from('plants').insert([
      {
        name: name.trim(),
        species: species.trim(),
        owner_id: user.id, // Güvenlik için kullanıcı ID'sini bağlıyoruz
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert('Kayıt Hatası', error.message);
    } else {
      Alert.alert('Başarılı', 'Bitkiniz başarıyla eklendi! 🌿');
      router.back(); // Önceki sayfaya dön
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yeni Bitki Ekle 🪴</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Bitki Adı (Örn: Paşa Kılıcı)"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Bitki Türü (Örn: Sansevieria)"
        placeholderTextColor="#888"
        value={species}
        onChangeText={setSpecies}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#2e7d32" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAddPlant}>
          <Text style={styles.buttonText}>Bitkiyi Kaydet</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});