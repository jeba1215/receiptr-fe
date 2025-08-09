/**
 * Login screen component with form validation and error handling
 * Follows SOLID principles with dependency injection
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
import type { LoginApiHandler } from '../../src/external/handlers/loginApiHandler';
import type { LoginCredentials, LoginResult } from '../../src/models/LoginResult';
import type {
  LoginFormData,
  LoginScreenState,
} from './types';
import { hasFormErrors, validateLoginForm } from './types';

export interface LoginScreenProps {
  loginHandler: LoginApiHandler;
  sessionStorage: { setTokens: (loginResult: LoginResult) => Promise<void> };
  onLoginSuccess: () => void;
  onNavigateToRegister?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  loginHandler,
  sessionStorage,
  onLoginSuccess,
  onNavigateToRegister,
}) => {
  const [state, setState] = useState<LoginScreenState>({
    formData: { email: '', password: '' },
    errors: {},
    isLoading: false,
    isSubmitted: false,
  });

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
      await sessionStorage.setTokens(loginResult);

      // Authentication is now handled by the session interceptor
      onLoginSuccess();
    } catch (error) {
      console.error('Login failed:', error);

      const errorMessage = error instanceof Error ?
        error.message :
        'login.form.error.general';

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
  }, [state.formData, loginHandler, sessionStorage, onLoginSuccess]);

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
        onChangeText={(text) => updateFormData(field, text)}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!state.isLoading}
        testID={`login-${field}-input`}
      />
      {state.errors[field] && (
        <Text style={styles.errorText} testID={`login-${field}-error`}>
          {state.errors[field]}
        </Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      testID="login-screen"
    >
      <View style={styles.content}>
        <Text style={styles.title}>login.title</Text>
        <Text style={styles.subtitle}>login.subtitle</Text>

        {state.errors.general && (
          <View style={styles.generalErrorContainer}>
            <Text style={styles.generalErrorText} testID="login-general-error">
              {state.errors.general}
            </Text>
          </View>
        )}

        <View style={styles.form}>
          {renderInputField('email', 'login.form.email.placeholder')}
          {renderInputField('password', 'login.form.password.placeholder', true)}

          <TouchableOpacity
            style={[
              styles.submitButton,
              state.isLoading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={state.isLoading}
            testID="login-submit-button"
          >
            {state.isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>login.form.submit</Text>
            )}
          </TouchableOpacity>

          {onNavigateToRegister && (
            <TouchableOpacity
              style={styles.registerLink}
              onPress={onNavigateToRegister}
              disabled={state.isLoading}
              testID="login-register-link"
            >
              <Text style={styles.registerLinkText}>
                login.form.register.link
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#6B7280',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
    marginLeft: 4,
  },
  generalErrorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  generalErrorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 48,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  registerLinkText: {
    color: '#3B82F6',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
