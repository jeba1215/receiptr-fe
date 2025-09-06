/**
 * Test helpers for React Native Paper components
 * Centralizes custom render functionality for consistent test setup
 */

import { render as rtlRender, RenderOptions } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import React from 'react';

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of the default render from @testing-library/react-native
 */
export function render(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <PaperProvider>
      {children}
    </PaperProvider>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

// Re-export everything else from react-native testing library
export * from '@testing-library/react-native';