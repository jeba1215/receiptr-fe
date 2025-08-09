/**
 * Login form validation tests
 */

import type { LoginFormData } from './types';
import { hasFormErrors, validateLoginForm } from './types';

describe('Login Form Validation', () => {
  describe('validateLoginForm', () => {
    it('should return no errors for valid form data', () => {
      const validForm: LoginFormData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const errors = validateLoginForm(validForm);

      expect(errors).toEqual({});
    });

    it('should return error for empty email', () => {
      const formWithEmptyEmail: LoginFormData = {
        email: '',
        password: 'password123',
      };

      const errors = validateLoginForm(formWithEmptyEmail);

      expect(errors.email).toBe('login.form.error.email.required');
      expect(errors.password).toBeUndefined();
    });

    it('should return error for whitespace-only email', () => {
      const formWithWhitespaceEmail: LoginFormData = {
        email: '   ',
        password: 'password123',
      };

      const errors = validateLoginForm(formWithWhitespaceEmail);

      expect(errors.email).toBe('login.form.error.email.required');
    });

    it('should return error for empty password', () => {
      const formWithEmptyPassword: LoginFormData = {
        email: 'test@example.com',
        password: '',
      };

      const errors = validateLoginForm(formWithEmptyPassword);

      expect(errors.password).toBe('login.form.error.password.required');
      expect(errors.email).toBeUndefined();
    });

    it('should return error for password shorter than 6 characters', () => {
      const formWithShortPassword: LoginFormData = {
        email: 'test@example.com',
        password: '12345',
      };

      const errors = validateLoginForm(formWithShortPassword);

      expect(errors.password).toBe('login.form.error.password.min.length');
    });

    it('should return multiple errors for invalid form', () => {
      const invalidForm: LoginFormData = {
        email: '',
        password: '123',
      };

      const errors = validateLoginForm(invalidForm);

      expect(errors.email).toBe('login.form.error.email.required');
      expect(errors.password).toBe('login.form.error.password.min.length');
    });

    it('should accept exactly 6 character password', () => {
      const formWithMinValidPassword: LoginFormData = {
        email: 'test@example.com',
        password: '123456',
      };

      const errors = validateLoginForm(formWithMinValidPassword);

      expect(errors.password).toBeUndefined();
    });
  });

  describe('hasFormErrors', () => {
    it('should return false for empty errors object', () => {
      const result = hasFormErrors({});
      expect(result).toBe(false);
    });

    it('should return true when email error exists', () => {
      const result = hasFormErrors({ email: 'error' });
      expect(result).toBe(true);
    });

    it('should return true when password error exists', () => {
      const result = hasFormErrors({ password: 'error' });
      expect(result).toBe(true);
    });

    it('should return true when general error exists', () => {
      const result = hasFormErrors({ general: 'error' });
      expect(result).toBe(true);
    });

    it('should return true when multiple errors exist', () => {
      const result = hasFormErrors({
        email: 'email error',
        password: 'password error',
        general: 'general error',
      });
      expect(result).toBe(true);
    });
  });
});
