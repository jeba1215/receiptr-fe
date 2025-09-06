/**
 * Login Route - Entry point for authentication
 * Integrates authentication system with Expo Router
 */

import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { 
  Button, 
  Card, 
  HelperText, 
  Text, 
  TextInput, 
  Title 
} from 'react-native-paper';
import { useSessionContext } from '../src/context/SessionContext';
import { LoginApiHandler } from '../src/external/handlers/loginApiHandler';
import type { LoginCredentials } from '../src/models/LoginResult';
import { saveTokensToStorage } from '../src/session/TokenStore';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginScreenState {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isLoading: boolean;
  isSubmitted: boolean;
}

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email';
  return undefined;
};

const validatePassword = (password: string): string | undefined => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return undefined;
};

const validateLoginForm = (formData: LoginFormData): LoginFormErrors => {
  return {
    email: validateEmail(formData.email),
    password: validatePassword(formData.password),
  };
};

const hasFormErrors = (errors: LoginFormErrors): boolean => {
  return Object.values(errors).some(error => error !== undefined);
};

export default function LoginRoute() {
  const { refreshSessionState } = useSessionContext();
  const [state, setState] = useState<LoginScreenState>({
    formData: { email: '', password: '' },
    errors: {},
    isLoading: false,
    isSubmitted: false,
  });

  const loginHandler = React.useMemo(() => new LoginApiHandler(), []);

  const updateFormData = useCallback((field: keyof LoginFormData, value: string) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
      // Clear field-specific error when user starts typing
      errors: prev.isSubmitted ?
        { ...prev.errors, [field]: undefined } :
        prev.errors,
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const errors = validateLoginForm(state.formData);

    setState(prev => ({
      ...prev,
      errors,
      isSubmitted: true,
    }));

    if (hasFormErrors(errors)) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, errors: {} }));

    try {
      const credentials: LoginCredentials = {
        email: state.formData.email.trim(),
        password: state.formData.password,
      };

      const loginResult = await loginHandler.login(credentials);
      await saveTokensToStorage(loginResult);

      // Refresh the session state to update authentication status
      await refreshSessionState();

      // Navigate to the recipes page after successful login
      router.replace('/(auth-guard)/(tabs)/recipes');
    } catch (error) {
      console.error('Login failed:', error);

      const errorMessage = error instanceof Error ?
        error.message :
        'Login failed. Please try again.';

      setState(prev => ({
        ...prev,
        errors: { general: errorMessage },
      }));

      Alert.alert(
        'Login Failed',
        'Please check your credentials and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.formData, loginHandler, refreshSessionState]);

  const renderInputField = (
    field: keyof LoginFormData,
    label: string,
    secureTextEntry = false
  ) => (
    <>
      <TextInput
        mode="outlined"
        label={label}
        value={state.formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={field === 'email' ? 'email-address' : 'default'}
        disabled={state.isLoading}
        error={!!state.errors[field]}
        style={styles.input}
      />
      <HelperText type="error" visible={!!state.errors[field]}>
        {state.errors[field]}
      </HelperText>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Welcome Back</Title>
          <Text style={styles.subtitle}>Sign in to your account</Text>

          {state.errors.general && (
            <HelperText type="error" visible={true} style={styles.generalError}>
              {state.errors.general}
            </HelperText>
          )}

          {renderInputField('email', 'Email')}
          {renderInputField('password', 'Password', true)}

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={state.isLoading}
            loading={state.isLoading}
            style={styles.button}
          >
            Sign In
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  card: {
    paddingVertical: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 8,
  },
  generalError: {
    textAlign: 'center',
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
});
