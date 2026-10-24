import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { supabase } from '../src/api/supabase';
import { Session } from '@supabase/supabase-js';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // 1. İlk açılışta oturum durumunu al
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // 2. Oturum değişikliklerini (Giriş/Çıkış) dinle
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    // Kullanıcı şu an auth ekranında mı kontrol et
    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      // Oturum yoksa ve auth ekranında değilse, auth'a yönlendir
      router.replace('/auth');
    } else if (session && inAuthGroup) {
      // Oturum varsa ve auth ekranındaysa, ana sayfaya yönlendir
      router.replace('/(tabs)');
    }
  }, [session, initialized, segments]);

  // Yüklenme esnasında yükleniyor ikonu göster
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
    </Stack>
  );
}