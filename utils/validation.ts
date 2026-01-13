/**
 * Validation Utility
 * Client-side validation rules and helpers
 */

import { RegisterFormData } from '../types';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  message: string;
}

export const validationRules: Record<string, ValidationRule> = {
  username: {
    required: true,
    minLength: 3,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'Username must be 3-50 characters (alphanumeric, underscore, hyphen only)',
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Password must be at least 6 characters',
  },
  full_name: {
    required: true,
    message: 'Full name is required',
  },
  phone: {
    required: true,
    minLength: 10,
    maxLength: 20,
    pattern: /^\+?[0-9]{10,20}$/,
    message: 'Phone must be 10-20 digits',
  },
};

export const validateField = (fieldName: string, value: any): string | null => {
  const rule = validationRules[fieldName];
  if (!rule) return null;

  // Convert value to string for validation
  const stringValue = String(value || '');

  if (rule.required && !stringValue.trim()) {
    return rule.message;
  }

  if (rule.minLength && stringValue.length < rule.minLength) {
    return rule.message;
  }

  if (rule.maxLength && stringValue.length > rule.maxLength) {
    return rule.message;
  }

  if (rule.pattern && !rule.pattern.test(stringValue)) {
    return rule.message;
  }

  return null;
};

export const validateForm = (data: RegisterFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validate basic fields
  const fieldsToValidate = ['username', 'email', 'password', 'full_name', 'phone'];
  fieldsToValidate.forEach((field) => {
    const error = validateField(field, data[field as keyof RegisterFormData]);
    if (error) errors[field] = error;
  });

  // Password confirmation check
  if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  // Station codes check
  if (!data.station_codes || data.station_codes.length === 0) {
    errors.station_codes = 'Please select at least one station';
  }

  // Role check
  if (!data.role) {
    errors.role = 'Please select a role';
  }

  return errors;
};

export const validateStep = (step: number, data: RegisterFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (step === 1) {
    // Step 1: Basic Information
    ['full_name', 'phone', 'email'].forEach((field) => {
      const error = validateField(field, data[field as keyof RegisterFormData]);
      if (error) errors[field] = error;
    });
  } else if (step === 2) {
    // Step 2: Account Credentials
    ['username', 'password'].forEach((field) => {
      const error = validateField(field, data[field as keyof RegisterFormData]);
      if (error) errors[field] = error;
    });

    // Password confirmation
    if (data.password && data.confirmPassword && data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    } else if (!data.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    }
  } else if (step === 3) {
    // Step 3: Role & Permissions
    if (!data.role) {
      errors.role = 'Please select a role';
    }

    if (!data.station_codes || data.station_codes.length === 0) {
      errors.station_codes = 'Please select at least one station';
    }
  }

  return errors;
};
