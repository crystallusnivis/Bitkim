import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'green' }}>
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Ana Sayfa' }} 
      />
      <Tabs.Screen 
        name="scan" 
        options={{ title: 'QR Okut' }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ title: 'Profil' }} 
      />
    </Tabs>
  );
}
