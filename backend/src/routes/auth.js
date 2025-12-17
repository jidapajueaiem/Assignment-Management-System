import express from 'express';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../db/database.js';
import { comparePassword } from '../utils/password.js';
import { validateUsername, validatePassword } from '../utils/validation.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({ error: usernameValidation.error });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Find user
    const user = findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
