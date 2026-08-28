import 'react-native-gesture-handler'; // Adicione esta linha no topo

import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}