import express from 'express';
import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../db/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = findUserByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

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
});

export default router;
