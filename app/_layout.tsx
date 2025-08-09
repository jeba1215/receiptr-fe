import { Slot } from 'expo-router';
import { SessionContextProvider } from '../src/context/SessionContext';

export default function RootLayout() {
  return (
    <SessionContextProvider>
      <Slot />
    </SessionContextProvider>
  );
}
