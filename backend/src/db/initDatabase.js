import { db } from './database.js';
import { hashPassword } from '../utils/password.js';

export const initializeDatabase = async () => {
  try {
    // Hash demo passwords
    const hashedTeacher = await hashPassword('teacher123');
    const hashedStudent = await hashPassword('student123');

    // Update users with hashed passwords
    db.users = db.users.map(user => ({
      ...user,
      password: user.role === 'teacher' ? hashedTeacher : hashedStudent
    }));

    console.log('✅ Database initialized with hashed passwords');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
  }
};
