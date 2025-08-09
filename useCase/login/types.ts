/**
 * Login screen types and validation
 */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface LoginScreenState {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isLoading: boolean;
  isSubmitted: boolean;
}

export const validateLoginForm = (formData: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!formData.email.trim()) {
    errors.email = 'login.form.error.email.required';
  }

  if (!formData.password.trim()) {
    errors.password = 'login.form.error.password.required';
  } else if (formData.password.length < 6) {
    errors.password = 'login.form.error.password.min.length';
  }

  return errors;
};

export const hasFormErrors = (errors: LoginFormErrors): boolean => {
  return Object.keys(errors).length > 0;
};
