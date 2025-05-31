// File: middleware/auth.js
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import db from '../models/index.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;
    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User tidak valid' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};
