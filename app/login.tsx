/**
 * Login Route - Entry point for authentication
 * Integrates authentication system with Expo Router
 */

import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { LoginApiHandler } from '../src/external/handlers/loginApiHandler';
import { saveTokensToStorage } from '../src/session/TokenStore';
import { useSessionContext } from '../src/context/SessionContext';
import type { LoginCredentials } from '../src/models/LoginResult';

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

      // Refresh the session state which will trigger automatic navigation via auth guard
      await refreshSessionState();
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
    placeholder: string,
    secureTextEntry = false
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.input,
          state.errors[field] ? styles.inputError : null,
        ]}
        placeholder={placeholder}
        value={state.formData[field]}
        onChangeText={(value) => updateFormData(field, value)}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={field === 'email' ? 'email-address' : 'default'}
        editable={!state.isLoading}
      />
      {state.errors[field] && (
        <Text style={styles.errorText}>{state.errors[field]}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {state.errors.general && (
          <Text style={styles.generalError}>{state.errors.general}</Text>
        )}

        {renderInputField('email', 'Email')}
        {renderInputField('password', 'Password', true)}

        <TouchableOpacity
          style={[
            styles.button,
            state.isLoading ? styles.buttonDisabled : null,
          ]}
          onPress={handleSubmit}
          disabled={state.isLoading}
        >
          {state.isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 48,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    height: 56,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
  },
  generalError: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  button: {
    height: 56,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
