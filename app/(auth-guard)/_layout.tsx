/**
 * Auth Guard Layout - Protects authenticated routes
 * Redirects to login if user is not authenticated
 */

import { useEffect, useState } from 'react';
import { Slot, router } from 'expo-router';
import { useSessionContext } from '../../src/context/SessionContext';
import { SessionInterceptor } from '../../src/context/SessionInterceptor';

export default function AuthGuardLayout() {
  const { session } = useSessionContext();
  const [isMounted, setIsMounted] = useState(false);

  // Track mount state to prevent navigation before mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only attempt navigation after component is mounted and session is not loading
    if (isMounted && !session.isLoading && !session.isLoggedIn) {
      // Use a small delay to ensure Expo Router is ready
      const timer = setTimeout(() => {
        router.replace('/login');
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [session.isLoggedIn, session.isLoading, isMounted]);

  // Show nothing while session is loading or not mounted
  if (!isMounted || session.isLoading) {
    return null;
  }

  // Don't render anything if not authenticated (navigation will happen)
  if (!session.isLoggedIn) {
    return null;
  }

  // Wrap authenticated routes with SessionInterceptor
  return (
    <SessionInterceptor>
      <Slot />
    </SessionInterceptor>
  );
}
