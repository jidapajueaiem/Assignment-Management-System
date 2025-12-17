import validator from 'validator';

export const validateEmail = (email) => {
  return validator.isEmail(email);
};

export const validatePassword = (password) => {
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' };
  }
  return { valid: true };
};

export const validateUsername = (username) => {
  if (username.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  return { valid: true };
};

export const validateFileSize = (fileSize, maxSize = 50 * 1024 * 1024) => {
  if (fileSize > maxSize) {
    return { valid: false, error: `File size must be less than ${maxSize / 1024 / 1024}MB` };
  }
  return { valid: true };
};

export const sanitizeInput = (input) => {
  return validator.trim(validator.escape(input));
};
