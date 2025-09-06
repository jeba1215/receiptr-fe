import { Slot } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SessionContextProvider } from '../src/context/SessionContext';

export default function RootLayout() {
  return (
    <PaperProvider>
      <SessionContextProvider>
        <Slot />
      </SessionContextProvider>
    </PaperProvider>
  );
}
