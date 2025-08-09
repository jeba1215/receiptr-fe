/**
 * Index/Home page - Default route for "/"
 * Shows loading screen while checking authentication status
 */

import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useSessionContext } from '../src/context/SessionContext';

export default function Index() {
  const { session } = useSessionContext();

  // Show loading indicator while session is being determined
  if (session.isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect based on authentication status
  if (session.isLoggedIn) {
    return <Redirect href="/(auth-guard)/(tabs)/recipes" />;
  } else {
    return <Redirect href="/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
