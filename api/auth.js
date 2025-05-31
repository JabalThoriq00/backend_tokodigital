import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * @swagger
 * /api/auth?action=register:
 *   post:
 *     summary: Register user baru
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *       400:
 *         description: Request tidak valid
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth?action=login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil
 *       400:
 *         description: Email atau password salah
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Ambil profil user berdasarkan token
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil user berhasil diambil
 *       401:
 *         description: Token tidak valid
 */

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { action } = req.query; // action=register atau action=login

    if (action === 'register') {
      try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
          return res.status(400).json({ message: 'Semua field wajib diisi' });
        }

        const existing = await db.User.findOne({
          where: {
            [db.Sequelize.Op.or]: [{ email }, { username }]
          }
        });
        if (existing) {
          return res.status(400).json({ message: 'Username/email sudah terdaftar' });
        }

        const newUser = await db.User.create({
          username,
          email,
          password_hash: password
        });

        // Buat baris wallet baru
        await db.Wallet.create({ user_id: newUser.id });

        const token = jwt.sign(
          { id: newUser.id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(201).json({
          message: 'Registrasi berhasil',
          data: {
            user: { id: newUser.id, username: newUser.username, email: newUser.email },
            token
          }
        });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }

    } else if (action === 'login') {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ message: 'Email & password wajib diisi' });
        }

        const user = await db.User.findOne({ where: { email } });
        if (!user) {
          return res.status(400).json({ message: 'Email atau password salah' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
          return res.status(400).json({ message: 'Email atau password salah' });
        }

        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({
          message: 'Login berhasil',
          data: {
            user: { id: user.id, username: user.username, email: user.email },
            token
          }
        });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }

    } else {
      return res.status(400).json({ message: 'Action tidak valid' });
    }

  } else if (method === 'GET') {
    // GET /api/auth untuk cek profil berdasarkan token
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(' ')[1] : null;
    if (!token) {
      return res.status(401).json({ message: 'Token tidak ditemukan' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db.User.findByPk(decoded.id, {
        attributes: { exclude: ['password_hash'] }
      });
      if (!user) {
        return res.status(401).json({ message: 'User tidak valid' });
      }
      return res.status(200).json({ user });
    } catch (err) {
      return res.status(401).json({ message: 'Token tidak valid' });
    }

  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Metode ${method} tidak diijinkan` });
  }
}
