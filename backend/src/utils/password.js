import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    throw new Error('Failed to hash password');
  }
};

export const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    throw new Error('Failed to compare password');
  }
};
